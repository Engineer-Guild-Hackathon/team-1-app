import { Request, Response, NextFunction } from 'express';
import { courseService } from '../services/courseService';
import { roadmapService } from '../services/roadmapService';
import { logger } from '../utils/logger';
import {
  GenerateCourseInput,
  GetCourseInput,
  CreateUserCourseInput,
  GetUserCourseInput,
  UpdateUserCourseStatusInput,
  UpdateNodeProgressInput,
} from '../schemas/course';

export class CourseController {
  async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courses = await courseService.getPresetCourses();

      res.json({
        data: {
          courses,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async generateCourse(
    req: Request<{}, {}, GenerateCourseInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId, customInput, searchEnabled } = req.body;

      const result = await courseService.generateCustomCourse(
        sessionId,
        customInput,
        searchEnabled
      );

      logger.info('Custom course generation requested', {
        sessionId,
        courseId: result.courseId,
        roadmapGenerated: result.roadmapGenerated,
        requestId: (req as any).requestId,
      });

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourse(
    req: Request<GetCourseInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      const course = await courseService.getCourse(courseId);

      res.json({
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUserCourse(
    req: Request<{}, {}, CreateUserCourseInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId, courseId } = req.body;

      const result = await courseService.createUserCourse(sessionId, courseId);

      logger.info('User course created', {
        userCourseId: result.userCourseId,
        sessionId,
        courseId,
        requestId: (req as any).requestId,
      });

      res.status(201).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserCourse(
    req: Request<GetUserCourseInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId } = req.params;

      const result = await courseService.getUserCourse(userCourseId);

      res.json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserCourseStatus(
    req: Request<UpdateUserCourseStatusInput['params'], {}, UpdateUserCourseStatusInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId } = req.params;
      const { status } = req.body;

      await courseService.updateUserCourseStatus(userCourseId, status);

      logger.info('User course status updated', {
        userCourseId,
        newStatus: status,
        requestId: (req as any).requestId,
      });

      res.json({
        data: {
          message: 'Status updated successfully',
          userCourseId,
          status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserProgress(
    req: Request<GetUserCourseInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId } = req.params;

      const result = await roadmapService.getUserProgress(userCourseId);

      res.json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNodeProgress(
    req: Request<UpdateNodeProgressInput['params'], {}, UpdateNodeProgressInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userCourseId } = req.params;
      const { nodeId, status, masteryScore, studyTimeMinutes } = req.body;

      await roadmapService.updateNodeProgress(
        userCourseId,
        nodeId,
        status,
        masteryScore,
        studyTimeMinutes
      );

      logger.info('Node progress updated', {
        userCourseId,
        nodeId,
        status,
        masteryScore,
        studyTimeMinutes,
        requestId: (req as any).requestId,
      });

      res.json({
        data: {
          message: 'Node progress updated successfully',
          userCourseId,
          nodeId,
          status,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}