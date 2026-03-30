import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = registerSchema;

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine((value) => value.title !== undefined || value.completed !== undefined, {
    message: 'At least one field must be provided.',
  });
