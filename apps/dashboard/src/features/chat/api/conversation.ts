import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageQuerySchema, pageSchemaFactory, conversationSchema, createConversationSchema, updateConversationSchema } from 'models';
import { client } from '@/server/api/openbot-js';

export const conversationRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      return await client.conversations(ctx).get(id);
    }), 
  create: protectedProcedure
    .input(createConversationSchema)
    // .output(datastoreSchema)
    .mutation(async ({ ctx, input }) => {
      const data = {
        ...input,
        creator_id: ctx.session.user.id,
      }
      return await client.conversations(ctx).create(data);
    }),
  update: protectedProcedure
    .input(updateConversationSchema)
    // .output(agentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await client.conversations(ctx).update(id, data);
    }),
  list: protectedProcedure
    .input(z.object({
      agent_id: z.string().optional(),
      provider: z.string().optional(),
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }))
    // .output(pageSchemaFactory(datastoreSchema))
    .query(async ({ ctx, input: query }) => {
      return await client.conversations(ctx).list(query);
    }),
  queryMessages: protectedProcedure
    .input(z.object({
      conversation_id: z.string(),
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }))
    // .output(pageSchemaFactory(datastoreSchema))
    .query(async ({ ctx, input }) => {
      const { conversation_id, ...rest } = input;
      return await client.conversations(ctx).queryMessages(conversation_id, rest);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return await client.conversations(ctx).delete(id);
    }),
  renew: protectedProcedure
    .input(z.object({
      agent_id: z.string(),
    }))
    // .output(conversationSchema)
    .mutation(async ({ ctx, input }) => {
      const data = {
        ...input,
      }
      return await client.conversations(ctx).renew(data);
    }),
});
