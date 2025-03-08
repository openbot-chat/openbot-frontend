import { z } from 'zod'

export const voiceSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  name: z.string(),
  provider: z.string(),
  language: z.string().optional(),
  gender: z.string().optional(),
  options: z.any(),
  sample: z.string().optional(),
  creator_id: z.string().optional(),
  type: z.string().optional(),
  is_cloned: z.boolean().default(false),
  styles: z.array(z.string()).optional(),
  private: z.boolean().default(false),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
});

export const createVoiceSchema = voiceSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateVoiceSchema = createVoiceSchema.partial({

});


export const voiceConfigSchema = voiceSchema.pick({
  identifier: true,
  name: true,
  gender: true,
  provider: true,
  language: true,
  options: true,
  is_cloned: true
}).merge(z.object({
  id: z.string().optional(),
  pitch: z.number().optional(),
  rate: z.number().optional(),
  volume: z.number().optional(),
  style: z.string().optional(),
}));



export type Voice = z.infer<typeof voiceSchema>
export type VoiceConfig = z.infer<typeof voiceConfigSchema>