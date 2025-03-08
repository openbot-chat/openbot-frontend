import { z } from 'zod'

export const datastoreSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name_for_model: z.string().min(3).max(36),
  description_for_model: z.string(),
  visibility: z.string().nullish(),
  provider: z.string(),
  creator_id: z.string(),
  agent_count: z.number().optional(),
  options: z.any().nullish(),
  org_id: z.string(),
})

export const createDatastoreSchema = datastoreSchema.omit({
  id: true,
  agent_count: true,
  created_at: true,
  updated_at: true,
  creator_id: true,
})

export const updateDatastoreSchema = createDatastoreSchema.partial().merge(z.object({
  id: z.string(),
}))


export type Datastore = z.infer<typeof datastoreSchema>