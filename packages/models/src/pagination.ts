import { z } from 'zod'

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
};

export const paginationSchema = z.object({
  current: z.number().gte(1).default(1).nullish(),
  pageSize: z.number().gte(1).lte(1000).default(20).nullish(),
  cursor: z.string().nullish(),
  size: z.number().gte(1).lte(1000).default(20).nullish()
});

export const sortFieldSchema = z.object({
  field: z.string(),
  direction: z.nativeEnum(SortDirection),
});

export const sorterSchema = z.array(sortFieldSchema);

export const pageQuerySchema = z.object({
  pagination: paginationSchema.default({
    current: 1,
    pageSize: 20,
  }).nullish(),
  filter: z.any(),
  sorter: sorterSchema.nullish(),
});

export type Page<T> = {
  items: T[];
  total: number;
}

export const pageSchemaFactory = (itemSchema) => z.object({
  items: z.array(itemSchema),
  total: z.number().optional(),
  previous_page: z.string().optional().nullish(),
  next_page: z.string().optional().nullish(),
});


export type Pagination = z.infer<typeof paginationSchema>;
export type SortField = z.infer<typeof sortFieldSchema>;
export type PageQuery = z.infer<typeof pageQuerySchema>;