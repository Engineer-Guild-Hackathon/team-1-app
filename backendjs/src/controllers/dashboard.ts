import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';
import { logger } from '../utils/logger';
import {
  CreateStudyLogInput,
  GetStudyLogsInput,
  GetDashboardInput,
} from '../schemas/studyLog';

export class DashboardController {
  async createStudyLog(
    req: Request<{}, {}, CreateStudyLogInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId, date, activityType, nodeIds, minutesStudied, notes } = req.body;

      const result = await dashboardService.createStudyLog(
        userCourseId,
        date,
        activityType,
        nodeIds,
        minutesStudied,
        notes
      );

      logger.info('Study log created', {
        studyLogId: result.id,
        userCourseId,
        minutesStudied,
        requestId: (req as any).requestId,
      });

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudyLogs(
    req: Request<GetStudyLogsInput['params'], {}, {}, GetStudyLogsInput['query']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId } = req.params;
      const { from, to, limit } = req.query;

      const result = await dashboardService.getStudyLogs(
        userCourseId,
        from,
        to,
        limit
      );

      res.json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(
    req: Request<GetDashboardInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId } = req.params;

      const dashboardData = await dashboardService.getDashboardData(userCourseId);

      res.json({
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
}