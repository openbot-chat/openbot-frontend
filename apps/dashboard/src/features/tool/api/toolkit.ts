import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server'
import { pageSchemaFactory, toolkitSchema, createToolkitSchema, updateToolkitSchema } from 'models'
import { client } from '@/server/api/openbot-js';
import { TRPCError } from '@trpc/server';



export const toolkitRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const toolkit = await client.toolkits().get(id)

      if (!toolkit) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(toolkit.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return toolkit
    }), 
  create: protectedProcedure
    .input(createToolkitSchema)
    // .output(toolSchema)
    .mutation(async ({ input }) => {
      return await client.toolkits().create(input)
    }),
  update: protectedProcedure
    .input(updateToolkitSchema)
    // .output(toolkitSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await client.toolkits().update(id, data)
    }),
  list: protectedProcedure
    .input(z.object({
      org_id: z.string(),
      size: z.number().min(1).max(100).default(20).optional(),
      cursor: z.string().nullish().optional(),
    }))
    // .output(pageSchemaFactory(toolkitSchema))
    .query(async ({ input }) => {
      return await client.toolkits().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {      
      return await client.toolkits().delete(id)
    }),
})