import {
  Stack,
  Heading,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
} from '@chakra-ui/react'
// import { GraphNavigation } from '@typebot.io/prisma'
import React, { useEffect } from 'react'
// import { GraphNavigationRadioGroup } from './GraphNavigationRadioGroup'
import { AppearanceRadioGroup } from './AppearanceRadioGroup'
import { ChevronDownIcon } from '@/components/icons'
import { MoreInfoTooltip } from '@/components/MoreInfoTooltip'
import { useTranslations } from 'next-intl'
import { useUser } from '../UserProvider'
import { usePathname } from '@/navigation'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const localeHumanReadable = {
  'en-US': 'English',
  'zh-CN': '中文',
  jp: 'Japanese',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
} as const

export const UserPreferencesForm = () => {
  const t = useTranslations('user.preferences')
  const pathname = usePathname()
  const router = useRouter()

  const { colorMode } = useColorMode()
  const { user, updateUser } = useUser()
  const currentLocale = useLocale()

  /*
  useEffect(() => {
    if (!user?.graphNavigation)
      updateUser({ graphNavigation: GraphNavigation.TRACKPAD })
  }, [updateUser, user?.graphNavigation])
  */

  /*
  const changeGraphNavigation = async (value: string) => {
    updateUser({ graphNavigation: value as GraphNavigation })
  }
  */

  const changeAppearance = async (value: string) => {
    const options = {
      ...user?.options,
      preferredAppAppearance: value,
    }
    updateUser({ options })
  }

  console.warn('currentLocale: ', currentLocale, pathname)

  const updateLocale = (locale: keyof typeof localeHumanReadable) => () => {
    // changeLocale(locale)
    // TODO 不生效？
    // router.replace(pathname, { locale })
    router.push(`/${locale}${pathname}`)

    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
  }

  return (
    <Stack spacing={12}>
      <HStack spacing={4}>
        <Heading size="md">{t('language.heading')}</Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {localeHumanReadable[currentLocale]}
          </MenuButton>
          <MenuList>
            {Object.keys(localeHumanReadable).map((locale) => (
              <MenuItem
                key={locale}
                onClick={updateLocale(
                  locale as keyof typeof localeHumanReadable
                )}
              >
                {
                  localeHumanReadable[
                    locale as keyof typeof localeHumanReadable
                  ]
                }
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        {currentLocale !== 'en' && (
          <MoreInfoTooltip>{t('language.tooltip')}</MoreInfoTooltip>
        )}
      </HStack>
      {/*
      <Stack spacing={6}>
        <Heading size="md">{scopedT('graphNavigation.heading')}</Heading>
        <GraphNavigationRadioGroup
          defaultValue={user?.graphNavigation ?? GraphNavigation.TRACKPAD}
          onChange={changeGraphNavigation}
        />
      </Stack>
      */}
      <Stack spacing={6}>
        <Heading size="md">{t('appearance.heading')}</Heading>
        <AppearanceRadioGroup
          defaultValue={
            user?.options?.preferredAppAppearance
              ? user.options?.preferredAppAppearance
              : colorMode
          }
          onChange={changeAppearance}
        />
      </Stack>
    </Stack>
  )
}
