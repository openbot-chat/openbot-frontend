import { z } from 'zod'

export const avatarSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  type: z.string(),
  provider: z.string(),
  thumbnail: z.string(),
  options: z.any().nullish(),
});

export const createAvatarSchema = avatarSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateAvatarSchema = createAvatarSchema.partial().merge(z.object({
  id: z.string(),
}));


export type Avatar = z.infer<typeof avatarSchema>