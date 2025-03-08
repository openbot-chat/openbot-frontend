import { z } from 'zod'
import { toolSchema } from './tool';



export const agentToolSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  tool_id: z.string(),
  agent_id: z.string(),
  tool: toolSchema,
  return_direct: z.boolean().default(false),
  options: z.any().nullish(),
  name: z.string().optional(),
  description: z.string().optional(),
})

export const createAgentToolSchema = z.object({
  agent_id: z.string(),
  tool_id: z.string(),
  options: z.any().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  return_direct: z.boolean().optional().default(false),
})

export const updateAgentToolSchema = z.object({
  id: z.string(),
  options: z.any().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  return_direct: z.boolean().optional().default(false),
})

export type AgentTool = z.infer<typeof agentToolSchema>
export type CreateAgentTool = z.infer<typeof createAgentToolSchema>
export type UpdateAgentTool = z.infer<typeof updateAgentToolSchema>