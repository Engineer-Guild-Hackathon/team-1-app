import { z } from 'zod';

export const generateAssessmentSchema = z.object({
  body: z.object({
    userCourseId: z.string().cuid(),
    nodeIds: z.array(z.string().cuid()).optional(),
    difficultyLevel: z.enum(['easy', 'medium', 'hard']).default('medium'),
  }),
});

export const submitAssessmentSchema = z.object({
  params: z.object({
    assessmentId: z.string().cuid(),
  }),
  body: z.object({
    answers: z.array(z.object({
      questionId: z.string().cuid(),
      answer: z.union([z.string(), z.array(z.string())]),
    })),
  }),
});

export const getAssessmentSchema = z.object({
  params: z.object({
    assessmentId: z.string().cuid(),
  }),
});

export type GenerateAssessmentInput = z.infer<typeof generateAssessmentSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;
export type GetAssessmentInput = z.infer<typeof getAssessmentSchema>;