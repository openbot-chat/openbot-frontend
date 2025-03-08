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
} from '@chakra-ui/react'
import { App } from 'models'
import { useTranslations } from 'next-intl'
import { ColorPicker } from '@/components/ColorPicker'
import { trpc } from '@/utils/trpc-client'
import { useToast } from '@/hooks/useToast'
import { Formik, Form, Field } from 'formik'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { FileWidget } from '@/components/JSONForm/widgets'

type Props = {
  isOpen: boolean
  onClose: () => void
  app: App
  onEditApp: (app: App) => void
}

export const EditAppModal: React.FC<Props> = ({
  isOpen,
  onClose,
  app,
  onEditApp,
}) => {
  const scopedT = useTranslations('app.editModal')
  const { showToast } = useToast()
  const { mutate, isLoading } = trpc.app.update.useMutation({
    onError: (error) => showToast({
      description: error.message,
    }),
    onSuccess: (data) => {
      onEditApp(data)
      onClose()
    }
  })

  const handleSubmit = (values) => {
    mutate({
      ...values,
      id: app.id,
    })
  }

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
        <Formik initialValues={app} onSubmit={handleSubmit} enableReinitialize={true}>
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
                  <Field name='icon'>
                  {({ field: { onChange, ...rest}, form }) => (
                    <FileWidget
                      {...rest}
                      options={{
                        tips: "Upload",
                        mode: 'image',
                        resultType: 'url',
                        flexProps: {
                          w: '64px',
                          h: '64px',
                          rounded: 'full',
                          bg: form.values.theme,
                        }
                      }}
                      onChange={(v) => form.setFieldValue('icon', v)}
                    />
                  )}
                  </Field>
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
                  
                  <Field name={`description`}>
                  {({ field }) => (
                    <FormControl isRequired={true}>
                      <FormLabel>
                        {scopedT('descriptionInput.label')}
                      </FormLabel>
                      <Textarea {...field} rows={3} placeholder={scopedT('descriptionInput.label')} />
                    </FormControl>
                  )}
                  </Field>
                  <Field name={`theme`}>
                  {({ field: { onChange, ...rest}, form }) => (
                    <FormControl>
                      <FormLabel>
                        {scopedT('themeInput.label')}
                      </FormLabel>
                      <ColorPicker {...rest} onColorChange={(v) => form.setFieldValue('theme', v)} />
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