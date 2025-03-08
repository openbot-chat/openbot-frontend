import { z } from 'zod'

export const customPlanSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  claimed_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  is_yearly: z.boolean().default(false),
  org_id: z.string(),
  storage_limit: z.number(),
  token_limit: z.number(),
  chats_limit: z.number(),
});

export const createCustomPlanSchema = z.object({
  name: z.string(),
});

export const updateCustomPlanSchema = createCustomPlanSchema.partial().merge(z.object({
  id: z.string(),
}));


export type CustomPlan = z.infer<typeof customPlanSchema>