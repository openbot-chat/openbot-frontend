import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server'
import { pageSchemaFactory, promptSchema, createPromptSchema, updatePromptSchema, pageQuerySchema, paginationSchema } from 'models'
import { client } from '@/server/api/openbot-js'
import { TRPCError } from '@trpc/server';

export const promptRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const prompt = await client.prompts().get(id)
      if (!prompt) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'prompt not found' })

      const member = await client.orgs().getMember(prompt.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return prompt
    }), 
  create: protectedProcedure
    .input(createPromptSchema)
    // .output(promptSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.prompts().create(input)
    }),
  update: protectedProcedure
    .input(updatePromptSchema)
    // .output(promptSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const prompt = await client.prompts().get(id)
      if (!prompt) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(prompt.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.prompts().update(id, data)
    }),
  list: protectedProcedure
    .input(z.object({
      org_id: z.string(),
      name: z.string().optional(),
    }).merge(paginationSchema))
    // .output(pageSchemaFactory(promptSchema))
    .query(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.prompts().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const prompt = await client.prompts({}).get(id)
      if (!prompt) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(prompt.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.prompts().delete(id)
    }),
});
