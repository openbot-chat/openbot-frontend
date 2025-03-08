import { useTranslations } from 'next-intl';

import {
  Avatar,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react'
import { signIn, signOut } from "next-auth/react"
import { ArrowForwardIcon, SettingsIcon } from '@chakra-ui/icons'

import {
  Organization,
} from 'models'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { OrganizationSettingsModal, SettingsTab } from '@/features/organization/components/OrganizationSettingsModal'
import { useState } from 'react'
import { CreateOrganizationModal } from '@/features/organization/components/CreateOrganizationModal'
import { useUser } from '@/features/user/UserProvider'
import { LogOutIcon, PlusIcon } from '../icons'



export const UserProfile = () => {
  const t = useTranslations()
  const scopedT = useTranslations('profile.dropdown')
  const { data: session, status } = useSession()
  const { 
    isOpen: isOpenCreate, 
    onOpen: onOpenCreate, 
    onClose: onCloseCreate,
  } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { organizations, organization, createOrganization, switchOrganization } = useOrganization()
  const [tab, setTab] = useState<SettingsTab>('organization-settings')
  const { user } = useUser()

  const handleCreateOrganization = async (org: Organization) => {
    await createOrganization(org.name)
  }

  const handleClickOrganization = (org: Organization) => () => {
    if (org.id !== organization?.id) {
      switchOrganization(org.id)
    } else {
      setTab('organization-settings')
      onOpen()
    }
  }

  const handleClickAccount = () => {
    setTab('my-account')
    onOpen()
  }

  return (
    <>
      <CreateOrganizationModal
          isOpen={isOpenCreate}
          onClose={onCloseCreate}
          onCreate={handleCreateOrganization}
      />

      {user && organization && <OrganizationSettingsModal
        tab={tab}
        isOpen={isOpen}
        onClose={onClose}
        user={user}
        organization={organization}
      />}
      {status === 'authenticated' && (
        <Menu isLazy placement="right">
          <MenuButton>
            <Avatar boxSize="40px" src={user?.image ?? undefined} />
          </MenuButton>
          <Portal>
            <MenuList
              zIndex={1500}
              p={2}
            >
              <MenuGroup title={t('organization.title')}>
                {organizations?.map(it => (
                  <MenuItem 
                    key={it.id}
                    icon={it.id === organization?.id ? <SettingsIcon /> : <ArrowForwardIcon />}
                    color={it.id === organization?.id ? 'twitter.500' : 'current'}
                    css={it.id === organization?.id ? {
                      fontWeight: 500,
                    } : undefined}
                    onClick={handleClickOrganization(it)}
                  >
                    {it.name}
                  </MenuItem>
                ))}
                <MenuItem icon={<PlusIcon />} onClick={onOpenCreate}>
                  {t('organization.new')}
                </MenuItem>
              </MenuGroup>
              <MenuDivider />

              <MenuItem
                maxW="500px"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                onClick={handleClickAccount}
                icon={<SettingsIcon />}
                rounded="8px"
              >
                {scopedT('settings')}
              </MenuItem>
              <MenuDivider />
              <MenuItem
                maxW="500px"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                onClick={() => signOut()}
                icon={<LogOutIcon />}
                rounded="8px"
                py={2}
              >
                {scopedT('logout')}
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      )}
    </>
  )
}