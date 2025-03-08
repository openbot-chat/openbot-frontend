import { z } from 'zod'

export const appSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  theme: z.string().optional(),
  icon: z.string().optional(),
  options: z.any().nullish(),
  actions: z.array(z.any()),
  connections: z.array(z.any()),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  org_id: z.string().optional(),
  public: z.boolean().default(false),
})

export const createAppSchema = appSchema.omit({
  id: true,
  actions: true,
  connections: true,
  created_at: true,
  updated_at: true,
  creator_id: true,
}).required({
  org_id: true
})

export const updateAppSchema = createAppSchema.partial().merge(z.object({
  id: z.string(),
}))

export type App = z.infer<typeof appSchema>




export const actionSchema = z.object({
  name: z.string(),
  description: z.string(),
  connections: z.array(z.string()), // 关联的 connection, 可能有多个
})
