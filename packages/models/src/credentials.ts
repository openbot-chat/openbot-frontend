import { z } from 'zod'

export const credentialsSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  type: z.string(),
  data: z.any().nullish(),
  org_id: z.string(),
});

export const createCredentialsSchema = credentialsSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  creator_id: true,
});

export const updateCredentialsSchema = createCredentialsSchema.partial().merge(z.object({
  id: z.string(),
}));


export type Credentials = z.infer<typeof credentialsSchema>