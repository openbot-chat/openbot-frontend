import { TRPCError } from '@trpc/server'
import { OrganizationRole, PlanEnum } from 'models'
import Stripe from 'stripe'
import { z } from 'zod'
import { parseSubscriptionItems } from '../helpers/parseSubscriptionItems'
import { env } from '@openbot/env'
import { protectedProcedure } from '@/server'
import { 
  client,
} from '@/server/api/openbot-js'



export const createCheckoutSession = protectedProcedure
  .input(
    z.object({
      email: z.string(),
      company: z.string(),
      organizationId: z.string(),
      currency: z.enum(['usd', 'eur']),
      plan: z.enum([PlanEnum.STARTER, PlanEnum.PRO]),
      returnUrl: z.string(),
      additionalChats: z.number(),
      additionalStorage: z.number(),
      vat: z
        .object({
          type: z.string(),
          value: z.string(),
        })
        .optional(),
      isYearly: z.boolean(),
    })
  )
  .output(
    z.object({
      checkoutUrl: z.string(),
    })
  )
  .mutation(
    async ({
      input: {
        vat,
        email,
        company,
        organizationId,
        currency,
        plan,
        returnUrl,
        additionalChats,
        additionalStorage,
        isYearly,
      },
      ctx,
    }) => {
      if (!env.STRIPE_SECRET_KEY)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Stripe environment variables are missing',
        })
      const organization = await client.orgs().get(organizationId)
      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        })
      }

      const member = await client.orgs().getMember(organizationId, ctx.session.user.id)

      if (!member || member.role !== OrganizationRole.ADMIN)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        })

      if (organization.stripeId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Customer already exists, use updateSubscription endpoint.',
        })

      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-08-16',
      })

      await client.users().update(ctx.session.user.id, {
        company,
      })

      const customer = await stripe.customers.create({
        email,
        name: company,
        metadata: { organizationId },
        tax_id_data: vat
          ? [vat as Stripe.CustomerCreateParams.TaxIdDatum]
          : undefined,
      })

      const checkoutUrl = await createCheckoutSessionUrl(stripe)({
        customerId: customer.id,
        userId: ctx.session.user.id,
        organizationId,
        currency,
        plan,
        returnUrl,
        additionalChats,
        additionalStorage,
        isYearly,
      })

      if (!checkoutUrl)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Stripe checkout session creation failed',
        })

      return {
        checkoutUrl,
      }
    }
  )

type Props = {
  customerId: string
  organizationId: string
  currency: 'usd' | 'eur'
  plan: 'STARTER' | 'PRO'
  returnUrl: string
  additionalChats: number
  additionalStorage: number
  isYearly: boolean
  userId: string
}

export const createCheckoutSessionUrl = (stripe: Stripe) =>
  async ({
    customerId,
    organizationId,
    currency,
    plan,
    returnUrl,
    additionalChats,
    additionalStorage,
    isYearly,
  }: Props) => {
    const session = await stripe.checkout.sessions.create({
      success_url: `${returnUrl}?stripe=${plan}&success=true`,
      cancel_url: `${returnUrl}?stripe=cancel`,
      allow_promotion_codes: true,
      customer: customerId,
      customer_update: {
        address: 'auto',
        name: 'never',
      },
      mode: 'subscription',
      metadata: {
        organizationId,
        plan,
        additionalChats,
        additionalStorage,
      },
      currency,
      billing_address_collection: 'required',
      automatic_tax: { enabled: true },
      line_items: parseSubscriptionItems(
        plan,
        additionalChats,
        additionalStorage,
        isYearly
      ),
      client_reference_id: organizationId, // 用于关联本地id
    })

    return session.url
  }
