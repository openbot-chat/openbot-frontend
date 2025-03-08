import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc-server';
// import { } from 'models';
// import { client } from '@/server/api/openbot-js';



export const invitationRouter = router({
  create: protectedProcedure
    .input(z.object({
      email: z.string(),
      organizationid: z.string(),
    }))
    // .output(orgSchema)
    .mutation(async ({ ctx, input }) => {
      return {};
    }),
});
