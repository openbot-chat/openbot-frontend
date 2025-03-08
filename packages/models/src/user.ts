import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  email: z.string().nullish(),
  options: z.any().optional(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
});

export type User = z.infer<typeof userSchema>;