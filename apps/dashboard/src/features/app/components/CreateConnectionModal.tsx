import React, { FormEvent, useMemo, useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  Textarea,
  HStack,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
  Input,
  Text,
  Select,
} from '@chakra-ui/react'
import { App, Connection } from 'models'
import { useTranslations } from 'next-intl'
import { trpc } from '@/utils/trpc-client'
import { useToast } from '@/hooks/useToast'
import { Formik, Form, Field } from 'formik'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'



type Props = {
  isOpen: boolean
  onClose: () => void
  app?: App
  onNewConnection: (connection: Connection) => void
}

export const CreateConnectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  app,
  onNewConnection,
}) => {
  const scopedT = useTranslations('connection.createModal')
  const { showToast } = useToast()
  const { organization } = useOrganization() 
  const { mutate, isLoading } = trpc.connection.create.useMutation({
    onError: (error) => showToast({
      description: error.message,
    }),
    onSuccess: (data) => {
      onNewConnection(data)
      onClose()
    }
  })

  const handleSubmit = (values) => {
    if (!organization) return
    if (!app) return

    const identifier = app.id + '-' + app.connections.length + 1

    mutate({
      ...values,
      identifier,
      app_id: app?.id,
      org_id: organization.id,
    })
  }

  const initialValues = useMemo(() => ({
    type: 'apikey'
  }), [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {scopedT('heading')}
        </ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize={true}>
        {({ handleSubmit, values, errors }) => {
          return (
            <Form className="w-full">
              <ModalBody as={HStack} p="0" spacing="0">
                <VStack
                  h="full"
                  py="6"
                  w="100%"
                  px="4"
                  borderLeftWidth={1}
                >
                  <Field name={`name`}>
                  {({ field }) => (
                    <FormControl isRequired>
                      <FormLabel>
                        {scopedT('nameInput.label')}
                      </FormLabel>
                      <Input {...field} placeholder={scopedT('nameInput.label')} />
                      <FormHelperText>
                        <Text>Must be between 3 and 30 characters long.</Text>
                        <Text>Must match pattern /^[a-z][0-9a-z-]+[0-9a-z]$/.</Text>
                      </FormHelperText>
                    </FormControl>
                  )}
                  </Field>
                  
                  <Field name={`type`}>
                  {({ field }) => (
                    <FormControl isRequired>
                      <FormLabel>
                        {scopedT('typeInput.label')}
                      </FormLabel>
                      <Select {...field}>
                        <option value="oauth2">OAuth2</option>
                        <option value="apikey">API Key</option>
                        <option value="basic">Basic Auth</option>
                        <option value="header">Header</option>
                      </Select>
                    </FormControl>
                  )}
                  </Field>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button 
                  type="submit" 
                  borderRadius="lg" 
                  colorScheme="twitter"
                  mt={8} 
                  isLoading={isLoading}
                  isDisabled={false}
                >
                  {scopedT('saveButton.label')}
                </Button>
              </ModalFooter>
            </Form>
          )
        }}
        </Formik>
      </ModalContent>
    </Modal>
  );
}