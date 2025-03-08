import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc-server'
import { pageSchemaFactory, appSchema, createAppSchema, updateAppSchema } from 'models'
import { client } from '@/server/api/openbot-js'
import { TRPCError } from '@trpc/server'


export const appRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      return await client.apps().get(id)
    }), 
  create: protectedProcedure
    .input(createAppSchema)
    .output(appSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.apps().create(input)
    }),
  update: protectedProcedure
    .input(updateAppSchema)
    // .output(toolSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await client.apps().update(id, data)
    }),
  list: protectedProcedure
    .input(z.object({
      size: z.number().min(1).max(100).default(20).optional(),
      cursor: z.string().nullish().optional(),
      name: z.string().nullish().optional(),
      org_id: z.string(),
    }))
    // .output(pageSchemaFactory(appSchema))
    .query(async ({ input }) => {
      return await client.apps().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {      
      return await client.apps().delete(id)
    }),
});
