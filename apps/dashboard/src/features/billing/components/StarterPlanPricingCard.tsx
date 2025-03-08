import {
  Stack,
  Heading,
  chakra,
  HStack,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@/components/icons'
import { PlanEnum } from 'models'
import { useEffect, useState } from 'react'
import { isDefined, parseNumberWithCommas } from '@openbot/lib'
import {
  chatsLimit,
  computePrice,
  formatPrice,
  getChatsLimit,
  getStorageLimit,
  storageLimit,
} from '@openbot/lib/pricing'
import { FeaturesList } from './FeaturesList'
import { MoreInfoTooltip } from '@/components/MoreInfoTooltip'
import { Organization } from 'models'
import { useTranslations } from 'next-intl'

type Props = {
  organization: Pick<
    Organization,
    | 'additionalChatsIndex'
    | 'additionalStorageIndex'
    | 'plan'
    | 'customChatsLimit'
    | 'customStorageLimit'
    | 'stripeId'
  >
  currentSubscription: {
    isYearly?: boolean
  }
  currency?: 'eur' | 'usd'
  isLoading?: boolean
  isYearly: boolean
  onPayClick: (props: {
    selectedChatsLimitIndex: number
    selectedStorageLimitIndex: number
  }) => void
}

export const StarterPlanPricingCard = ({
  organization,
  currentSubscription,
  isLoading,
  currency,
  isYearly,
  onPayClick,
}: Props) => {
  const t = useTranslations()
  const scopedT = useTranslations('billing.pricingCard')

  const [selectedChatsLimitIndex, setSelectedChatsLimitIndex] =
    useState<number>()
  const [selectedStorageLimitIndex, setSelectedStorageLimitIndex] =
    useState<number>()

  useEffect(() => {
    if (
      isDefined(selectedChatsLimitIndex) ||
      isDefined(selectedStorageLimitIndex)
    )
      return
    if (organization.plan !== PlanEnum.STARTER) {
      setSelectedChatsLimitIndex(0)
      setSelectedStorageLimitIndex(0)
      return
    }
    setSelectedChatsLimitIndex(organization.additionalChatsIndex ?? 0)
    setSelectedStorageLimitIndex(organization.additionalStorageIndex ?? 0)
  }, [
    selectedChatsLimitIndex,
    selectedStorageLimitIndex,
    organization.additionalChatsIndex,
    organization.additionalStorageIndex,
    organization?.plan,
  ])

  const organizationChatsLimit = organization ? getChatsLimit(organization) : undefined
  const organizationStorageLimit = organization
    ? getStorageLimit(organization)
    : undefined

  const isCurrentPlan =
    chatsLimit[PlanEnum.STARTER].graduatedPrice[selectedChatsLimitIndex ?? 0]
      .totalIncluded === organizationChatsLimit &&
    storageLimit[PlanEnum.STARTER].graduatedPrice[selectedStorageLimitIndex ?? 0]
      .totalIncluded === organizationStorageLimit &&
    isYearly === currentSubscription?.isYearly

  const getButtonLabel = () => {
    if (
      selectedChatsLimitIndex === undefined ||
      selectedStorageLimitIndex === undefined
    )
      return ''
    if (organization?.plan === PlanEnum.PRO) return t('downgrade')
    if (organization?.plan === PlanEnum.STARTER) {
      if (isCurrentPlan) return t('upgradeButton.current')

      if (
        selectedChatsLimitIndex !== organization.additionalChatsIndex ||
        selectedStorageLimitIndex !== organization.additionalStorageIndex ||
        isYearly !== currentSubscription?.isYearly
      )
        return t('update')
    }
    return t('upgrade')
  }

  const handlePayClick = async () => {
    if (
      selectedChatsLimitIndex === undefined ||
      selectedStorageLimitIndex === undefined
    )
      return
    onPayClick({
      selectedChatsLimitIndex,
      selectedStorageLimitIndex,
    })
  }

  const price =
    computePrice(
      PlanEnum.STARTER,
      selectedChatsLimitIndex ?? 0,
      selectedStorageLimitIndex ?? 0,
      isYearly ? 'yearly' : 'monthly'
    ) ?? NaN

  return (
    <Stack spacing={6} p="6" rounded="lg" borderWidth="1px" flex="1" h="full">
      <Stack spacing="4">
        <Heading fontSize="2xl">
          {scopedT.rich('starter.heading', {
            plan: (chunks) => <chakra.span color="orange.400">{chunks}</chakra.span>,
          })}
        </Heading>
        <Text>{scopedT('starter.description')}</Text>
        <Heading>
          {formatPrice(price, currency)}
          <chakra.span fontSize="md">{t('perMonth')}</chakra.span>
        </Heading>
        <FeaturesList
          features={[
            scopedT('starter.includedSeats'),
            <HStack key="test">
              <Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronLeftIcon transform="rotate(-90deg)" />}
                    size="sm"
                    isLoading={selectedChatsLimitIndex === undefined}
                  >
                    {selectedChatsLimitIndex !== undefined
                      ? parseNumberWithCommas(
                          chatsLimit.STARTER.graduatedPrice[
                            selectedChatsLimitIndex
                          ].totalIncluded
                        )
                      : undefined}
                  </MenuButton>
                  <MenuList>
                    {chatsLimit.STARTER.graduatedPrice.map((price, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => setSelectedChatsLimitIndex(index)}
                      >
                        {parseNumberWithCommas(price.totalIncluded)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>{' '}
                {scopedT('chatsPerMonth')}
              </Text>
              <MoreInfoTooltip>{t('chatsTooltip')}</MoreInfoTooltip>
            </HStack>,
            <HStack key="test">
              <Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronLeftIcon transform="rotate(-90deg)" />}
                    size="sm"
                    isLoading={selectedStorageLimitIndex === undefined}
                  >
                    {selectedStorageLimitIndex !== undefined
                      ? parseNumberWithCommas(
                          storageLimit.STARTER.graduatedPrice[
                            selectedStorageLimitIndex
                          ].totalIncluded
                        )
                      : undefined}
                  </MenuButton>
                  <MenuList>
                    {storageLimit.STARTER.graduatedPrice.map((price, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => setSelectedStorageLimitIndex(index)}
                      >
                        {parseNumberWithCommas(price.totalIncluded)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>{' '}
                {scopedT('storageLimit')}
              </Text>
              <MoreInfoTooltip>
                {scopedT('storageLimitTooltip')}
              </MoreInfoTooltip>
            </HStack>,
            scopedT('starter.tokenLimit'),
          ]}
        />
      </Stack>
      <Stack>
        {isYearly && organization.stripeId && !isCurrentPlan && (
          <Heading mt="0" fontSize="md">
            You pay: {formatPrice(price * 12, currency)} / year
          </Heading>
        )}
        <Button
          colorScheme="orange"
          variant="outline"
          onClick={handlePayClick}
          isLoading={isLoading}
          isDisabled={isCurrentPlan}
        >
          {getButtonLabel()}
        </Button>
      </Stack>
    </Stack>
  )
}
