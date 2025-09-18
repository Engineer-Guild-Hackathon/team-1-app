import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { NotFoundError } from '../middleware/errorHandler';
import { RoadmapData, NodeProgress } from '../types';

export class RoadmapService {
  async getRoadmap(courseId: string): Promise<RoadmapData> {
    const roadmap = await prisma.roadmap.findUnique({
      where: { courseId },
      include: {
        nodes: {
          orderBy: { title: 'asc' },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundError('Roadmap not found for this course');
    }

    const graphData = roadmap.graphData as RoadmapData;

    return {
      id: roadmap.id,
      courseId: roadmap.courseId,
      title: roadmap.title,
      nodes: roadmap.nodes.map(node => ({
        id: node.id,
        title: node.title,
        description: node.description,
        prerequisites: node.prerequisites as string[],
        estimatedHours: node.estimatedHours,
        position: node.position as { x: number; y: number },
      })),
      edges: graphData.edges || this.generateEdgesFromPrerequisites(roadmap.nodes),
    };
  }

  async getUserProgress(userCourseId: string): Promise<{
    nodeProgress: NodeProgress[];
  }> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
      include: {
        nodeProgress: {
          include: {
            node: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    const nodeProgress = userCourse.nodeProgress.map(progress => ({
      nodeId: progress.nodeId,
      status: progress.status as NodeProgress['status'],
      masteryScore: progress.masteryScore,
      lastAssessed: progress.lastAssessed?.toISOString(),
      studyTimeMinutes: progress.studyTimeMinutes,
    }));

    return { nodeProgress };
  }

  async updateNodeProgress(
    userCourseId: string,
    nodeId: string,
    status: string,
    masteryScore?: number,
    studyTimeMinutes?: number
  ): Promise<void> {
    const existingProgress = await prisma.userNodeProgress.findUnique({
      where: {
        userCourseId_nodeId: {
          userCourseId,
          nodeId,
        },
      },
      include: {
        node: {
          select: {
            prerequisites: true,
          },
        },
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

    if (!existingProgress) {
      throw new NotFoundError('Node progress not found');
    }

    const updateData: any = { status };

    if (masteryScore !== undefined) {
      updateData.masteryScore = masteryScore;
      updateData.lastAssessed = new Date();
    }

    if (studyTimeMinutes !== undefined) {
      updateData.studyTimeMinutes = existingProgress.studyTimeMinutes + studyTimeMinutes;
    }

    await prisma.userNodeProgress.update({
      where: {
        userCourseId_nodeId: {
          userCourseId,
          nodeId,
        },
      },
      data: updateData,
    });

    if (status === 'completed') {
      await this.unlockNextNodes(userCourseId, nodeId, existingProgress.userCourse.course.roadmaps[0]?.nodes || []);
    }

    logger.info('Node progress updated', {
      userCourseId,
      nodeId,
      status,
      masteryScore,
      studyTimeMinutes,
    });
  }

  private async unlockNextNodes(
    userCourseId: string,
    completedNodeId: string,
    allNodes: Array<{ id: string; prerequisites: any }>
  ): Promise<void> {
    const nodesToUnlock = allNodes.filter(node => {
      const prerequisites = node.prerequisites as string[];
      return prerequisites && prerequisites.includes(completedNodeId);
    });

    if (nodesToUnlock.length === 0) {
      return;
    }

    for (const node of nodesToUnlock) {
      const prerequisites = node.prerequisites as string[];

      const completedPrerequisites = await prisma.userNodeProgress.count({
        where: {
          userCourseId,
          nodeId: { in: prerequisites },
          status: 'completed',
        },
      });

      if (completedPrerequisites === prerequisites.length) {
        await prisma.userNodeProgress.update({
          where: {
            userCourseId_nodeId: {
              userCourseId,
              nodeId: node.id,
            },
          },
          data: { status: 'next' },
        });

        logger.info('Node unlocked', {
          userCourseId,
          nodeId: node.id,
          completedPrerequisites: prerequisites,
        });
      }
    }
  }

  private generateEdgesFromPrerequisites(nodes: Array<{ id: string; prerequisites: any }>): Array<{
    from: string;
    to: string;
    type: 'prerequisite';
  }> {
    const edges: Array<{ from: string; to: string; type: 'prerequisite' }> = [];

    for (const node of nodes) {
      const prerequisites = node.prerequisites as string[];
      if (prerequisites && prerequisites.length > 0) {
        for (const prereqId of prerequisites) {
          edges.push({
            from: prereqId,
            to: node.id,
            type: 'prerequisite',
          });
        }
      }
    }

    return edges;
  }
}

export const roadmapService = new RoadmapService();