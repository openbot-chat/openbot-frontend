import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, datasourceSchema, createDatasourceSchema, updateDatasourceSchema, pageQuerySchema, paginationSchema } from 'models';
import { client } from '@/server/api/openbot-js';
import { TRPCError } from '@trpc/server';

export const datasourceRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const datasource = await client.datasources().get(id)
      if (!datasource) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'datasource not found' })

      const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return datasource
    }), 
  create: protectedProcedure
    .input(createDatasourceSchema)
    // .output(datasourceSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const data = {
        ...input,
        creator_id: ctx.session.user.id,
      }
      return await client.datasources().create(data)
    }),
  update: protectedProcedure
    .input(updateDatasourceSchema)
    // .output(datasourceSchema)
    .mutation(async ({ ctx, input }) => {
      const datasource = await client.datasources().get(input.id)
      if (!datasource) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const { id, ...data } = input
      return await client.datasources().update(id, data)
    }),
  list: protectedProcedure
    .input(
      z.object({
        datastore_id: z.string(),
        status: z.array(z.string()).optional(),
      }).merge(paginationSchema)
    )
    // .output(pageSchemaFactory(datasourceSchema))
    .query(async ({ ctx, input }) => {
      const datastore = await client.datastores().get(input.datastore_id)
      if (!datastore) throw new TRPCError({ code: 'NOT_FOUND', message: 'datastore not found'})
      const member = await client.orgs().getMember(datastore.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.datasources().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const datasource = await client.datasources().get(id)
      if (!datasource) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.datasources().delete(id)
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
        console.log('bulk id: ', id)
        const datasource = await client.datasources().get(id)
        if (!datasource) throw new TRPCError({ code: 'NOT_FOUND'})
        if (!!last_org_id && last_org_id === datasource.org_id) continue

        last_org_id = datasource.org_id
        const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
        if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return await client.datasources().bulkDelete(ids)
    }),
  sync: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const datasource = await client.datasources().get(id)
      if (!datasource) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.datasources().sync(id);
    }),
  listDocuments: protectedProcedure
    .input(
      z.object({
        datasource_id: z.string().optional(),
      }).merge(paginationSchema)
    )
    // .output(pageSchemaFactory(datasourceSchema))
    .query(async ({ ctx, input }) => {
      const { datasource_id, ...data } = input

      const datasource = await client.datasources().get(datasource_id)
      if (!datasource) throw new TRPCError({ code: 'NOT_FOUND'})
      const member = await client.orgs().getMember(datasource.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return await client.datasources(ctx).listDocuments(datasource_id, data)
    }),
});
