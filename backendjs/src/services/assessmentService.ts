import { prisma } from '../utils/prisma';
import { aiService } from './aiService';
import { logger } from '../utils/logger';
import { NotFoundError, BadRequestError } from '../middleware/errorHandler';
import { DifficultyLevel, AssessmentQuestion, AssessmentAnswer, NodeScore } from '../types';

export class AssessmentService {
  async generateAssessment(
    userCourseId: string,
    nodeIds?: string[],
    difficultyLevel: DifficultyLevel = 'medium'
  ): Promise<{
    assessmentId: string;
    questions: AssessmentQuestion[];
    estimatedMinutes: number;
  }> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
      include: {
        course: {
          include: {
            roadmaps: {
              include: {
                nodes: true,
              },
            },
          },
        },
        nodeProgress: true,
      },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    const roadmap = userCourse.course.roadmaps[0];
    if (!roadmap) {
      throw new NotFoundError('No roadmap found for this course');
    }

    let selectedNodeIds = nodeIds;
    if (!selectedNodeIds || selectedNodeIds.length === 0) {
      selectedNodeIds = this.selectNodesForAssessment(userCourse.nodeProgress, roadmap.nodes);
    }

    if (selectedNodeIds.length === 0) {
      throw new BadRequestError('No nodes available for assessment');
    }

    const selectedNodes = roadmap.nodes.filter(node => selectedNodeIds!.includes(node.id));

    try {
      const aiResponse = await aiService.generateAssessment({
        nodeIds: selectedNodeIds,
        nodeDescriptions: selectedNodes.map(node => `${node.title}: ${node.description}`),
        difficultyLevel,
      });

      const assessment = await prisma.assessmentSession.create({
        data: {
          userCourseId,
          nodeIds: selectedNodeIds,
          questions: aiResponse.questions,
          completed: false,
        },
      });

      logger.info('Assessment generated', {
        assessmentId: assessment.id,
        userCourseId,
        nodeCount: selectedNodeIds.length,
        questionCount: aiResponse.questions.length,
      });

      return {
        assessmentId: assessment.id,
        questions: aiResponse.questions,
        estimatedMinutes: aiResponse.estimatedMinutes,
      };
    } catch (error) {
      logger.error('Failed to generate assessment', { error, userCourseId, nodeIds });
      throw error;
    }
  }

  async submitAssessment(
    assessmentId: string,
    answers: AssessmentAnswer[]
  ): Promise<{
    score: number;
    nodeScores: NodeScore[];
    overallFeedback: string;
  }> {
    const assessment = await prisma.assessmentSession.findUnique({
      where: { id: assessmentId },
      include: {
        userCourse: {
          include: {
            course: {
              include: {
                roadmaps: {
                  include: {
                    nodes: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundError('Assessment not found');
    }

    if (assessment.completed) {
      throw new BadRequestError('Assessment already completed');
    }

    try {
      const evaluationResult = await aiService.evaluateAssessment(assessmentId, answers);

      await prisma.assessmentSession.update({
        where: { id: assessmentId },
        data: {
          answers,
          score: evaluationResult.score,
          completed: true,
        },
      });

      await this.updateNodeProgressFromAssessment(
        assessment.userCourseId,
        evaluationResult.nodeScores
      );

      logger.info('Assessment submitted and evaluated', {
        assessmentId,
        score: evaluationResult.score,
        nodeScores: evaluationResult.nodeScores.length,
      });

      return evaluationResult;
    } catch (error) {
      logger.error('Failed to submit assessment', { error, assessmentId });
      throw error;
    }
  }

  async getAssessment(assessmentId: string): Promise<{
    id: string;
    userCourseId: string;
    nodeIds: string[];
    questions: AssessmentQuestion[];
    answers?: AssessmentAnswer[];
    score?: number;
    completed: boolean;
    createdAt: string;
  }> {
    const assessment = await prisma.assessmentSession.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundError('Assessment not found');
    }

    return {
      id: assessment.id,
      userCourseId: assessment.userCourseId,
      nodeIds: assessment.nodeIds as string[],
      questions: assessment.questions as AssessmentQuestion[],
      answers: assessment.answers as AssessmentAnswer[] | undefined,
      score: assessment.score || undefined,
      completed: assessment.completed,
      createdAt: assessment.createdAt.toISOString(),
    };
  }

  private selectNodesForAssessment(
    nodeProgress: Array<{ nodeId: string; status: string; masteryScore: number; lastAssessed: Date | null }>,
    allNodes: Array<{ id: string }>
  ): string[] {
    const readyNodes = nodeProgress.filter(progress => {
      return progress.status === 'next' ||
             progress.status === 'completed' ||
             (progress.status === 'needs_review' && progress.masteryScore < 70);
    });

    const sortedNodes = readyNodes.sort((a, b) => {
      if (a.status === 'next' && b.status !== 'next') return -1;
      if (b.status === 'next' && a.status !== 'next') return 1;

      if (a.lastAssessed && b.lastAssessed) {
        return a.lastAssessed.getTime() - b.lastAssessed.getTime();
      }

      return a.masteryScore - b.masteryScore;
    });

    return sortedNodes.slice(0, Math.min(5, sortedNodes.length)).map(p => p.nodeId);
  }

  private async updateNodeProgressFromAssessment(
    userCourseId: string,
    nodeScores: NodeScore[]
  ): Promise<void> {
    const updatePromises = nodeScores.map(async (nodeScore) => {
      const newStatus = this.determineNodeStatus(nodeScore.score, nodeScore.recommendedAction);

      await prisma.userNodeProgress.update({
        where: {
          userCourseId_nodeId: {
            userCourseId,
            nodeId: nodeScore.nodeId,
          },
        },
        data: {
          masteryScore: nodeScore.score,
          lastAssessed: new Date(),
          status: newStatus,
        },
      });
    });

    await Promise.all(updatePromises);
  }

  private determineNodeStatus(score: number, recommendedAction: string): string {
    if (recommendedAction === 'master' || score >= 90) {
      return 'completed';
    } else if (recommendedAction === 'review' || score < 70) {
      return 'needs_review';
    } else {
      return 'next';
    }
  }
}

export const assessmentService = new AssessmentService();