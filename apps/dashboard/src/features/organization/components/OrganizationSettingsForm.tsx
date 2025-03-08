import {
  Stack,
  FormControl,
  FormLabel,
  Flex,
  Button,
  useDisclosure,
  Text,
} from '@chakra-ui/react'
import { ConfirmModal } from '@/components/ConfirmModal'
import React from 'react'
// import { EditableEmojiOrImageIcon } from '@/components/EditableEmojiOrImageIcon'
import { TextInput } from '@/components/inputs'
import { useTranslations } from 'next-intl'
import { useOrganization } from '../context/OrganizationProvider'

export const OrganizationSettingsForm = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations('organization.settings')
  const { organization, organizations, updateOrganization, deleteCurrentOrganization, isDeleting } =
    useOrganization()

  const handleNameChange = (name: string) => {
    if (!organization?.id) return
    updateOrganization({ name })
  }

  const handleChangeIcon = (icon: string) => {
    updateOrganization({ icon })
  }

  const handleDeleteClick = async () => {
    await deleteCurrentOrganization()
    onClose()
  }

  return (
    <Stack spacing="6" w="full">
      <FormControl>
        <FormLabel>{t('icon.title')}</FormLabel>
        <Flex>
          {/*organization && (
            <EditableEmojiOrImageIcon
              uploadFilePath={`organizations/${organization.id}/icon`}
              icon={organization.icon}
              onChangeIcon={handleChangeIcon}
              boxSize="40px"
            />
          )*/}
        </Flex>
      </FormControl>
      {organization && (
        <TextInput
          label={t('name.label')}
          withVariableButton={false}
          defaultValue={organization?.name}
          onChange={handleNameChange}
        />
      )}
      {organization && organizations && organizations.length > 1 && (
        <DeleteOrganizationButton
          organizationName={organization?.name}
          onConfirm={handleDeleteClick}
          isLoading={isDeleting}
        />
      )}
    </Stack>
  )
}

const DeleteOrganizationButton = ({
  organizationName,
  onConfirm,
  isLoading,
}: {
  organizationName: string
  onConfirm: () => Promise<void>
  isLoading: boolean
}) => {
  const t = useTranslations('organization.settings')
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button colorScheme="red" variant="outline" onClick={onOpen} isLoading={isLoading}>
        {t('deleteButton.label')}
      </Button>
      <ConfirmModal
        isOpen={isOpen}
        onConfirm={onConfirm}
        onClose={onClose}
        message={
          <Text>
            {t('deleteButton.confirmMessage', {
              organizationName,
            })}
          </Text>
        }
      />
    </>
  )
}
