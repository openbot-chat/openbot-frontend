import { z } from 'zod'
import { router, protectedProcedure } from '../trpc-server'
import { pageQuerySchema, pageSchemaFactory, userSchema } from 'models'

import { client } from '@/server/api/openbot-js';


export const userRouter = router({
  byId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const user = await client.users().get(id)
      if (user.id === ctx.session.user.id) {
        return user
      } else {
        return {
          id: user.id,
          name: user.name,
          image: user.image,
        }
      }
    }),
  update: protectedProcedure
    .input(userSchema.omit({
      updated_at: true,
      created_at: true,
    }).partial())
    .mutation(async ({ ctx, input }) => {
      return await client.users().update(ctx.session.user.id, input)
    }),
  listAgents: protectedProcedure
    .input(
      z.object({
        size: z.number().gt(1).lte(100),
        cursor: z.string().optional(),
      })
    )
    // .output(pageSchemaFactory(agentSchema))
    .query(async ({ input }) => {
      return await client.agents().list(input);
    }),
});
