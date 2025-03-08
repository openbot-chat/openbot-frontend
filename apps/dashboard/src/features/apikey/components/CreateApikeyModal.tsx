import { CopyButton } from '@/components/CopyButton'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Input,
  ModalFooter,
  Button,
  Text,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import React, { FormEvent, useRef, useState } from 'react'
import { ApiKey } from 'models'
import { trpc } from '@/utils/trpc-client'

type Props = {
  isOpen: boolean
  onNewApikey: (apikey: ApiKey) => void
  onClose: () => void
}

export const CreateApikeyModal = ({
  isOpen,
  onClose,
  onNewApikey,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('apikeys.createModal')
  const [name, setName] = useState('')
  const [newTokenValue, setNewTokenValue] = useState<string>()
  const createApiKeyMutation = trpc.apikey.create.useMutation()

  const createToken = async (e: FormEvent) => {
    e.preventDefault()
    const apikey = await createApiKeyMutation.mutateAsync({ name })
    if (apikey) {
      setNewTokenValue(apikey.token)
      onNewApikey(apikey)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={inputRef} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {newTokenValue ? t('createdHeading') : t('createHeading')}
        </ModalHeader>
        <ModalCloseButton />
        {newTokenValue ? (
          <ModalBody as={Stack} spacing="4">
            <Text>
              {t('copyInstruction')}{' '}
              <strong>{t('securityWarning')}</strong>
            </Text>
            <InputGroup size="md">
              <Input readOnly pr="4.5rem" value={newTokenValue} />
              <InputRightElement width="4.5rem">
                <CopyButton h="1.75rem" size="sm" textToCopy={newTokenValue} />
              </InputRightElement>
            </InputGroup>
          </ModalBody>
        ) : (
          <ModalBody as="form" onSubmit={createToken}>
            <Text mb="4">{t('nameInput.label')}</Text>
            <Input
              ref={inputRef}
              placeholder={t('nameInput.placeholder')}
              onChange={(e) => setName(e.target.value)}
            />
          </ModalBody>
        )}

        <ModalFooter>
          {newTokenValue ? (
            <Button onClick={onClose} colorScheme="blue">
              {t('doneButton.label')}
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              isDisabled={name.length === 0}
              isLoading={createApiKeyMutation.isLoading}
              onClick={createToken}
            >
              {t('createButton.label')}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
