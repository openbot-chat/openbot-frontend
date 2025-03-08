import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc-server'
import { Plan, PlanEnum, Subscription } from 'models'
import { client } from '@/server/api/openbot-js'

export const billingRouter = router({
  getPlans: protectedProcedure
    .query<Plan[]>(async () => {
      return await client.plans().list()
    }),
  getSubscription: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
    }))
    .query<Subscription>(async ({ ctx, input: { organizationId } }) => {
      return await client.subscriptions().getByOrganization(organizationId)
    }),
  getBillingPortalUrl: protectedProcedure
    .input(z.object({
      orgId: z.string(),
    }))
    .query<{ url: string }>(async ({ ctx, input: { orgId } }) => {
      return await client.subscriptions().getPortalUrlByOrganization(orgId)
    }),
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        org_id: z.string(),
        plan: z.nativeEnum(PlanEnum),
        price_id: z.string(),
        success_url: z.string(),
        cancel_url: z.string(),
      })
    )
    .output(
      z.object({
        url: z.string().nullish(),
      })
    )
    .mutation(
      async ({ ctx, input }) => {
        return await client.subscriptions().create(input)
      }
    ),
  updateSubscription: protectedProcedure
    .input(
      z.object({
        org_id: z.string(),
        plan: z.nativeEnum(PlanEnum),
        price_id: z.string(),
        success_url: z.string(),
        cancel_url: z.string(),
      })
    )
    .output(
      z.object({
        url: z.string().nullish(),
        plan: z.nativeEnum(PlanEnum),
      })
    )
    .mutation(
      async ({ ctx, input }) => {
        return await client.subscriptions().update(input)
      }
    )
});



