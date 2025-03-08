import {
  Stack,
  Heading,
  chakra,
  Button,
  Text,
  Tooltip,
  Flex,
  useColorModeValue,
  Tag,
} from '@chakra-ui/react'
import { Feature, FeatureType, Plan, PlanEnum, Subscription } from 'models'
import { useCallback, useMemo } from 'react'
import {
  formatPrice,
} from '@openbot/lib/pricing'
import { FeaturesList } from './FeaturesList'
import { useTranslations } from 'next-intl'
import { planColorSchemes } from './PlanTag'

const HOT_PLAN = PlanEnum.STARTER

type Props = {
  plan: Plan,
  allPlans: Plan[],
  currentSubscription?: Subscription,
  isYearly: boolean
  isLoading?: boolean
  onPayClick: (props: { plan: PlanEnum, price_id: string }) => void
}

export const PlanPricingCard = ({
  plan,
  allPlans,
  currentSubscription,
  isYearly,
  isLoading,
  onPayClick,
}: Props) => {
  const scopedT = useTranslations('billing.pricingCard')

  const tag = plan.slug === HOT_PLAN ? scopedT('pro.mostPopularLabel') : ""
  const Container = plan.slug === HOT_PLAN ? TaggedContainer : PlainContainer

  const price = useMemo(() => {
    return plan.prices?.find(it => it.is_yearly === isYearly)
  }, [plan, isYearly])

  const isCurrentPlan = useMemo(() => {
    if (!currentSubscription) {
      return plan.slug === PlanEnum.FREE
    }
    if (currentSubscription.plan === plan.slug) {
      return currentSubscription.is_yearly === isYearly || !isYearly
    }
    return false
  }, [currentSubscription, plan, isYearly])

  const buttonLabel = useMemo(() => {
    if (!currentSubscription) {
      return plan.slug === PlanEnum.FREE
        ? scopedT('upgradeButton.current')
        : scopedT('upgradeButton.upgrade')
    }
    if (currentSubscription.plan === plan.slug) {
      if (currentSubscription.is_yearly === isYearly || !isYearly) {
        return scopedT('upgradeButton.current')
      } else {
        return (currentSubscription.status === "past_due" || currentSubscription.cancel_at)
          ? ""
          : scopedT('upgradeButton.update')
      }
    }
    if (currentSubscription.status === "past_due" || currentSubscription.cancel_at) {
      // 扣款失败，或者已经取消的订阅，不能直接变更，要先去网关后台操作恢复
      return ""
    }
    const planIdx = allPlans.findIndex(it => it.slug === plan.slug)
    const currentPlanIdx = allPlans.findIndex(it => it.slug === currentSubscription.plan)
    return planIdx > currentPlanIdx ? scopedT('upgradeButton.upgrade') : ""
  }, [currentSubscription, plan, allPlans, isYearly])

  const { prevFeatures, currentFeatures } = useMemo(() => {
    const existFeaturesMap: { [k: string]: Feature } = {}
    const planIdx = allPlans.findIndex(it => it.slug === plan.slug)
    for (let i = 0; i < planIdx; ++i) {
      allPlans[i].features.forEach(it => existFeaturesMap[it.slug] = it)
    }
    const prevFeatures: Feature[] = []
    const currentFeatures: Feature[] = []
    plan.features.forEach(it => {
      const existFeature = existFeaturesMap[it.slug]
      if (existFeature) {
        if (it.type === FeatureType.QUOTA) {
          if (it.quantity === existFeature.quantity) {
            prevFeatures.push(it)
          } else {
            currentFeatures.push(it)
          }
        } else {
          prevFeatures.push(it)
        }
      } else {
        currentFeatures.push(it)
      }
    })
    return { prevFeatures, currentFeatures }
  }, [plan, allPlans])

  const prevPlan = useMemo(() => {
    const planIdx = allPlans.findIndex(it => it.slug === plan.slug)
    return planIdx > 0 ? allPlans[planIdx - 1] : undefined
  }, [plan, allPlans])

  const handlePayClick = useCallback(() => {
    if (price) {
      onPayClick({ price_id: price.price_id, plan: plan.slug })
    }
  }, [price])

  return (
    <Container tag={tag}>
      <Stack spacing="4" mt={2}>
        <Heading fontSize="2xl">
          <chakra.span color={`${planColorSchemes[plan.slug]}.400`}>{scopedT(`${plan.slug}.name`)}</chakra.span>
        </Heading>
        {plan.description && (<Text>{plan.description}</Text>)}
        <Heading>
          {formatPrice((price?.unit_amount ?? 0) / 100, price?.currency === 'eur' ? 'eur' : 'usd')}
          <chakra.span fontSize="md">{scopedT(isYearly ? 'perYear' : 'perMonth')}</chakra.span>
        </Heading>
        {
          prevFeatures.length > 0 &&
          <Text fontWeight="bold">
            <Tooltip
              label={
                <FeaturesList
                  features={prevFeatures.map(it => it.description ?? it.name ?? it.slug)}
                  spacing="0"
                />
              }
              hasArrow
              placement="top"
            >
              <chakra.span textDecoration="underline" cursor="pointer">
                {scopedT('everythingFromPrevPlan', { plan: scopedT(`${prevPlan?.slug}.name`) })}
              </chakra.span>
            </Tooltip>
            {scopedT('plusFeatures')}
          </Text>
        }
        <FeaturesList
          features={currentFeatures.map(it => it.description ?? it.name ?? it.slug)}
        />
      </Stack>
      <Stack>
        {
          buttonLabel &&
          <Button
            colorScheme="orange"
            variant="outline"
            onClick={handlePayClick}
            isLoading={isLoading}
            isDisabled={isCurrentPlan}
          >
            {buttonLabel}
          </Button>
        }
      </Stack>
    </Container>
  )
}

type ContainerProps = {
  tag: string,
  children: JSX.Element[]
}

const TaggedContainer = ({ tag, children }: ContainerProps) => {
  return (
    <Flex
      p="4"
      pos="relative"
      h="full"
      flexDir="column"
      flex="1"
      flexShrink={0}
      borderWidth="1px"
      borderColor={useColorModeValue('blue.500', 'blue.300')}
      rounded="lg"
    >
      <Flex justifyContent="center">
        <Tag
          pos="absolute"
          top="-10px"
          colorScheme="blue"
          bg={useColorModeValue('blue.500', 'blue.400')}
          variant="solid"
          fontWeight="semibold"
          style={{ marginTop: 0 }}
        >
          {tag}
        </Tag>
      </Flex>
      <Stack justifyContent="space-between" h="full" flex="1">
        {children}
      </Stack>
    </Flex>
  )
}

const PlainContainer = ({ children }: ContainerProps) => {
  return (
    <Stack spacing={6} p="4" rounded="lg" borderWidth="1px" flex="1" h="full" justifyContent="space-between" >
      {children}
    </Stack>
  )
}