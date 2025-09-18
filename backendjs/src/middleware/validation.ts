import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { logger } from '../utils/logger';

export function validateRequest(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        logger.warn('Validation failed', {
          requestId: (req as any).requestId,
          errors: result.error.errors,
          path: req.path,
        });

        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: result.error.errors,
          },
        });
      }

      req.body = result.data.body;
      req.query = result.data.query;
      req.params = result.data.params;

      next();
    } catch (error) {
      logger.error('Validation middleware error', {
        requestId: (req as any).requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    }
  };
}