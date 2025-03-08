import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory, pluginSchema, createPluginSchema, updatePluginSchema } from 'models';
import { client } from '@/server/api/openbot-js';


export const pluginRouter = router({
  importPlugin: protectedProcedure
    .input(z.object({
      url: z.string(),
    }))
    // .output(pluginSchema)
    .mutation(async ({ ctx, input }) => {
      return await client.plugins().load(input); 
    }),
});
