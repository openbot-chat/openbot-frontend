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
  Tooltip,
  Flex,
  Tag,
  useColorModeValue,
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
  currency?: 'usd' | 'eur'
  isLoading: boolean
  isYearly: boolean
  onPayClick: (props: {
    selectedChatsLimitIndex: number
    selectedStorageLimitIndex: number
  }) => void
}

export const ProPlanPricingCard = ({
  organization,
  currentSubscription,
  currency,
  isLoading,
  isYearly,
  onPayClick,
}: Props) => {
  const t = useTranslations()
  const scopedT = useTranslations("billing.pricingCard")

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
    if (organization.plan !== PlanEnum.PRO) {
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
    chatsLimit[PlanEnum.PRO].graduatedPrice[selectedChatsLimitIndex ?? 0]
      .totalIncluded === organizationChatsLimit &&
    storageLimit[PlanEnum.PRO].graduatedPrice[selectedStorageLimitIndex ?? 0]
      .totalIncluded === organizationStorageLimit &&
    isYearly === currentSubscription?.isYearly

  const getButtonLabel = () => {
    if (
      selectedChatsLimitIndex === undefined ||
      selectedStorageLimitIndex === undefined
    )
      return ''
    if (organization?.plan === PlanEnum.PRO) {
      if (isCurrentPlan) return scopedT('upgradeButton.current')

      if (
        selectedChatsLimitIndex !== organization.additionalChatsIndex ||
        selectedStorageLimitIndex !== organization.additionalStorageIndex
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
      PlanEnum.PRO,
      selectedChatsLimitIndex ?? 0,
      selectedStorageLimitIndex ?? 0,
      isYearly ? 'yearly' : 'monthly'
    ) ?? NaN

  const proColor = useColorModeValue('blue.400', 'blue.300')

  return (
    <Flex
      p="6"
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
          {scopedT('pro.mostPopularLabel')}
        </Tag>
      </Flex>
      <Stack justifyContent="space-between" h="full">
        <Stack spacing="4" mt={2}>
          <Heading fontSize="2xl">
            {scopedT.rich('pro.heading', {
              plan: (chunks) => (
                <chakra.span color={proColor}>
                  {chunks}
                </chakra.span>
              ),
            })}
          </Heading>
          <Text>{scopedT('pro.description')}</Text>
        </Stack>
        <Stack spacing="4">
          <Heading>
            {formatPrice(price, currency)}
            <chakra.span fontSize="md">{scopedT('perMonth')}</chakra.span>
          </Heading>
          <Text fontWeight="bold">
            <Tooltip
              label={
                <FeaturesList
                  features={[
                    scopedT('starter.brandingRemoved'),
                    scopedT('starter.fileUploadBlock'),
                    scopedT('starter.createFolders'),
                  ]}
                  spacing="0"
                />
              }
              hasArrow
              placement="top"
            >
              <chakra.span textDecoration="underline" cursor="pointer">
                {scopedT('pro.everythingFromStarter')}
              </chakra.span>
            </Tooltip>
            {scopedT('plus')}
          </Text>
          <FeaturesList
            features={[
              scopedT('pro.includedSeats'),
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
                            chatsLimit.PRO.graduatedPrice[
                              selectedChatsLimitIndex
                            ].totalIncluded
                          )
                        : undefined}
                    </MenuButton>
                    <MenuList>
                      {chatsLimit.PRO.graduatedPrice.map((price, index) => (
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
                            storageLimit.PRO.graduatedPrice[
                              selectedStorageLimitIndex
                            ].totalIncluded
                          )
                        : undefined}
                    </MenuButton>
                    <MenuList>
                      {storageLimit.PRO.graduatedPrice.map((price, index) => (
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
              scopedT('pro.customDomains'),
              scopedT('pro.analytics'),
            ]}
          />
          <Stack spacing={3}>
            {isYearly && organization.stripeId && !isCurrentPlan && (
              <Heading mt="0" fontSize="md">
                You pay {formatPrice(price * 12, currency)} / year
              </Heading>
            )}
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={handlePayClick}
              isLoading={isLoading}
              isDisabled={isCurrentPlan}
            >
              {getButtonLabel()}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  )
}
