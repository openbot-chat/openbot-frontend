import {
  Modal,
  ModalOverlay,
  ModalContent,
  Stack,
  Text,
  Button,
  Avatar,
  Flex,
} from '@chakra-ui/react'
import {
  CreditCardIcon,
  HardDriveIcon,
  SettingsIcon,
  UsersIcon,
} from '@/components/icons'
// import { EmojiOrImageIcon } from '@/components/EmojiOrImageIcon'
import { User, Organization, OrganizationRole } from 'models'
import { useEffect, useState } from 'react'
// import { MembersList } from './MembersList'
import { OrganizationSettingsForm } from './OrganizationSettingsForm'
import packageJson from '../../../../../../package.json'
import { useTranslations } from 'next-intl'
import { useOrganization } from '../context/OrganizationProvider'
import { MembersList } from './MembersList'
import { EmojiOrImageIcon } from '@/components/EmojiOrImageIcon'
import { UserPreferencesForm } from '@/features/user/components/UserPreferencesForm'
import { MyAccountForm } from '@/features/user/components/MyAccountForm'
// import { UserPreferencesForm } from '@/features/account/components/UserPreferencesForm'
// import { MyAccountForm } from '@/features/account/components/MyAccountForm'
import { BillingSettingsLayout } from '@/features/billing/components/BillingSettingsLayout'
// import { useScopedI18n } from '@/locales'

type Props = {
  isOpen: boolean
  user: User
  organization: Organization
  onClose: () => void
  tab?: SettingsTab;
}

export type SettingsTab =
  | 'my-account'
  | 'user-settings'
  | 'organization-settings'
  | 'members'
  | 'billing'

export const OrganizationSettingsModal = ({
  isOpen,
  user,
  organization,
  onClose,
  tab,
}: Props) => {
  const t = useTranslations();
  const { currentRole } = useOrganization()
  const [selectedTab, setSelectedTab] = useState<SettingsTab>(tab || 'my-account')
  const canEditOrganization = currentRole === OrganizationRole.ADMIN

  useEffect(() => tab && setSelectedTab(tab), [tab]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent minH="600px" flexDir="row">
        <Stack
          spacing={8}
          w="180px"
          py="6"
          borderRightWidth={1}
          justifyContent="space-between"
        >
          <Stack spacing={8}>
            <Stack>
              <Text pl="4" color="gray.500">
                {user.email}
              </Text>
              <Button
                variant={selectedTab === 'my-account' ? 'solid' : 'ghost'}
                onClick={() => setSelectedTab('my-account')}
                leftIcon={
                  <Avatar
                    name={user.name ?? undefined}
                    src={user.image ?? undefined}
                    boxSize="15px"
                  />
                }
                size="sm"
                justifyContent="flex-start"
                pl="4"
              >
                {t('organization.settings.modal.menu.myAccount.label')}
              </Button>
              <Button
                variant={selectedTab === 'user-settings' ? 'solid' : 'ghost'}
                onClick={() => setSelectedTab('user-settings')}
                leftIcon={<SettingsIcon />}
                size="sm"
                justifyContent="flex-start"
                pl="4"
              >
                {t('organization.settings.modal.menu.preferences.label')}
              </Button>
            </Stack>
            <Stack>
              <Text pl="4" color="gray.500">
                {t('organization.settings.modal.menu.organization.label')}
              </Text>
              {canEditOrganization && (
                <Button
                  variant={
                    selectedTab === 'organization-settings' ? 'solid' : 'ghost'
                  }
                  onClick={() => setSelectedTab('organization-settings')}
                  leftIcon={
                    <EmojiOrImageIcon
                      icon={organization.icon}
                      boxSize="15px"
                      defaultIcon={HardDriveIcon}
                    />
                  }
                  size="sm"
                  justifyContent="flex-start"
                  pl="4"
                >
                  {t('organization.settings.modal.menu.settings.label')}
                </Button>
              )}
              <Button
                variant={selectedTab === 'members' ? 'solid' : 'ghost'}
                onClick={() => setSelectedTab('members')}
                leftIcon={<UsersIcon />}
                size="sm"
                justifyContent="flex-start"
                pl="4"
              >
                {t('organization.settings.modal.menu.members.label')}
              </Button>
              {canEditOrganization && (
                <Button
                  variant={selectedTab === 'billing' ? 'solid' : 'ghost'}
                  onClick={() => setSelectedTab('billing')}
                  leftIcon={<CreditCardIcon />}
                  size="sm"
                  justifyContent="flex-start"
                  pl="4"
                  overflow="scroll"
                  className="hide-scrollbar"
                >
                  {t('organization.settings.modal.menu.billingAndUsage.label')}
                </Button>
              )}
            </Stack>
          </Stack>

          <Flex justify="center" pt="10">
            <Text color="gray.500" fontSize="xs">
              {t('organization.settings.modal.menu.version.label', { version: packageJson.version })}
            </Text>
          </Flex>
        </Stack>

        {isOpen && (
          <Flex flex="1" p="10">
            <SettingsContent tab={selectedTab} onClose={onClose} />
          </Flex>
        )}
      </ModalContent>
    </Modal>
  )
}

const SettingsContent = ({
  tab,
  onClose,
}: {
  tab: SettingsTab
  onClose: () => void
}) => {
  switch (tab) {
    case 'my-account':
      return <MyAccountForm />
    case 'user-settings':
      return <UserPreferencesForm />
    case 'organization-settings':
      return <OrganizationSettingsForm onClose={onClose} />
    case 'members':
      return <MembersList />
    case 'billing':
      return <BillingSettingsLayout />
    default:
      return null
  }
}
