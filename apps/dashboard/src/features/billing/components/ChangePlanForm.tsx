import { Stack, HStack, Text, Switch, Tag } from '@chakra-ui/react'
import { PlanEnum } from 'models'
// import { TextLink } from '@/components/TextLink'
import { useToast } from '@/hooks/useToast'
import { Organization } from 'models'
import { useState } from 'react'
// import { StripeClimateLogo } from './StripeClimateLogo'
import { useTranslations } from 'next-intl'
import { trpc } from '@/utils/trpc-client'
import { useUser } from '@/features/user/UserProvider'
import { useRouter } from 'next/navigation'
import { PlanPricingCard } from './PlanPricingCard'

type Props = {
  organization: Organization
}

export const ChangePlanForm = ({ organization }: Props) => {
  const scopedT = useTranslations('billing');

  const { user } = useUser();

  const router = useRouter()

  const { showToast } = useToast()

  const [isYearly, setIsYearly] = useState(true)

  const { data: plans, isSuccess: isPlansSuccess } = trpc.billing.getPlans.useQuery()

  const { data: subscription, refetch: refetchSubscription, isSuccess: isSubscriptionSuccess } =
    trpc.billing.getSubscription.useQuery(
      {
        organizationId: organization.id
      },
      {
        onSuccess: (subscription) => {
          if (isYearly === false) return
          setIsYearly(subscription?.is_yearly ?? true)
        }
      })

  const { mutate: updateSubscription, isLoading: isUpdatingSubscription } =
    trpc.billing.updateSubscription.useMutation({
      onError: (error) => {
        showToast({
          description: error.message,
        })
      },
      onSuccess: ({ url, plan }) => {
        if (url) {
          window.location.href = url
          return
        }
        refetchSubscription()
        showToast({
          status: 'success',
          description: scopedT('updateSuccessToast.description', { plan: scopedT(`pricingCard.${plan}.name`) }),
        })
      },
    })

  const { mutate: createCheckoutSession, isLoading: isCreatingCheckout } =
    trpc.billing.createCheckoutSession.useMutation({
      onError: (error) => {
        showToast({
          description: error.message,
        })
      },
      onSuccess: ({ url }) => {
        if (url) router.push(url)
      },
    })

  const handlePayClick = async ({ plan, price_id }: { plan: PlanEnum, price_id: string }) => {
    if (!user) return
    if (organization.plan === PlanEnum.FREE) {
      createCheckoutSession({
        org_id: organization.id,
        plan,
        price_id,
        success_url: returnUrl({ plan, success: 'true' }),
        cancel_url: returnUrl({ plan }),
      })
    } else {
      updateSubscription({
        org_id: organization.id,
        plan,
        price_id,
        success_url: returnUrl({ plan, success: 'true' }),
        cancel_url: returnUrl({ plan }),
      })
    }
  }

  return (
    <Stack spacing={6}>
      {/*<HStack maxW="500px">
        <StripeClimateLogo />
        <Text fontSize="xs" color="gray.500">
          {scopedT('contribution.preLink')}{' '}
          <TextLink href="https://climate.stripe.com/5VCRAq" isExternal>
            {scopedT('contribution.link')}
          </TextLink>
        </Text>
      </HStack>
      */}
      {isPlansSuccess && isSubscriptionSuccess && (
        <Stack align="flex-end" spacing={6}>
          <HStack>
            <Text>{scopedT('changePlanForm.monthly')}</Text>
            <Switch
              isChecked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
            />
            <HStack>
              <Text>{scopedT('changePlanForm.yearly')}</Text>
              <Tag colorScheme="blue">{scopedT('changePlanForm.discount')}</Tag>
            </HStack>
          </HStack>
          <HStack alignItems="stretch" spacing="4" w="full">
            {plans.map(plan => (
              <PlanPricingCard
                key={plan.slug}
                plan={plan}
                allPlans={plans}
                currentSubscription={subscription}
                isYearly={isYearly}
                isLoading={isCreatingCheckout || isUpdatingSubscription}
                onPayClick={(props) => handlePayClick({ ...props })}
              />
            ))}
          </HStack>
        </Stack>
      )}

      {/* <Text color="gray.500">
        {scopedT('customLimit.preLink')}{' '}
        <TextLink href={'https://openbot.chat/enterprise-lead-form'} isExternal>
          {scopedT('customLimit.link')}
        </TextLink>
      </Text> */}
    </Stack>
  )
}

const returnUrl = (query: { [k: string]: string }): string => {
  const url = new URL(window.location.href);
  for (const k in query) {
    url.searchParams.set(k, query[k])
  }
  return url.href;
}