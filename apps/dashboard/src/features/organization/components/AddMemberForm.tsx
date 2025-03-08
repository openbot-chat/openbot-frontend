import {
  HStack,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  MenuItem,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@/components/icons'
import { OrganizationInvitation, OrganizationRole } from 'models'
import { FormEvent, useState } from 'react'
import { Member } from '../types'
import { useTranslations } from 'next-intl'
import { trpc } from '@/utils/trpc-client'



type Props = {
  organizationId: string
  onNewMember: (member: Member) => void
  onNewInvitation: (invitation: OrganizationInvitation) => void
  isLoading: boolean
  isLocked: boolean
}
export const AddMemberForm = ({
  organizationId,
  onNewMember,
  onNewInvitation,
  isLoading,
  isLocked,
}: Props) => {
  const t = useTranslations('organization.membersList');
  const [invitationEmail, setInvitationEmail] = useState('')
  const [invitationRole, setInvitationRole] = useState<OrganizationRole>(
    OrganizationRole.MEMBER
  )

  const [isSendingInvitation, setIsSendingInvitation] = useState(false)

  const sendInvitationMutation = trpc.invitation.create.useMutation({

  })


  const handleInvitationSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSendingInvitation(true)
    const { data } = await sendInvitationMutation.mutateAsync({
      email: invitationEmail,
      role: invitationRole,
      organizationId,
    })
    if (data?.member) onNewMember(data.member)
    if (data?.invitation) onNewInvitation(data.invitation)
    setInvitationEmail('')
    setIsSendingInvitation(false)
  }

  return (
    <HStack as="form" onSubmit={handleInvitationSubmit}>
      <Input
        placeholder={t('inviteInput.placeholder')}
        name="inviteEmail"
        value={invitationEmail}
        onChange={(e) => setInvitationEmail(e.target.value)}
        rounded="md"
        isDisabled={isLocked}
      />

      {!isLocked && (
        <OrganizationRoleMenuButton
          role={invitationRole}
          onChange={setInvitationRole}
        />
      )}
      <Button
        colorScheme={'blue'}
        isLoading={isSendingInvitation}
        flexShrink={0}
        type="submit"
        isDisabled={isLoading || isLocked || invitationEmail === ''}
      >
        {t('inviteButton.label')}
      </Button>
    </HStack>
  )
}

const OrganizationRoleMenuButton = ({
  role,
  onChange,
}: {
  role: OrganizationRole
  onChange: (role: OrganizationRole) => void
}) => {
  return (
    <Menu placement="bottom-end" isLazy matchWidth>
      <MenuButton
        flexShrink={0}
        as={Button}
        rightIcon={<ChevronLeftIcon transform={'rotate(-90deg)'} />}
      >
        {convertOrganizationRoleToReadable(role)}
      </MenuButton>
      <MenuList minW={0}>
        <Stack maxH={'35vh'} overflowY="scroll" spacing="0">
          <MenuItem onClick={() => onChange(OrganizationRole.ADMIN)}>
            {convertOrganizationRoleToReadable(OrganizationRole.ADMIN)}
          </MenuItem>
          <MenuItem onClick={() => onChange(OrganizationRole.MEMBER)}>
            {convertOrganizationRoleToReadable(OrganizationRole.MEMBER)}
          </MenuItem>
        </Stack>
      </MenuList>
    </Menu>
  )
}

export const convertOrganizationRoleToReadable = (role: OrganizationRole): string => {
  switch (role) {
    case OrganizationRole.ADMIN:
      return 'Admin'
    case OrganizationRole.MEMBER:
      return 'Member'
  }
}
