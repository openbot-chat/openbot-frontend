import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc-server'
import { pageSchemaFactory, agentToolSchema, createAgentToolSchema, updateAgentToolSchema } from 'models'
import { client } from '@/server/api/openbot-js'
import { TRPCError } from '@trpc/server'



export const agentToolRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      return await client.agentTools().get(id)
    }), 
  create: protectedProcedure
    .input(createAgentToolSchema)
    // .output(agentToolSchema)
    .mutation(async ({ ctx, input }) => {
      const tool = await client.tools().get(input.tool_id)
      if (!tool) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(tool.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.agentTools().create(input)
    }),
  update: protectedProcedure
    .input(updateAgentToolSchema)
    // .output(toolSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await client.agentTools().update(id, data)
    }),
  list: protectedProcedure
    .input(z.object({
      size: z.number().min(1).max(100).default(20).optional(),
      cursor: z.string().nullish().optional(),
    }))
    // .output(pageSchemaFactory(agentToolSchema))
    .query(async ({ input }) => {
      return await client.agentTools().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {      
      return await client.agentTools().delete(id)
    }),
});
