import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, integrationSchema, createIntegrationSchema, updateIntegrationSchema } from 'models';
import { client } from '@/server/api/openbot-js';


export const integrationRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      return await client.integrations().get(id);
    }),
  by_identifier: protectedProcedure
    .input(z.string())
    .query(async ({ input: identifier }) => {
      return await client.integrations().by_identifier(identifier);
    }),
  create: protectedProcedure
    .input(createIntegrationSchema)
    // .output(integrationSchema)
    .mutation(async ({ input }) => {
      console.log('create integration: ', input);
      return await client.integrations().create(input);
    }),
  update: protectedProcedure
    .input(updateIntegrationSchema)
    // .output(integrationSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await client.integrations().update(id, data);
    }),
  list: protectedProcedure
    .input(z.object({
      size: z.number().min(1).max(100).default(20).optional(),
      cursor: z.string().nullish().optional(),
      catalog: z.array(z.string()).nullish().optional(),
      collection: z.string().nullish().optional(),
    }))
    // .output(pageSchemaFactory(integrationSchema))
    .query(async ({ input }) => {
      return await client.integrations().list(input);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id }) => {      
      return await client.integrations().delete(id);
    }),
});
