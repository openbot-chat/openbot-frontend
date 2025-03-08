import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { documentQuerySchema, pageSchemaFactory, datastoreSchema, createDatastoreSchema, updateDatastoreSchema, pageQuerySchema, paginationSchema } from 'models';
import { client } from '@/server/api/openbot-js';
import { TRPCError } from '@trpc/server';

export const datastoreRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const datastore = await client.datastores(ctx).get(id)
      if (!datastore) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'datastore not found' })

      const member = await client.orgs().getMember(datastore.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })

      return datastore
    }), 
  create: protectedProcedure
    .input(createDatastoreSchema)
    // .output(datastoreSchema)
    .mutation(async ({ ctx, input }) => {
      const data = {
        ...input,
        creator_id: ctx.session.user.id,
      }
      return await client.datastores().create(data);
    }),
  update: protectedProcedure
    .input(updateDatastoreSchema)
    // .output(agentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await client.datastores().update(id, data)
    }),
  list: protectedProcedure
    .input(z.object({
      org_id: z.string(),
      name: z.string().optional(),
    }).merge(paginationSchema))
    // .output(pageSchemaFactory(datastoreSchema))
    .query(async ({ ctx, input }) => {
      const member = await client.orgs().getMember(input.org_id, ctx.session.user.id)
      if (!member) throw new TRPCError({ code: 'UNAUTHORIZED' })
      console.warn('input: ', input)
      return await client.datastores().list(input)
    }),
  query: protectedProcedure
    .input(
      z.object({
        datastore_id: z.string(),
        query: documentQuerySchema,
      })
    )
    // .output(pageSchemaFactory(datasourceSchema))
    .query(async ({ ctx, input }) => {
      const { datastore_id, query } = input;
      return await client.datastores().query(datastore_id, query)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return await client.datastores(ctx).delete(id);
    }),
  generateUploadLink: protectedProcedure
    .input(z.object({
      datastoreId: z.string(),
      filename: z.string(),
      type: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { datastoreId, ...data } = input;
      return client.datastores().generateUploadLink(datastoreId, data)
    }),
});
