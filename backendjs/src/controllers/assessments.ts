import { Request, Response, NextFunction } from 'express';
import { assessmentService } from '../services/assessmentService';
import { logger } from '../utils/logger';
import {
  GenerateAssessmentInput,
  SubmitAssessmentInput,
  GetAssessmentInput,
} from '../schemas/assessment';

export class AssessmentController {
  async generateAssessment(
    req: Request<{}, {}, GenerateAssessmentInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId, nodeIds, difficultyLevel } = req.body;

      const result = await assessmentService.generateAssessment(
        userCourseId,
        nodeIds,
        difficultyLevel
      );

      logger.info('Assessment generated', {
        assessmentId: result.assessmentId,
        userCourseId,
        questionCount: result.questions.length,
        requestId: (req as any).requestId,
      });

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitAssessment(
    req: Request<SubmitAssessmentInput['params'], {}, SubmitAssessmentInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { assessmentId } = req.params;
      const { answers } = req.body;

      const result = await assessmentService.submitAssessment(assessmentId, answers);

      logger.info('Assessment submitted', {
        assessmentId,
        score: result.score,
        nodeScoresCount: result.nodeScores.length,
        requestId: (req as any).requestId,
      });

      res.json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssessment(
    req: Request<GetAssessmentInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { assessmentId } = req.params;

      const assessment = await assessmentService.getAssessment(assessmentId);

      res.json({
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }
}