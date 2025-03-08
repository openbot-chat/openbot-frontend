import {
  Heading,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from '@chakra-ui/react'
import { UnlockPlanAlertInfo } from '@/components/UnlockPlanAlertInfo'
import { OrganizationInvitation, OrganizationRole } from 'models'
import React from 'react'
import { getFeatureLimit } from '@openbot/lib/getFeatureLimit'
import { AddMemberForm } from './AddMemberForm'
import { MemberItem } from './MemberItem'
import { isDefined } from '@openbot/lib'
import { Member } from '../types'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useOrganization } from '../context/OrganizationProvider'
import { trpc } from '@/utils/trpc-client'
import { usePlan } from '@/features/subscription/context/usePlan'

export const MembersList = () => {
  const t = useTranslations('organization.membersList');
  const trpcContext = trpc.useContext();
  const { data: session } = useSession();
  const { organization, currentRole } = useOrganization()
  const { data :membersData, isLoading: isLoadingMembers } = trpc.org.listMembers.useQuery({
    orgId: organization?.id,
  }, {
    enabled: !!organization?.id,
  })
  const { data: invitationsData, isLoading: isLoadingInvitations } = trpc.org.listInvitations.useQuery({
    orgId: organization?.id,
  }, {
    enabled: !!organization?.id,
  })
  const { data: customPlan } = trpc.customPlan.current.useQuery()
  const updateMemberMutation = trpc.org.updateMember.useMutation({
  })
  const deleteMemberMutation = trpc.org.deleteMember.useMutation({
  })
  const deleteInvitationMutation = trpc.org.deleteInvitation.useMutation({
  })
  const updateInvitationMutation = trpc.org.updateInvitation.useMutation({
  })

  const canEdit = currentRole === OrganizationRole.ADMIN

  const handleDeleteMemberClick = (userId: string) => async () => {
    if (!organization) return
    await deleteMemberMutation.mutateAsync({
      orgId: organization.id, 
      userId: userId
    })

    trpcContext.org.listMembers.invalidate();
  }

  const handleSelectNewRole =
    (memberId: string) => async (role: OrganizationRole) => {
      if (!organization) return

      await updateMemberMutation.mutateAsync({
        orgId: organization.id,
        userId: memberId, 
        role,
      })

      trpcContext.org.listMembers.invalidate()
    }

  const handleDeleteInvitationClick = (id: string) => async () => {
    if (!organization) return
    await deleteInvitationMutation.mutateAsync({ 
      orgId: organization.id, 
      invitationId: id,
    })
    
    trpcContext.org.listInvitations.invalidate()
  }

  const handleSelectNewInvitationRole =
    (id: string) => async (role: OrganizationRole) => {
      if (!organization) return
      await updateInvitationMutation.mutateAsync({ 
        orgId: organization.id, 
        invitationId: id, 
        role,
      })

      trpcContext.org.listInvitations.invalidate()
    }

  const handleNewInvitation = async (invitation: OrganizationInvitation) => {
    trpcContext.org.listInvitations.invalidate()
  }

  const handleNewMember = async (member: Member) => {
    trpcContext.org.listMembers.invalidate()
  }

  const currentMembersCount = (membersData?.items?.length ?? 0) + (invitationsData?.items?.length ?? 0)

  const { plan } = usePlan()
  const seatsLimit = getFeatureLimit(plan, 'seats_limit', organization?.customSeatsLimit)

  const canInviteNewMember =
    organization &&
    ((organization?.customSeatsLimit ?? seatsLimit) > currentMembersCount)

  return (
    <Stack w="full" spacing={3}>
      {!canInviteNewMember && (
        <UnlockPlanAlertInfo contentLabel={t('unlockBanner.label')} />
      )}
      {isDefined(seatsLimit) && (
        <Heading fontSize="2xl">
          {t('title')}{' '}
          {seatsLimit === -1 ? '' : `(${currentMembersCount}/${seatsLimit})`}
        </Heading>
      )}
      {organization?.id && canEdit && (
        <AddMemberForm
          organizationId={organization.id}
          onNewInvitation={handleNewInvitation}
          onNewMember={handleNewMember}
          isLoading={isLoadingMembers}
          isLocked={!canInviteNewMember}
        />
      )}
      {membersData?.items?.map((member) => (
        <MemberItem
          key={member.user_id}
          email={member.user.email ?? ''}
          image={member.user.avatar ?? undefined}
          name={member.user.name ?? undefined}
          role={member.role}
          isMe={member.user_id === session?.user?.id}
          onDeleteClick={handleDeleteMemberClick(member.user_id)}
          onSelectNewRole={handleSelectNewRole(member.user_id)}
          canEdit={canEdit}
        />
      ))}
      {invitationsData?.items?.map((invitation) => (
        <MemberItem
          key={invitation.email}
          email={invitation.email ?? ''}
          role={invitation.type}
          onDeleteClick={handleDeleteInvitationClick(invitation.id)}
          onSelectNewRole={handleSelectNewInvitationRole(invitation.id)}
          isGuest
          canEdit={canEdit}
        />
      ))}
      {(isLoadingMembers || isLoadingInvitations) && (
        <HStack py="4">
          <SkeletonCircle boxSize="32px" />
          <SkeletonText width="200px" noOfLines={2} />
        </HStack>
      )}
    </Stack>
  )
}
