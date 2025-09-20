import { z } from 'zod';

export const generateCourseSchema = z.object({
  body: z.object({
    sessionId: z.string().uuid(),
    customInput: z.string().min(1).max(1000),
    searchEnabled: z.boolean().default(true),
  }),
});

export const getCourseSchema = z.object({
  params: z.object({
    courseId: z.string().cuid(),
  }),
});

export const createUserCourseSchema = z.object({
  body: z.object({
    sessionId: z.string().uuid(),
    courseId: z.string().cuid(),
  }),
});

export const getUserCourseSchema = z.object({
  params: z.object({
    userCourseId: z.string().cuid(),
  }),
});

export const updateUserCourseStatusSchema = z.object({
  params: z.object({
    userCourseId: z.string().cuid(),
  }),
  body: z.object({
    status: z.enum(['active', 'completed', 'paused']),
  }),
});

export const updateNodeProgressSchema = z.object({
  params: z.object({
    userCourseId: z.string().cuid(),
  }),
  body: z.object({
    nodeId: z.string().cuid(),
    status: z.enum(['not_started', 'next', 'completed', 'needs_review']),
    masteryScore: z.number().min(0).max(100).optional(),
    studyTimeMinutes: z.number().min(0).optional(),
  }),
});

export type GenerateCourseInput = z.infer<typeof generateCourseSchema>;
export type GetCourseInput = z.infer<typeof getCourseSchema>;
export type CreateUserCourseInput = z.infer<typeof createUserCourseSchema>;
export type GetUserCourseInput = z.infer<typeof getUserCourseSchema>;
export type UpdateUserCourseStatusInput = z.infer<typeof updateUserCourseStatusSchema>;
export type UpdateNodeProgressInput = z.infer<typeof updateNodeProgressSchema>;