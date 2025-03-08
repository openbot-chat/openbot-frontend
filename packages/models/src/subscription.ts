import { z } from 'zod'
import { PlanEnum } from './plan'

export const subscriptionSchema = z.object({
	plan: z.nativeEnum(PlanEnum),
	price_id: z.string(),
	status: z.string(),
	start_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
	end_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
	cancel_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
	is_yearly: z.boolean(),
})

export type Subscription = z.infer<typeof subscriptionSchema>