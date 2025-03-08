import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional().nullish(),
  type: z.string(),
  options: z.any().nullish(),
});

export const createCategorySchema = categorySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateCategorySchema = createCategorySchema.partial().merge(z.object({
  id: z.string(),
}));


export type Category = z.infer<typeof categorySchema>