import React, { useMemo, useState, useEffect } from 'react'
import {
  HStack,
  Button,
} from '@chakra-ui/react'
import { Select } from '@/components/inputs'
import { Credentials } from 'models'
import { PlusIcon } from '@/components/icons'
import { EditCredentialsModal } from './EditCredentialsModal'
import { trpc } from "@/utils/trpc-client"
import { EditIcon } from '@chakra-ui/icons'
import { useEditCredentials } from '../hooks/useEditCredentials'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { DefaultAppIcons } from '@/constants'



type Props = {
  credentialsId?: string
  type?: string
  onSelect?: (value: string | undefined, item?: Credentials) => void
}

export const CredentialsSelect: React.FC<Props> = ({
  credentialsId,
  type,
  onSelect,
}) => {
  const { organization } = useOrganization()
  const [localValue, setLocalValue] = useState(credentialsId)
  useEffect(() => {
    setLocalValue(credentialsId)
  }, [credentialsId])

  const handleSelect = (value, item) => {
    setLocalValue(value)
    onSelect?.(value, item)
  }

  const credentialsQuery = trpc.credentials.details.useQuery(localValue, {
    enabled: !!localValue,
  });
  const credentialsListQuery = trpc.credentials.list.useQuery({
    org_id: organization?.id as string,
    type,
  }, {
    enabled: !!organization?.id,
  })

  const [selectedCredentials, setSelectedCredentials] = useState()
  useEffect(() => {
    setSelectedCredentials(credentialsQuery.data)
  }, [credentialsQuery.data])

  const { isOpen, onClose, onOpen, onEdit, isLoading } = useEditCredentials({ 
    credentials: selectedCredentials,
    onEdit: async (credentials: Credentials) => {
      onSelect?.(credentials.id, credentials)
    },
  })

  const items = useMemo(() => credentialsListQuery.data?.items?.map(it => {
    let icon = it.icon
    if (!icon) {
      const Icon = DefaultAppIcons[it.type]
      icon = Icon ? <Icon boxSize="24px" /> : undefined
    }

    return {
      label: it.name,
      value: it.id,
      icon,
    }
  }), [credentialsListQuery])

  const handleAddCredentials = () => {
    setSelectedCredentials(undefined)
    onOpen()
  }

  const suffix = (
    <Button
      w='full'
      onClick={handleAddCredentials}
      fontSize="16px"
      fontWeight="normal"
      rounded="none"
      colorScheme="gray"
      role="menuitem"
      variant="ghost"
      justifyContent="flex-start"
      transition="none"
      leftIcon={<PlusIcon />}
    >
      Add Credentials
    </Button>
  );

  const handleOpenEdit = () => {
    setSelectedCredentials(credentialsQuery.data)
    onOpen()
  }

  return (
    <>
      <EditCredentialsModal isLoading={isLoading} type={selectedCredentials?.type ?? type} credentials={selectedCredentials} isOpen={isOpen} onClose={onClose} onEdit={onEdit} />
      <HStack spacing={2}>
        <Select selectedItem={localValue} placeholder="Select Credentials" items={items} onSelect={handleSelect} suffix={suffix} />
        {localValue && credentialsQuery.data && (<EditIcon cursor="pointer" onClick={handleOpenEdit} />)}
      </HStack>
    </>
  )
}