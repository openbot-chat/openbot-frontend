import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, categorySchema, createCategorySchema, updateCategorySchema } from 'models';
import { client } from '@/server/api/openbot-js';

export const categoryRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      return await client.categories(ctx).get(id);
    }), 
  create: protectedProcedure
    .input(createCategorySchema)
    // .output(categorySchema)
    .mutation(async ({ ctx, input }) => {
      return await client.categories(ctx).create(input);
    }),
  update: protectedProcedure
    .input(updateCategorySchema)
    // .output(categorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await client.categories(ctx).update(id, data);
    }),
  list: protectedProcedure
    .input(z.object({
      type: z.string(),
      size: z.number().min(1).max(100).default(20).optional(),
      cursor: z.string().nullish().optional(),
    }))
    // .output(pageSchemaFactory(categorySchema))
    .query(async ({ ctx, input }) => {
      return await client.categories(ctx).list(input);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {      
      return await client.categories(ctx).delete(id);
    }),
});
