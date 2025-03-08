import { z } from 'zod'

export const integrationSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  identifier: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  catalog: z.string(),
  collections: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })).optional(),
  options: z.any().nullish(),
});

export const createIntegrationSchema = integrationSchema.omit({
  id: true,
  collections: true,
  created_at: true,
  updated_at: true,
});

export const updateIntegrationSchema = createIntegrationSchema.partial().merge(z.object({
  id: z.string(),
}));


export type Integration = z.infer<typeof integrationSchema>