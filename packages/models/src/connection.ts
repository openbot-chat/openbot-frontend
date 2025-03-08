import { z } from 'zod'

export const connectionSchema = z.object({
  id: z.string(),
  app_id: z.string().optional(),
  org_id: z.string().optional(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  type: z.string().optional(), // oauth 等
  identifier: z.string(),
  icon: z.string().optional(),
  doc_url: z.string().optional(),
  options: z.any().optional(),
})

export const createConnectionSchema = connectionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateConnectionSchema = createConnectionSchema.partial().merge(z.object({
  id: z.string(),
}))


export type Connection = z.infer<typeof connectionSchema>