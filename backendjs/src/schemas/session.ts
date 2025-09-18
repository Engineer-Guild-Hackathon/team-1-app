import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
  }),
});

export const getSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid(),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type GetSessionInput = z.infer<typeof getSessionSchema>;