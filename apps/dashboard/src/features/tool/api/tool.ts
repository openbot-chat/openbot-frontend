import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server'
import { pageSchemaFactory, toolSchema, createToolSchema, updateToolSchema } from 'models'
import { client } from '@/server/api/openbot-js';
import { TRPCError } from '@trpc/server';



export const toolRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const tool = await client.tools().get(id)

      if (!tool) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(tool.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })
 
      return tool
    }), 
  create: protectedProcedure
    .input(createToolSchema)
    // .output(toolSchema)
    .mutation(async ({ input }) => {
      return await client.tools().create(input)
    }),
  update: protectedProcedure
    .input(updateToolSchema)
    // .output(toolSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await client.tools().update(id, data);
    }),
  list: protectedProcedure
    .input(z.object({
      org_id: z.string(),
      size: z.number().min(1).max(100).default(20).optional(),
      cursor: z.string().nullish().optional(),
    }))
    // .output(pageSchemaFactory(toolSchema))
    .query(async ({ input }) => {
      return await client.tools().list(input);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      return await client.tools().delete(id)
    }),
})