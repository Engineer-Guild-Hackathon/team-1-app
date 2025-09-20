import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../src/middleware/validation';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should pass validation with valid data', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string().min(1),
        age: z.number().min(0),
      }),
    });

    mockRequest.body = { name: 'John', age: 25 };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should fail validation with invalid data', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string().min(1),
        age: z.number().min(0),
      }),
    });

    mockRequest.body = { name: '', age: -1 };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: expect.any(Array),
      },
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should validate query parameters', async () => {
    const schema = z.object({
      query: z.object({
        limit: z.coerce.number().min(1).max(100),
      }),
    });

    mockRequest.query = { limit: '50' };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockRequest.query).toEqual({ limit: 50 });
  });

  it('should validate route parameters', async () => {
    const schema = z.object({
      params: z.object({
        id: z.string().uuid(),
      }),
    });

    mockRequest.params = { id: '550e8400-e29b-41d4-a716-446655440000' };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should fail validation for invalid UUID', async () => {
    const schema = z.object({
      params: z.object({
        id: z.string().uuid(),
      }),
    });

    mockRequest.params = { id: 'invalid-uuid' };

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle middleware errors gracefully', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
      }),
    });

    // Mock an error in the validation process
    const originalSafeParse = schema.safeParse;
    schema.safeParse = jest.fn().mockImplementation(() => {
      throw new Error('Validation error');
    });

    const middleware = validateRequest(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });

    // Restore original method
    schema.safeParse = originalSafeParse;
  });
});