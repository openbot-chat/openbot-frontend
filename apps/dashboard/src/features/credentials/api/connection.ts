import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, connectionSchema, createConnectionSchema, updateConnectionSchema, paginationSchema } from 'models';
import { client } from '@/server/api/openbot-js';


export const connectionRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      return await client.connections().get(id)
    }), 
  byIdentifier: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: identifier }) => {
      return await client.connections().getByIdentifier(identifier)
    }),
  create: protectedProcedure
    .input(createConnectionSchema)
    .output(connectionSchema)
    .mutation(async ({ ctx, input }) => {
      const data = {
        ...input,
        creator_id: ctx.session.user.id,
      }
      return await client.connections().create(data)
    }),
  update: protectedProcedure
    .input(updateConnectionSchema)
    .output(connectionSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await client.connections().update(id, data);
    }),
  list: protectedProcedure
    .input(
      z.object({
        app_id: z.string().optional(),
        name: z.string().optional(),
      }).merge(paginationSchema)
    )
    // .output(pageSchemaFactory(connectionSchema))
    .query(async ({ ctx, input }) => {
      return await client.connections().list(input)
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {      
      return await client.connections().delete(id)
    }),
});
