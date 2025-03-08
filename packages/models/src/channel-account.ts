import { z } from 'zod'

export const channelAccountSchema = z.object({
  id: z.string(),
  avatar: z.string(),
  name: z.string(),
  provider: z.string(),
  enabled: z.string(),
  options: z.any().nullish(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
})

export const createChannelAccountSchema = channelAccountSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updateChannelAccountSchema = createChannelAccountSchema.partial().merge(z.object({
  id: z.string(),
}))


export type ChannelAccount = z.infer<typeof channelAccountSchema>