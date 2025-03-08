import { z } from 'zod'

export const conversationSchema = z.object({
  id: z.string(),
  agent_id: z.string(),
  user_id: z.string(),
  options: z.any().nullish(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
});

export const createConversationSchema = conversationSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  creator_id: true,
});

export const updateConversationSchema = createConversationSchema.partial().merge(z.object({
  id: z.string(),
}));


export type Conversation = z.infer<typeof conversationSchema>