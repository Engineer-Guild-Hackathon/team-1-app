import { Request, Response, NextFunction } from 'express';
import { studyPlanService } from '../services/studyPlanService';
import { logger } from '../utils/logger';
import {
  GenerateStudyPlanInput,
  GetStudyPlanInput,
  UpdateStudyPlanProgressInput,
} from '../schemas/studyPlan';

export class StudyPlanController {
  async generateStudyPlan(
    req: Request<{}, {}, GenerateStudyPlanInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId, targetDays, dailyHours, preferences } = req.body;

      const result = await studyPlanService.generateStudyPlan(
        userCourseId,
        targetDays,
        dailyHours,
        preferences
      );

      logger.info('Study plan generated', {
        studyPlanId: result.studyPlanId,
        userCourseId,
        targetDays,
        dailyHours,
        requestId: (req as any).requestId,
      });

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudyPlan(
    req: Request<GetStudyPlanInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { studyPlanId } = req.params;

      const studyPlan = await studyPlanService.getStudyPlan(studyPlanId);

      res.json({
        data: studyPlan,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStudyPlanProgress(
    req: Request<UpdateStudyPlanProgressInput['params'], {}, UpdateStudyPlanProgressInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { studyPlanId } = req.params;
      const { day, completedNodes, actualStudyMinutes } = req.body;

      await studyPlanService.updateStudyPlanProgress(
        studyPlanId,
        day,
        completedNodes,
        actualStudyMinutes
      );

      logger.info('Study plan progress updated', {
        studyPlanId,
        day,
        completedNodesCount: completedNodes.length,
        actualStudyMinutes,
        requestId: (req as any).requestId,
      });

      res.json({
        data: {
          message: 'Study plan progress updated successfully',
          studyPlanId,
          day,
          completedNodes: completedNodes.length,
          actualStudyMinutes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}