import { z } from 'zod';

export const generateStudyPlanSchema = z.object({
  body: z.object({
    userCourseId: z.string().cuid(),
    targetDays: z.number().min(1).max(365),
    dailyHours: z.number().min(0.5).max(12),
    preferences: z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      weekends: z.boolean().default(true),
      intensiveMode: z.boolean().default(false),
    }).optional(),
  }),
});

export const getStudyPlanSchema = z.object({
  params: z.object({
    studyPlanId: z.string().cuid(),
  }),
});

export const updateStudyPlanProgressSchema = z.object({
  params: z.object({
    studyPlanId: z.string().cuid(),
  }),
  body: z.object({
    day: z.number().min(1),
    completedNodes: z.array(z.string().cuid()),
    actualStudyMinutes: z.number().min(0),
  }),
});

export type GenerateStudyPlanInput = z.infer<typeof generateStudyPlanSchema>;
export type GetStudyPlanInput = z.infer<typeof getStudyPlanSchema>;
export type UpdateStudyPlanProgressInput = z.infer<typeof updateStudyPlanProgressSchema>;