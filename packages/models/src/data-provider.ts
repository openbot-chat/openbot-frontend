import { z } from 'zod'

export const dataProviderSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  identifier: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  options: z.any().nullish(),
});

export const createDataProviderSchema = dataProviderSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateDataProviderSchema = createDataProviderSchema.partial().merge(z.object({
  id: z.string(),
}));


export type DataProvider = z.infer<typeof dataProviderSchema>