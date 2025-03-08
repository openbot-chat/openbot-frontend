import { z } from 'zod'

export const toolSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  description: z.string().optional(),
  return_direct: z.boolean().default(false),
  icon: z.string().optional().nullish(),
  type: z.string(),
  options: z.any().nullish(),
  org_id: z.string(),
})

export const createToolSchema = toolSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateToolSchema = createToolSchema.partial().merge(z.object({
  id: z.string(),
}))

export type Tool = z.infer<typeof toolSchema>