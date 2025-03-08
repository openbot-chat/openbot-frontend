import { z } from 'zod'

export const apiKeySchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  token: z.string(),
  expires_in: z.number(),
});

export const createApiKeySchema = z.object({
  name: z.string(),
});

export const updateApiKeySchema = createApiKeySchema.partial().merge(z.object({
  id: z.string(),
}));


export type ApiKey = z.infer<typeof apiKeySchema>