import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { NotFoundError } from '../middleware/errorHandler';
import { CreateSessionInput, GetSessionInput } from '../schemas/session';

export class SessionController {
  async createSession(
    req: Request<{}, {}, CreateSessionInput['body']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.body;

      const session = await prisma.session.create({
        data: {
          name: name || undefined,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      logger.info('Session created', {
        sessionId: session.id,
        hasName: !!session.name,
        requestId: (req as any).requestId,
      });

      res.status(201).json({
        data: {
          sessionId: session.id,
          name: session.name,
          createdAt: session.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSession(
    req: Request<GetSessionInput['params']>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId } = req.params;

      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      if (!session) {
        throw new NotFoundError('Session not found');
      }

      res.json({
        data: {
          id: session.id,
          name: session.name,
          createdAt: session.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}