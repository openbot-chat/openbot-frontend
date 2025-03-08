import { z } from 'zod'



export enum RunStepStatus {
  in_progress = 'in_progress',
  cancelled = 'cancelled',
  failed = 'failed',
  completed = 'completed',
  expired = 'expired',
}

export enum RunStepType {
    message_creation = 'message_creation',
    tool_calls = 'tool_calls',
}


export const runStepSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(RunStepType),
  // run_id: UUID
  conversation_id: z.string().optional(),
  status: z.nativeEnum(RunStepStatus),
  created_at: z.number().optional(),
  cancelled_at: z.number().optional(),
  completed_at: z.number().optional(),
  step_details: z.any(),
})



export type RunStep = z.infer<typeof runStepSchema>