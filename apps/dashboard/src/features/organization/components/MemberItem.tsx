import {
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { OrganizationRole } from 'models'
import { useTranslations } from 'next-intl'
import React from 'react'
import { convertOrganizationRoleToReadable } from './AddMemberForm'


type Props = {
  image?: string
  name?: string
  email: string
  role: OrganizationRole
  isGuest?: boolean
  isMe?: boolean
  canEdit: boolean
  onDeleteClick: () => void
  onSelectNewRole: (role: OrganizationRole) => void
}

export const MemberItem = ({
  email,
  name,
  image,
  role,
  isGuest = false,
  isMe = false,
  canEdit,
  onDeleteClick,
  onSelectNewRole,
}: Props) => {
  const t = useTranslations()
  const handleAdminClick = () => onSelectNewRole(OrganizationRole.ADMIN)
  const handleMemberClick = () => onSelectNewRole(OrganizationRole.MEMBER)

  return (
    <Menu placement="bottom-end" isLazy>
      <MenuButton
        _hover={{
          bg: useColorModeValue('gray.100', 'gray.700'),
        }}
        borderRadius="md"
      >
        <MemberIdentityContent
          email={email}
          name={name}
          image={image}
          isGuest={isGuest}
          tag={convertOrganizationRoleToReadable(role)}
        />
      </MenuButton>
      {!isMe && canEdit && (
        <MenuList shadow="lg">
          <MenuItem onClick={handleAdminClick}>
            {convertOrganizationRoleToReadable(OrganizationRole.ADMIN)}
          </MenuItem>
          <MenuItem onClick={handleMemberClick}>
            {convertOrganizationRoleToReadable(OrganizationRole.MEMBER)}
          </MenuItem>
          <MenuItem color="red.500" onClick={onDeleteClick}>
            {t('remove')}
          </MenuItem>
        </MenuList>
      )}
    </Menu>
  )
}

export const MemberIdentityContent = ({
  name,
  tag,
  isGuest = false,
  image,
  email,
}: {
  name?: string
  tag?: string
  image?: string
  isGuest?: boolean
  email: string
}) => {
  const t = useTranslations()

  return (
    <HStack justifyContent="space-between" maxW="full" p="2">
      <HStack minW={0} spacing="4">
        <Avatar name={name} src={image} size="sm" />
        <Stack spacing={0} minW="0">
          {name && (
            <Text textAlign="left" fontSize="15px">
              {name}
            </Text>
          )}
          <Text
            color="gray.500"
            fontSize={name ? '14px' : 'inherit'}
            noOfLines={1}
          >
            {email}
          </Text>
        </Stack>
      </HStack>
      <HStack flexShrink={0}>
        {isGuest && (
          <Tag color="gray.400" data-testid="tag">
            {t('pending')}
          </Tag>
        )}
        <Tag data-testid="tag">{tag}</Tag>
      </HStack>
    </HStack>
  )
}
