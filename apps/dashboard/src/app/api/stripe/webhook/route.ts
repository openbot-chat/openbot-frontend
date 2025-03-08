import { NextRequest, NextResponse } from "next/server"
import Stripe from 'stripe'
import { client } from '@/server/api/openbot-js'
import { PlanEnum, OrganizationRole } from 'models'


export const timestampToDate = (t?: number | null) => {
  if (!t) {
    return null
  }
  return new Date(t * 1000)
}

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET)
  throw new Error('STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET missing')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
})

/*
const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})
*/

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(
  req: NextRequest,
) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature')

  if (!sig) return new NextResponse("stripe-signature is missing", { status: 400 })

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig.toString(),
      webhookSecret
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        )
        const metadata = session.metadata as unknown as
          | {
              plan: 'STARTER' | 'PRO'
              additionalChats: string
              additionalStorage: string
              organizationId: string
              userId: string
            }
          | { claimableCustomPlanId: string; userId: string }

        if ('plan' in metadata) {
          const { organizationId, userId, plan, additionalChats, additionalStorage } = metadata
          console.warn('stripe callback: checkout.session.completed >> metadata: ', organizationId, plan, additionalChats, additionalStorage)
          console.warn('stripe callback: checkout.session.completed >> subscription: ', subscription)
  
          if (!organizationId || !plan || !additionalChats || !additionalStorage)
            return NextResponse.json({ message: `Couldn't retrieve valid metadata` }, {
              status: 500,
            })

          // TODO 创建本地订阅关系, 主要是把 organizationId 与 stripe 的 subscription 关联上 
          // XXX 有没有办法把订阅关系在 stripe 中自动用 client_reference_id 关联上
          // TODO 这一段要加上的
          /*
          await client.subscriptions().upsert({
            // relation
            org_id: organizationId,
            user_id: userId,
            id: subscription.id,
            customerId: subscription.customer as string,
            // 冗余字段
            plan,
            status: subscription.status,
            metadata: subscription.metadata,
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: timestampToDate(subscription.canceled_at),
            cancel_at: timestampToDate(subscription.cancel_at),
            start_date: timestampToDate(subscription.start_date),
            ended_at: timestampToDate(subscription.ended_at),
            trial_start: timestampToDate(subscription.trial_start),
            trial_end: timestampToDate(subscription.trial_end),
          })
          */


          /*
          // TODO 这一段要去掉
          // begin
          let customPlan = await client.customPlans().findByOrgId(organizationId)
          if (!customPlan) {
            console.warn('create customPlan1')

            customPlan = await client.customPlans().create({
              plan,
              external_id: session.customer as string,
              // additionalChatsIndex: parseInt(additionalChats),
              // additionalStorageIndex: parseInt(additionalStorage),
              // is_quarantined: false,
            })
            console.warn('create customPlan2: ', customPlan)
          } else {
            console.warn('update customPlan1')
            customPlan = await client.customPlans().update(customPlan.id, {
              plan,
              external_id: session.customer as string,
              // additionalChatsIndex: parseInt(additionalChats),
              // additionalStorageIndex: parseInt(additionalStorage),
              // is_quarantined: false,
            })
            console.warn('update customPlan2: ', customPlan)
          }
          // end
          */

          /*
          for (const user of organization.members.map((member) => member.user)) {
            if (!user?.id) continue

            await sendTelemetryEvents([
              {
                name: 'Subscription updated',
                orgId,
                userId: user.id,
                data: {
                  plan,
                  additionalChatsIndex: parseInt(additionalChats),
                  additionalStorageIndex: parseInt(additionalStorage),
                },
              },
            ])
          }*/
        } else {
          // 自定义 plan, 暂时不实现
          const { claimableCustomPlanId, userId } = metadata
          if (!claimableCustomPlanId)
            return NextResponse.json({ message: `Couldn't retrieve valid metadata` }, {
              status: 500,
            })

          /*
          const { orgId, chatsLimit, seatsLimit, storageLimit } = await client.customPlans().update({
            where: { id: claimableCustomPlanId },
            data: { claimedAt: new Date() },
          })

          await client.orgs().update(orgId, {
            plan: PlanEnum.CUSTOM,
            stripeId: session.customer as string,
            options: {
              customChatsLimit: chatsLimit,
              customStorageLimit: storageLimit,
              customSeatsLimit: seatsLimit,
            }
          })
          */

          /*
          await sendTelemetryEvents([
            {
              name: 'Subscription updated',
              workspaceId,
              userId,
              data: {
                plan: PlanEnum.CUSTOM,
                additionalChatsIndex: 0,
                additionalStorageIndex: 0,
              },
            },
          ])
          */
        }

        return NextResponse.json({ message: 'organization upgraded in DB' }, {
          status: 200,
        })
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // const stripeId = subscription.customer as string

        const dbSubscription = await client.subscriptions().delete(subscription.id);
        
        const organization = await client.orgs().get(dbSubscription.organization_id)
        if (!organization)
          return NextResponse.json({ message: 'organization not found' }, {
            status: 400,
          })

        // 若 没有 subscriptions，可以视作 free, typebot plan 是直接绑定在 workspace/org 上的. 这个综合看下 databerry
        await client.orgs().update(organization.id, {
          plan: PlanEnum.FREE,
          options: {
            additionalChatsIndex: 0,
            additionalStorageIndex: 0,
            customChatsLimit: null,
            customStorageLimit: null,
            customSeatsLimit: null,
          }
        })

        // 应该根据 subscription.id 找到 本地 对应 subscription 对象


        /*
        for (const user of organization.members.map((member) => member.user)) {
          if (!user?.id) continue
          await sendTelemetryEvents([
            {
              name: 'Subscription updated',
              workspaceId: workspace.id,
              userId: user.id,
              data: {
                plan: PlanEnum.FREE,
                additionalChatsIndex: 0,
                additionalStorageIndex: 0,
              },
            },
          ])
        }
        */

        /*
        const typebots = (await prisma.typebot.findMany({
          where: {
            workspaceId: workspace.id,
            isArchived: { not: true },
          },
          include: { publishedTypebot: true },
        })) as (Typebot & { publishedTypebot: PublicTypebot })[]
        
        for (const typebot of typebots) {
          if (typebot.settings.general.isBrandingEnabled) continue
          await prisma.typebot.updateMany({
            where: { id: typebot.id },
            data: {
              settings: {
                ...typebot.settings,
                general: {
                  ...typebot.settings.general,
                  isBrandingEnabled: true,
                },
              },
            },
          })
          
          if (typebot.publishedTypebot.settings.general.isBrandingEnabled)
            continue
          
          await prisma.publicTypebot.updateMany({
            where: { id: typebot.id },
            data: {
              settings: {
                ...typebot.publishedTypebot.settings,
                general: {
                  ...typebot.publishedTypebot.settings.general,
                  isBrandingEnabled: true,
                },
              },
            },
          })
        }
        */

        return NextResponse.json({ message: 'organization downgraded in DB' })
      }
      case 'customer.subscription.updated': {
        console.warn('⚠️ 有必要处理 subscription update 吗，还是说每次 subscription update 都会调用 checkout.session.completed')
        const data = event.data.object as Stripe.Subscription

        // XXX product 里头不一定有 plan 吧, 有可能只是 额外 加购的
        /*
        const product = await stripe.products.retrieve(
          (data as any)?.plan?.product as string
        )

        const plan = product?.metadata?.plan;

        await client.subscriptions().update(data.id, {
          price: {
            connect: {
              id: data.items.data[0].price.id,
            },
          },
          plan: plan,
          status: data.status as any,
          metadata: data.metadata,
          cancel_at_period_end: data.cancel_at_period_end,
          canceled_at: timestampToDate(data.canceled_at),
          cancel_at: timestampToDate(data.cancel_at),
          start_date: timestampToDate(data.start_date),
          ended_at: timestampToDate(data.ended_at),
          trial_start: timestampToDate(data.trial_start),
          trial_end: timestampToDate(data.trial_end),
        })
        */
        break
      }
      default: {
        return NextResponse.json({ message: 'event not handled' }, {
          status: 304,
        })
      }
    }
  } catch(err) {
    if (err instanceof Error) {
      console.error(err)
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    return new NextResponse(`Error occured: ${err}`, { status: 500 });
  }
}