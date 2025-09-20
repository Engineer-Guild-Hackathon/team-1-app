import { prisma } from '@/utils/prisma';
import { aiService } from './aiService';
import { roadmapService } from './roadmapService';
import { logger } from '@/utils/logger';
import { NotFoundError } from '@/middleware/errorHandler';
import { StudyPlanPreferences, StudyDay, StudyPlanSummary } from '@/types';

export class StudyPlanService {
  async generateStudyPlan(
    userCourseId: string,
    targetDays: number,
    dailyHours: number,
    preferences?: StudyPlanPreferences
  ): Promise<{
    studyPlanId: string;
    schedule: StudyDay[];
    summary: StudyPlanSummary;
  }> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
      include: {
        course: true,
      },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    const [roadmapData, progressData] = await Promise.all([
      roadmapService.getRoadmap(userCourse.courseId),
      roadmapService.getUserProgress(userCourseId),
    ]);

    try {
      const aiResponse = await aiService.generateStudyPlan({
        roadmap: roadmapData,
        progress: progressData.nodeProgress,
        targetDays,
        dailyHours,
        preferences,
      });

      const studyPlan = await prisma.studyPlan.create({
        data: {
          userCourseId,
          targetDays,
          dailyHours,
          planData: {
            schedule: aiResponse.schedule,
            summary: aiResponse.summary,
            preferences,
          },
          progress: {},
        },
      });

      logger.info('Study plan generated', {
        studyPlanId: studyPlan.id,
        userCourseId,
        targetDays,
        dailyHours,
        totalDays: aiResponse.summary.totalDays,
      });

      return {
        studyPlanId: studyPlan.id,
        schedule: aiResponse.schedule,
        summary: aiResponse.summary,
      };
    } catch (error) {
      logger.error('Failed to generate study plan', { error, userCourseId });
      throw error;
    }
  }

  async getStudyPlan(studyPlanId: string): Promise<{
    id: string;
    userCourseId: string;
    targetDays: number;
    dailyHours: number;
    schedule: StudyDay[];
    summary: StudyPlanSummary;
    progress: Record<string, any>;
    createdAt: string;
  }> {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: studyPlanId },
    });

    if (!studyPlan) {
      throw new NotFoundError('Study plan not found');
    }

    const planData = studyPlan.planData as {
      schedule: StudyDay[];
      summary: StudyPlanSummary;
      preferences?: StudyPlanPreferences;
    };

    return {
      id: studyPlan.id,
      userCourseId: studyPlan.userCourseId,
      targetDays: studyPlan.targetDays,
      dailyHours: studyPlan.dailyHours,
      schedule: planData.schedule,
      summary: planData.summary,
      progress: studyPlan.progress as Record<string, any> || {},
      createdAt: studyPlan.createdAt.toISOString(),
    };
  }

  async updateStudyPlanProgress(
    studyPlanId: string,
    day: number,
    completedNodes: string[],
    actualStudyMinutes: number
  ): Promise<void> {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: studyPlanId },
    });

    if (!studyPlan) {
      throw new NotFoundError('Study plan not found');
    }

    const currentProgress = studyPlan.progress as Record<string, any> || {};
    const dayKey = `day_${day}`;

    currentProgress[dayKey] = {
      completedNodes,
      actualStudyMinutes,
      completedAt: new Date().toISOString(),
    };

    await prisma.studyPlan.update({
      where: { id: studyPlanId },
      data: {
        progress: currentProgress,
      },
    });

    await this.updateNodeProgressFromStudyPlan(
      studyPlan.userCourseId,
      completedNodes,
      actualStudyMinutes
    );

    logger.info('Study plan progress updated', {
      studyPlanId,
      day,
      completedNodes: completedNodes.length,
      actualStudyMinutes,
    });
  }

  private async updateNodeProgressFromStudyPlan(
    userCourseId: string,
    completedNodes: string[],
    studyMinutes: number
  ): Promise<void> {
    const studyMinutesPerNode = Math.floor(studyMinutes / Math.max(completedNodes.length, 1));

    const updatePromises = completedNodes.map(async (nodeId) => {
      const currentProgress = await prisma.userNodeProgress.findUnique({
        where: {
          userCourseId_nodeId: {
            userCourseId,
            nodeId,
          },
        },
      });

      if (currentProgress) {
        await prisma.userNodeProgress.update({
          where: {
            userCourseId_nodeId: {
              userCourseId,
              nodeId,
            },
          },
          data: {
            studyTimeMinutes: currentProgress.studyTimeMinutes + studyMinutesPerNode,
            status: currentProgress.status === 'not_started' ? 'next' : currentProgress.status,
          },
        });
      }
    });

    await Promise.all(updatePromises);

    const today = new Date().toISOString().split('T')[0];
    await prisma.studyLog.create({
      data: {
        userCourseId,
        date: new Date(today),
        minutesStudied: studyMinutes,
        activityType: 'study',
        nodeIds: completedNodes,
        notes: `Study plan progress - Day completion`,
      },
    });
  }
}

export const studyPlanService = new StudyPlanService();