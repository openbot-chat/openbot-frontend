import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { trpc } from "@/utils/trpc-client";
import { useDisclosure } from "@chakra-ui/react";
import { useOrganization } from '@/features/organization/context/OrganizationProvider';





export function useEditCredentials({
  credentials,
  onEdit: _onEdit,
}) {
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { organization } = useOrganization()

  const createCredentialsMutation = trpc.credentials.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.credentials.list.invalidate();
      onClose();
    },
  })
  const updateCredentialsMutation = trpc.credentials.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.credentials.list.invalidate()
      onClose()
    },
  })

  const onEdit = async (data) => {
    if (!organization) return

    const payload = {
      ...data,
      org_id: organization.id,
    }
    if (credentials) {
      // update
      payload.id = credentials.id 
      const result = await updateCredentialsMutation.mutateAsync(payload)
      _onEdit?.(result)
      return result
    } else {
      // create
      const result = await createCredentialsMutation.mutateAsync(payload)
      _onEdit?.(result)
      return result
    }
  }

  return {
    onOpen,
    isOpen,
    onClose,
    onEdit,
    isLoading: createCredentialsMutation.isLoading || updateCredentialsMutation.isLoading,
  }
}