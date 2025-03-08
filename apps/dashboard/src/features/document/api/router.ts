import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { paginationSchema, pageSchemaFactory, documentSchema, createDocumentSchema, updateDocumentSchema } from 'models';
import { client } from '@/server/api/openbot-js';
import { TRPCError } from '@trpc/server';

export const documentRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const document = await client.documents().get(id)
      if (!document) return undefined

      const member = await client.orgs().getMember(document.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return document
    }),
  create: protectedProcedure
    .input(createDocumentSchema)
    // .output(datasourceSchema)
    .mutation(async ({ ctx, input }) => {
      const datasource = await client.datasources().get(input.datasource_id)
      if (!datasource) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.documents().create(input)
    }),
  update: protectedProcedure
    .input(updateDocumentSchema)
    // .output(datasourceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const document = await client.documents().get(id)
      if (!document) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(document.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })
      
      return await client.documents().update(id, data)
    }),
  list: protectedProcedure
    .input(
      z.object({
        datasource_id: z.string(),
      }).merge(paginationSchema)
    )
    // .output(pageSchemaFactory(datasourceSchema))
    .query(async ({ ctx, input }) => {
      const datasource = await client.datasources().get(input.datasource_id)
      if (!datasource) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.documents(ctx).list(input);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const document = await client.documents().get(id)
      if (!document) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(document.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.documents(ctx).delete(id);
    }),
  bulkDelete: protectedProcedure
    .input(z.object({
      ids: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input
      // XXX too simple
      let last_org_id
      for (const id of ids) {
        const document = await client.documents().get(id)
        if (!document) throw new TRPCError({ code: 'NOT_FOUND'})
        if (!!last_org_id && last_org_id === document.org_id) continue

        last_org_id = document.org_id
        const member = await client.orgs().getMember(document.org_id, ctx.session.user.id)
        if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return await client.documents(ctx).bulkDelete(ids)
    }),
});
