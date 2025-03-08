import { z } from 'zod'

export const datasourceSchema = z.object({
  id: z.string(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  last_sync: z.preprocess((val: any) => new Date(val), z.date()).optional(),
  name: z.string(),
  type: z.string(),
  status: z.string(),
  creator_id: z.string(),
  options: z.any().nullish(),
  metadata: z.any().optional().default({}),
  datastore_id: z.string(),
  org_id: z.string(),
});

export const createDatasourceSchema = datasourceSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  creator_id: true,
  last_sync: true,
  status: true,
});

export const updateDatasourceSchema = createDatasourceSchema.partial().merge(z.object({
  id: z.string(),
}));


export type Datasource = z.infer<typeof datasourceSchema>


export enum DatasourceStatus {
  pending = 'pending',
  synced = 'synced',
  unsynced = 'unsynced',
  running =  'running',
  error = 'error',
}