import { z } from 'zod'

export enum PlanEnum {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = "ENTERPRISE",
  LIFETIME = 'LIFETIME',
  OFFERED = 'OFFERED',
  CUSTOM = 'CUSTOM',
  UNLIMITED = 'UNLIMITED'
}

export enum FeatureType {
  LOCK = 'LOCK',
  QUOTA = 'QUOTA'
}

export const priceSchema = z.object({
  currency: z.string(),
  nickname: z.string().optional(),
  unit_amount: z.number(),
  price_id: z.string(),
  is_yearly: z.boolean(),
})

export const featureSchema = z.object({
  slug: z.string(),
  name: z.string().optional(),
  type: z.nativeEnum(FeatureType),
  description: z.string().optional(),
  quantity: z.preprocess((val: any) => val === 'inf' ? -1 : val, z.number()).optional(),
  price: priceSchema.optional(),
})

export const planSchema = z.object({
  slug: z.nativeEnum(PlanEnum),
  name: z.string().optional(),
  description: z.string().optional(),
  features: z.array(featureSchema),
  prices: z.array(priceSchema),
})

export type Pricce = z.infer<typeof priceSchema>
export type Feature = z.infer<typeof featureSchema>
export type Plan = z.infer<typeof planSchema>