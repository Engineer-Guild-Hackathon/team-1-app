import { Request, Response, NextFunction } from 'express';
import { roadmapService } from '../services/roadmapService';
import { GetCourseInput } from '../schemas/course';

export class RoadmapController {
  async getRoadmap(
    req: Request<{ courseId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      const roadmap = await roadmapService.getRoadmap(courseId);

      res.json({
        data: roadmap,
      });
    } catch (error) {
      next(error);
    }
  }
}