import { z } from 'zod'
import { avatarSchema } from './avatar'
import { datastoreSchema } from './datastore'
import { agentToolSchema } from './agent_tool'
import { voiceConfigSchema } from './voice'


export enum ActionType {
  Text = 'text',
  Tool = 'tool',
}

export const shortcut = z.object({
  type: z.nativeEnum(ActionType),
  payload: z.any(),
})

export enum AgentVisibility {
  Public = 'public',
  Private = 'private',
}

export const cognitionSchema = z.object({
  image: z.boolean().default(false),
  voice: z.boolean().default(false),
  video: z.boolean().default(false),
});


export const datastoreBindingSchema = z.object({
  id: z.string(),
  datastore_id: z.string(),
  datastore: datastoreSchema.optional(),
  agent_id: z.string().optional(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
})

export const agentSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  identifier: z.string().optional(),
  avatar: avatarSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  }).merge(z.object({
    id: z.string(),
  }).partial()).optional(),
  voice: voiceConfigSchema.optional(),
  cognition: cognitionSchema.default({
    image: false,
    voice: false,
    video: false,
  }),
  shortcuts: z.array(shortcut).optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  creator_id: z.string().optional(),
  visibility: z.nativeEnum(AgentVisibility).default(AgentVisibility.Private),
  options: z.any().nullish(),
  metadata: z.any().optional().default({}),
  datastores: z.array(datastoreBindingSchema).optional(),
  tools: z.array(agentToolSchema).optional(),
  org_id: z.string().nullish(),
})

export const createAgentSchema = agentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  creator_id: true,
}).merge(z.object({
  template_id: z.string().optional().nullable(),
}))

export const updateAgentSchema = createAgentSchema.partial().omit({
  org_id: true,
}).merge(z.object({
  id: z.string(),
}))



export type Agent = z.infer<typeof agentSchema>
export type CreateAgent = z.infer<typeof createAgentSchema>
export type UpdateAgent = z.infer<typeof updateAgentSchema>
export type Cognition = z.infer<typeof cognitionSchema>

export type DatastoreBinding = z.infer<typeof datastoreBindingSchema>
