import { z } from 'zod'

export const toolkitSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional().nullish(),
  options: z.any().nullish(),
  org_id: z.string(),
})

export const createToolkitSchema = toolkitSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateToolkitSchema = createToolkitSchema.partial().merge(z.object({
  id: z.string(),
}))

export type Toolkit = z.infer<typeof toolkitSchema>