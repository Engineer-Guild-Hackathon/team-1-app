import { z } from 'zod';

export const createStudyLogSchema = z.object({
  body: z.object({
    userCourseId: z.string().cuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    activityType: z.enum(['study', 'assessment', 'review']),
    nodeIds: z.array(z.string().cuid()),
    minutesStudied: z.number().min(1),
    notes: z.string().max(500).optional(),
  }),
});

export const getStudyLogsSchema = z.object({
  params: z.object({
    userCourseId: z.string().cuid(),
  }),
  query: z.object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
  }),
});

export const getDashboardSchema = z.object({
  params: z.object({
    userCourseId: z.string().cuid(),
  }),
});

export type CreateStudyLogInput = z.infer<typeof createStudyLogSchema>;
export type GetStudyLogsInput = z.infer<typeof getStudyLogsSchema>;
export type GetDashboardInput = z.infer<typeof getDashboardSchema>;