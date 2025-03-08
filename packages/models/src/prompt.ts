import { z } from 'zod'


export const promptSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  content: z.string(),
  input_variables: z.array(z.string()).optional(),
  org_id: z.string(),
})

export const createPromptSchema = promptSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updatePromptSchema = createPromptSchema.partial().merge(z.object({
  id: z.string(),
}))

export type Prompt = z.infer<typeof promptSchema>