import { prisma } from '@/utils/prisma';
import { aiService } from './aiService';
import { logger } from '@/utils/logger';
import { NotFoundError, ConflictError } from '@/middleware/errorHandler';
import { CourseInfo, ProgressSummary } from '@/types';

export class CourseService {
  async getPresetCourses(): Promise<CourseInfo[]> {
    const courses = await prisma.course.findMany({
      where: { isPreset: true },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        isPreset: true,
        createdAt: true,
      },
      orderBy: { title: 'asc' },
    });

    return courses.map(course => ({
      ...course,
      createdAt: course.createdAt.toISOString(),
    }));
  }

  async generateCustomCourse(
    sessionId: string,
    customInput: string,
    searchEnabled = true
  ): Promise<{
    courseId: string;
    title: string;
    description: string;
    roadmapGenerated: boolean;
  }> {
    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new NotFoundError('Session not found');
      }

      const courseTitle = this.extractTitleFromInput(customInput);
      const courseDescription = customInput;

      const course = await prisma.course.create({
        data: {
          title: courseTitle,
          description: courseDescription,
          category: 'Custom',
          isPreset: false,
        },
      });

      try {
        const roadmapData = await aiService.generateRoadmap({
          courseTitle,
          courseDescription,
          customInput,
          searchEnabled,
        });

        await prisma.roadmap.create({
          data: {
            courseId: course.id,
            title: roadmapData.title,
            graphData: roadmapData,
          },
        });

        const nodePromises = roadmapData.nodes.map(node =>
          prisma.knowledgeNode.create({
            data: {
              id: node.id,
              roadmapId: roadmapData.id,
              title: node.title,
              description: node.description,
              prerequisites: node.prerequisites,
              estimatedHours: node.estimatedHours,
              position: node.position,
            },
          })
        );

        await Promise.all(nodePromises);

        logger.info('Custom course with roadmap generated', {
          courseId: course.id,
          sessionId,
          nodeCount: roadmapData.nodes.length,
        });

        return {
          courseId: course.id,
          title: course.title,
          description: course.description,
          roadmapGenerated: true,
        };
      } catch (aiError) {
        logger.warn('Failed to generate roadmap, course created without roadmap', {
          courseId: course.id,
          error: aiError,
        });

        return {
          courseId: course.id,
          title: course.title,
          description: course.description,
          roadmapGenerated: false,
        };
      }
    } catch (error) {
      logger.error('Failed to generate custom course', { error, sessionId, customInput });
      throw error;
    }
  }

  async getCourse(courseId: string): Promise<CourseInfo> {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        isPreset: true,
        createdAt: true,
      },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return {
      ...course,
      createdAt: course.createdAt.toISOString(),
    };
  }

  async createUserCourse(sessionId: string, courseId: string): Promise<{
    userCourseId: string;
    course: CourseInfo;
    status: string;
  }> {
    const [session, course] = await Promise.all([
      prisma.session.findUnique({ where: { id: sessionId } }),
      prisma.course.findUnique({ where: { id: courseId } }),
    ]);

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const existingUserCourse = await prisma.userCourse.findUnique({
      where: {
        sessionId_courseId: {
          sessionId,
          courseId,
        },
      },
    });

    if (existingUserCourse) {
      throw new ConflictError('User is already enrolled in this course');
    }

    const userCourse = await prisma.userCourse.create({
      data: {
        sessionId,
        courseId,
        status: 'active',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            isPreset: true,
            createdAt: true,
          },
        },
      },
    });

    await this.initializeNodeProgress(userCourse.id, courseId);

    return {
      userCourseId: userCourse.id,
      course: {
        ...userCourse.course,
        createdAt: userCourse.course.createdAt.toISOString(),
      },
      status: userCourse.status,
    };
  }

  async getUserCourse(userCourseId: string): Promise<{
    id: string;
    sessionId: string;
    course: CourseInfo;
    status: string;
    progressSummary: ProgressSummary;
  }> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            isPreset: true,
            createdAt: true,
          },
        },
        nodeProgress: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    const progressSummary = this.calculateProgressSummary(userCourse.nodeProgress);

    return {
      id: userCourse.id,
      sessionId: userCourse.sessionId,
      course: {
        ...userCourse.course,
        createdAt: userCourse.course.createdAt.toISOString(),
      },
      status: userCourse.status,
      progressSummary,
    };
  }

  async updateUserCourseStatus(userCourseId: string, status: string): Promise<void> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    await prisma.userCourse.update({
      where: { id: userCourseId },
      data: { status },
    });
  }

  private extractTitleFromInput(input: string): string {
    const sentences = input.split(/[.!?]+/);
    const firstSentence = sentences[0]?.trim();

    if (firstSentence && firstSentence.length <= 100) {
      return firstSentence;
    }

    const words = input.split(' ').slice(0, 10);
    return words.join(' ') + (words.length === 10 ? '...' : '');
  }

  private async initializeNodeProgress(userCourseId: string, courseId: string): Promise<void> {
    const roadmap = await prisma.roadmap.findUnique({
      where: { courseId },
      include: { nodes: true },
    });

    if (!roadmap || roadmap.nodes.length === 0) {
      return;
    }

    const nodeProgressData = roadmap.nodes.map(node => ({
      userCourseId,
      nodeId: node.id,
      status: 'not_started',
      masteryScore: 0,
      studyTimeMinutes: 0,
    }));

    await prisma.userNodeProgress.createMany({
      data: nodeProgressData,
    });

    const startingNodes = roadmap.nodes.filter(node => {
      const prerequisites = node.prerequisites as string[];
      return !prerequisites || prerequisites.length === 0;
    });

    if (startingNodes.length > 0) {
      await prisma.userNodeProgress.updateMany({
        where: {
          userCourseId,
          nodeId: { in: startingNodes.map(node => node.id) },
        },
        data: { status: 'next' },
      });
    }
  }

  private calculateProgressSummary(nodeProgress: Array<{ status: string }>): ProgressSummary {
    const totalNodes = nodeProgress.length;
    const completedNodes = nodeProgress.filter(p => p.status === 'completed').length;
    const nextNodes = nodeProgress.filter(p => p.status === 'next').length;
    const needsReviewNodes = nodeProgress.filter(p => p.status === 'needs_review').length;

    return {
      totalNodes,
      completedNodes,
      nextNodes,
      needsReviewNodes,
    };
  }
}

export const courseService = new CourseService();