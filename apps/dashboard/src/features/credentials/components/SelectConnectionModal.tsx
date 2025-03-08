import React, { useEffect, useMemo, useState } from 'react'
import {
  Text,
  Button,
  HStack,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'

import {
  Connection,
} from 'models'
import { useTranslations } from 'next-intl'
import { trpc } from '@/utils/trpc-client'
import { Select } from '@/components/inputs'
import { useParentModal } from '@/features/graph/providers/ParentModalProvider'

type Props = {
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (connection: Partial<Connection>) => void;
  value?: string;
}

export const SelectConnectionModal: React.FC<Props> = ({
  isLoading,
  isOpen,
  onClose,
  onSelect,
  value: _value,
}) => {
  const t = useTranslations()
  const { ref } = useParentModal()
  

  const query = trpc.connection.list.useQuery({
    size: 1000,
  })

  const connections = useMemo(() => query.data?.items ?? [], [query.data])
  const options = useMemo(() => connections.map(it => ({
    icon: it.icon,
    label: it.name,
    value: it.identifier,
  })), [connections])
  const [value, setValue] = useState<string | undefined>()

  const handleSelect = () => {
    const connection = connections.find(it => it.identifier === value)
    onSelect?.(connection)
  }

  useEffect(() => {
    setValue(_value)
  }, [_value])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent ref={ref}>
        <ModalHeader>
          <Text>{t('credentials.createTitle')}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody as={HStack} spacing="0" h='600px' px={8}>
          <VStack
            h="full"
            py="0"
            w="100%"
            px="4"
            spacing={4}
          >
            <Select selectedItem={value} items={options} onSelect={setValue} />     
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button 
              type="submit" 
              borderRadius="lg" 
              width="full"
              colorScheme="twitter"
              mt={8} 
              isLoading={isLoading}
              onClick={handleSelect}
              isDisabled={!value}
            >
              {t('credentials.createContinue')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}