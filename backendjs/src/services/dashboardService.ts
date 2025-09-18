import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { NotFoundError } from '../middleware/errorHandler';
import { HeatmapData, ProgressStats, NodeStats, WeeklyTrend } from '../types';

export class DashboardService {
  async getDashboardData(userCourseId: string): Promise<{
    heatmapData: HeatmapData[];
    progressStats: ProgressStats;
    nodeStats: NodeStats;
    weeklyTrend: WeeklyTrend[];
  }> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
      include: {
        studyLogs: {
          orderBy: { date: 'desc' },
          take: 365,
        },
        nodeProgress: {
          include: {
            node: {
              select: {
                estimatedHours: true,
              },
            },
          },
        },
      },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    const [heatmapData, progressStats, nodeStats, weeklyTrend] = await Promise.all([
      this.generateHeatmapData(userCourse.studyLogs),
      this.calculateProgressStats(userCourse.studyLogs, userCourse.nodeProgress),
      this.calculateNodeStats(userCourse.nodeProgress),
      this.calculateWeeklyTrend(userCourse.studyLogs),
    ]);

    return {
      heatmapData,
      progressStats,
      nodeStats,
      weeklyTrend,
    };
  }

  async createStudyLog(
    userCourseId: string,
    date: string,
    activityType: string,
    nodeIds: string[],
    minutesStudied: number,
    notes?: string
  ): Promise<{
    id: string;
    date: string;
    activityType: string;
    minutesStudied: number;
    nodesStudied: number;
    notes?: string;
  }> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    const studyLog = await prisma.studyLog.create({
      data: {
        userCourseId,
        date: new Date(date),
        activityType,
        nodeIds,
        minutesStudied,
        notes,
      },
    });

    await this.updateNodeStudyTime(userCourseId, nodeIds, minutesStudied);

    logger.info('Study log created', {
      studyLogId: studyLog.id,
      userCourseId,
      minutesStudied,
      nodesStudied: nodeIds.length,
    });

    return {
      id: studyLog.id,
      date: studyLog.date.toISOString().split('T')[0],
      activityType: studyLog.activityType,
      minutesStudied: studyLog.minutesStudied,
      nodesStudied: nodeIds.length,
      notes: studyLog.notes || undefined,
    };
  }

  async getStudyLogs(
    userCourseId: string,
    from?: string,
    to?: string,
    limit = 50
  ): Promise<{
    logs: Array<{
      id: string;
      date: string;
      activityType: string;
      minutesStudied: number;
      nodesStudied: number;
      notes?: string;
    }>;
  }> {
    const userCourse = await prisma.userCourse.findUnique({
      where: { id: userCourseId },
    });

    if (!userCourse) {
      throw new NotFoundError('User course not found');
    }

    const whereClause: any = { userCourseId };

    if (from || to) {
      whereClause.date = {};
      if (from) {
        whereClause.date.gte = new Date(from);
      }
      if (to) {
        whereClause.date.lte = new Date(to);
      }
    }

    const studyLogs = await prisma.studyLog.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit,
    });

    const logs = studyLogs.map(log => ({
      id: log.id,
      date: log.date.toISOString().split('T')[0],
      activityType: log.activityType,
      minutesStudied: log.minutesStudied,
      nodesStudied: (log.nodeIds as string[]).length,
      notes: log.notes || undefined,
    }));

    return { logs };
  }

  private async generateHeatmapData(
    studyLogs: Array<{ date: Date; minutesStudied: number }>
  ): Promise<HeatmapData[]> {
    const heatmapMap = new Map<string, number>();

    studyLogs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0];
      const existingValue = heatmapMap.get(dateKey) || 0;
      heatmapMap.set(dateKey, existingValue + log.minutesStudied);
    });

    const heatmapData: HeatmapData[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      heatmapData.push({
        date: dateKey,
        value: heatmapMap.get(dateKey) || 0,
      });
    }

    return heatmapData;
  }

  private async calculateProgressStats(
    studyLogs: Array<{ date: Date; minutesStudied: number }>,
    nodeProgress: Array<{ status: string; node: { estimatedHours: number } }>
  ): Promise<ProgressStats> {
    const totalStudyMinutes = studyLogs.reduce((sum, log) => sum + log.minutesStudied, 0);
    const totalStudyHours = Math.round((totalStudyMinutes / 60) * 100) / 100;

    const completedNodes = nodeProgress.filter(p => p.status === 'completed');
    const totalEstimatedHours = nodeProgress.reduce((sum, p) => sum + p.node.estimatedHours, 0);
    const completedEstimatedHours = completedNodes.reduce((sum, p) => sum + p.node.estimatedHours, 0);

    const completionPercentage = totalEstimatedHours > 0
      ? Math.round((completedEstimatedHours / totalEstimatedHours) * 100)
      : 0;

    const recentDays = 30;
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - recentDays);

    const recentLogs = studyLogs.filter(log => log.date >= recentDate);
    const averageDailyMinutes = recentLogs.length > 0
      ? Math.round(recentLogs.reduce((sum, log) => sum + log.minutesStudied, 0) / recentDays)
      : 0;

    const streak = this.calculateStreak(studyLogs);
    const lastActiveDate = studyLogs.length > 0
      ? studyLogs[0].date.toISOString().split('T')[0]
      : '';

    return {
      completionPercentage,
      totalStudyHours,
      averageDailyMinutes,
      streak,
      lastActiveDate,
    };
  }

  private async calculateNodeStats(
    nodeProgress: Array<{ status: string }>
  ): Promise<NodeStats> {
    const stats = {
      mastered: 0,
      inProgress: 0,
      notStarted: 0,
      needsReview: 0,
    };

    nodeProgress.forEach(progress => {
      switch (progress.status) {
        case 'completed':
          stats.mastered++;
          break;
        case 'next':
          stats.inProgress++;
          break;
        case 'not_started':
          stats.notStarted++;
          break;
        case 'needs_review':
          stats.needsReview++;
          break;
      }
    });

    return stats;
  }

  private async calculateWeeklyTrend(
    studyLogs: Array<{ date: Date; minutesStudied: number }>
  ): Promise<WeeklyTrend[]> {
    const weeklyData = new Map<string, number>();

    studyLogs.forEach(log => {
      const weekStart = this.getWeekStart(log.date);
      const weekKey = weekStart.toISOString().split('T')[0];
      const existingMinutes = weeklyData.get(weekKey) || 0;
      weeklyData.set(weekKey, existingMinutes + log.minutesStudied);
    });

    const weeks: WeeklyTrend[] = [];
    const today = new Date();
    const twelveWeeksAgo = new Date(today.getTime() - (12 * 7 * 24 * 60 * 60 * 1000));

    for (let d = new Date(twelveWeeksAgo); d <= today; d.setDate(d.getDate() + 7)) {
      const weekStart = this.getWeekStart(d);
      const weekKey = weekStart.toISOString().split('T')[0];
      weeks.push({
        week: weekKey,
        minutes: weeklyData.get(weekKey) || 0,
      });
    }

    return weeks.slice(-12);
  }

  private calculateStreak(studyLogs: Array<{ date: Date }>): number {
    if (studyLogs.length === 0) return 0;

    const dates = [...new Set(studyLogs.map(log => log.date.toISOString().split('T')[0]))];
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date();

    if (dates[0] !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (dates[0] !== yesterday.toISOString().split('T')[0]) {
        return 0;
      }
      checkDate = yesterday;
    }

    for (const dateStr of dates) {
      const logDate = checkDate.toISOString().split('T')[0];
      if (dateStr === logDate) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private getWeekStart(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private async updateNodeStudyTime(
    userCourseId: string,
    nodeIds: string[],
    totalMinutes: number
  ): Promise<void> {
    const minutesPerNode = Math.floor(totalMinutes / Math.max(nodeIds.length, 1));

    const updatePromises = nodeIds.map(nodeId =>
      prisma.userNodeProgress.updateMany({
        where: {
          userCourseId,
          nodeId,
        },
        data: {
          studyTimeMinutes: {
            increment: minutesPerNode,
          },
        },
      })
    );

    await Promise.all(updatePromises);
  }
}

export const dashboardService = new DashboardService();