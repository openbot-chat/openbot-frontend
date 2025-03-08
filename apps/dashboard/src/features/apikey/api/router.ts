import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { apiKeySchema, createApiKeySchema, updateApiKeySchema, pageSchemaFactory } from 'models';
import { client } from '@/server/api/openbot-js';



export const apikeyRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      return client.apikeys(ctx).get(id)
    }), 
  create: protectedProcedure
    .input(createApiKeySchema)
    .mutation(async ({ ctx, input }) => {
      const data = {...input, user_id: ctx.session.user.id }
      return await client.apikeys(ctx).create(data)
    }),
  update: protectedProcedure
    .input(updateApiKeySchema)
    // .output(orgSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await client.apikeys(ctx).update(id, data)
    }),
  list: protectedProcedure
    .input(z.object({
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }).nullish())
    .output(pageSchemaFactory(apiKeySchema))
    .query(async ({ ctx, input }) => {
      const data = {...input, user_id: ctx.session.user.id }
      return await client.apikeys(ctx).list(data)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return await client.apikeys(ctx).delete(id)
    }),
});
