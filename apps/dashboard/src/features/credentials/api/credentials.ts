import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, credentialsSchema, createCredentialsSchema, updateCredentialsSchema } from 'models';
import { client } from '@/server/api/openbot-js';
import { TRPCError } from '@trpc/server';


export const credentialsRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const credentials = await client.credentials().get(id)
      if (!credentials) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'credentials not found' })

      const member = await client.orgs().getMember(credentials.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return credentials
    }),
  create: protectedProcedure
    .input(createCredentialsSchema)
    // .output(credentialsSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })
    
      const data = {
        ...input,
        creator_id: ctx.session.user.id,
      }
      return await client.credentials({}).create(data)
    }),
  update: protectedProcedure
    .input(updateCredentialsSchema)
    .output(credentialsSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const credentials = await client.credentials().get(id)
      if (!credentials) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'credentials not found' })

      const member = await client.orgs().getMember(credentials.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.credentials(ctx).update(id, data)
    }),
  list: protectedProcedure
    .input(z.object({
      org_id: z.string(),
      q: z.string().optional().nullable(),
      type: z.string().optional(),
      size: z.number().gt(1).lte(100).nullish(),
      cursor: z.string().nullish(),
    }))
    .output(pageSchemaFactory(credentialsSchema))
    .query(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.credentials().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {      
      return await client.credentials(ctx).delete(id)
    }),
});
