import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, customPlanSchema, createCustomPlanSchema, updateCustomPlanSchema, paginationSchema } from 'models';
import { client } from '@/server/api/openbot-js';

export const customPlanRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      return await client.customPlans().get(id)
    }), 
  current: protectedProcedure
    // .input(z.string())
    .query(async ({ ctx }) => {
      return await client.customPlans().findByOrgId(ctx.session.orgId)
    }),
  create: protectedProcedure
    .input(createCustomPlanSchema)
    // .output(datasourceSchema)
    .mutation(async ({ ctx, input }) => {
      return await client.customPlans().create(input);
    }),
  update: protectedProcedure
    .input(updateCustomPlanSchema)
    .output(customPlanSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await client.customPlans().update(id, data);
    }),
  list: protectedProcedure
    .input(
      z.object({
      }).merge(paginationSchema)
    )
    .output(pageSchemaFactory(customPlanSchema))
    .query(async ({ ctx, input }) => {
      return await client.customPlans().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return await client.customPlans().delete(id)
    }),
})
