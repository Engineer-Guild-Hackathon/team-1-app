import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export class BadRequestError extends Error implements AppError {
  statusCode = 400;
  code = 'BAD_REQUEST';

  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  code = 'NOT_FOUND';

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error implements AppError {
  statusCode = 409;
  code = 'CONFLICT';

  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class ExternalServiceError extends Error implements AppError {
  statusCode = 502;
  code = 'EXTERNAL_SERVICE_ERROR';

  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = (req as any).requestId;

  logger.error('Request error', {
    requestId,
    error: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    code: error.code,
    path: req.path,
    method: req.method,
  });

  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(error.details && { details: error.details }),
    },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}