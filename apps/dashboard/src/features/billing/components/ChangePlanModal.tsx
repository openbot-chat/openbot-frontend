import { AlertInfo } from '@/components/AlertInfo'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Button,
  HStack,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ChangePlanForm } from './ChangePlanForm'

type ChangePlanModalProps = {
  type?: string
  isOpen: boolean
  onClose: () => void
}

export const ChangePlanModal = ({
  onClose,
  isOpen,
  type,
}: ChangePlanModalProps) => {
  const t = useTranslations()
  const { organization } = useOrganization()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody as={Stack} spacing="6" pt="10">
          {type && (
            <AlertInfo>
              {t('billing.upgradeLimitLabel', { type: type })}
            </AlertInfo>
          )}
          {organization && (
            <ChangePlanForm
              organization={organization}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button colorScheme="gray" onClick={onClose}>
              {t('cancel')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
