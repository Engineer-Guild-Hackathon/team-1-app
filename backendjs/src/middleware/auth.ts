import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { NotFoundError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  session?: {
    id: string;
    name?: string;
    createdAt: Date;
  };
}

export async function validateSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionId = req.headers['x-session-id'] as string;

    if (!sessionId) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Session ID is required',
        },
      });
      return;
    }

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

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionId = req.headers['x-session-id'] as string;

    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      if (session) {
        req.session = session;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}