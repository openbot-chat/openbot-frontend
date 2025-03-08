import { z } from 'zod'

export const documentSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  last_sync: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  metadata: z.any().nullish(),
  text: z.string(),
  datasource_id: z.string(),
  org_id: z.string(),
})

export const createDocumentSchema = documentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  last_sync: true,
  org_id: true,
})

export const updateDocumentSchema = createDocumentSchema.partial().merge(z.object({
  id: z.string(),
}))

export const documentMetadataFilterSchema = z.object({
  document_id: z.string().optional(),
  source: z.string().optional(),
  source_id: z.string().optional(),
  author: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export const documentQuerySchema = z.object({
  query: z.string(),
  filter: documentMetadataFilterSchema.optional(),
  top_k: z.number().optional().default(4),
  score_threshold: z.number().optional().nullish(),
  offset: z.number().optional().default(0),
})

export type Document = z.infer<typeof documentSchema>

export const documentChunkSchema = z.object({
})

export type DocumentChunk = z.infer<typeof documentChunkSchema>

export type DocumentQuery = z.infer<typeof documentQuerySchema>
