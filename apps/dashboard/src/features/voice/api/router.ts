import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, voiceSchema, createVoiceSchema, updateVoiceSchema } from 'models';
import { client } from '@/server/api/openbot-js';

export const voiceRouter = router({
  details: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      // return await client.getVoice(id);
    }), 
  create: protectedProcedure
    .input(createVoiceSchema)
    .output(voiceSchema)
    .mutation(async ({ ctx, input: org }) => {
      return null; 
    }),
  update: protectedProcedure
    .input(updateVoiceSchema)
    // .output(recordSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return null;
    }),
  list: protectedProcedure
    .input(z.object({
      provider: z.string(),
      language: z.string().optional(),
    }))
    // .output(pageSchemaFactory(pluginSchema))
    .query(async ({ ctx, input }) => {
      return await client.voices().list(input);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {      
      /* TODO
      return await crmApi.orgOperations.delete(id, {
        requestOptions: {
          customHeaders: {
            user_id: ctx.session.user.id,
          }
        }
      });
      */
    }),
});
