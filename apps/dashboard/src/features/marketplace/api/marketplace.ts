import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
import { pageSchemaFactory } from 'models';
import { client } from '@/server/api/openbot-js';

export const marketplaceRouter = router({
  listAgents: protectedProcedure
    .input(z.object({
      size: z.number().min(1).max(100).default(20).optional(),
      cursor: z.string().nullish().optional(),
    }))
    // .output(pageSchemaFactory(categorySchema))
    .query(async ({ ctx, input }) => {
      return await client.marketplace(ctx).listAgents(input)
    }),
});
