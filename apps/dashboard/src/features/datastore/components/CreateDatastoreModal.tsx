import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
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
  Avatar,
} from '@chakra-ui/react'

import { TextInput, Textarea, Select } from '@/components/inputs'
import {
  Agent,
} from 'models'
import { Formik, FormikProps, Form } from "formik"
import { CredentialsSelect } from '@/features/credentials/components/CredentialsSelect'
import { useParentModal } from '@/features/graph/providers/ParentModalProvider'
import { useTranslations } from 'next-intl'

type Props = {
  isSubmitting?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Agent) => void;
}

export const CreateDatastoreModal: React.FC<Props> = ({
  isSubmitting,
  isOpen,
  onClose,
  onCreate,
}) => {
  const scopedT = useTranslations('datastore.createModal')
  const { ref } = useParentModal()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent ref={ref}>
        <ModalHeader>
          {scopedT('heading')}
        </ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={{
          provider: 'qdrant',
        }} onSubmit={onCreate}>
        {(props: FormikProps) => (
          <Form>
            <ModalBody as={HStack} p="0" spacing="0">
              <VStack
                h="full"
                py="6"
                w="100%"
                px="4"
                borderLeftWidth={1}
              >    
                <TextInput 
                  label="名称"
                  placeholder="名称"
                  onChange={(value) => props.setFieldValue('name_for_model', value)}
                  debounceTimeout={0}
                  isRequired
                />
                <Textarea 
                  isRequired
                  label="介绍"
                  onChange={(value) => props.setFieldValue('description_for_model', value)}
                  placeholder="在什么情况下使用此数据集"
                  debounceTimeout={0}
                />
                <FormControl isRequired={false}>
                  <FormLabel>服务提供商</FormLabel>
                  <Select 
                    placeholder="选择服务提供商" 
                    selectedItem={props.values.provider} 
                    onSelect={(value) => {
                      props.setFieldValue('provider', value)
                      props.setFieldValue('credentialsId', undefined)
                    }}
                    items={
                      [
                        { value: 'qdrant', label: 'Qdrant', icon: <Avatar size="sm" name="qdrant"/> },
                        { value: 'pinecone', label: 'Pinecone', icon: <Avatar size="sm" name="Pinecone"/> },
                        { value: 'zilliz', label: 'Zilliz', icon: <Avatar size="sm" name="Zilliz"/> },
                      ]
                    }
                  />
                </FormControl>
                <FormControl isRequired={false}>
                  <FormLabel>{scopedT('credentialsInput.label')}</FormLabel>
                  <CredentialsSelect credentialsId={props.values.credentialsId} type={props.values.provider} onSelect={(value) => props.setFieldValue('credentialsId', value)} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button 
                type="submit" 
                borderRadius="lg" 
                width="full"
                colorScheme="twitter"
                mt={8} 
                isLoading={isSubmitting}
              >
                {scopedT('createButton.label')}
              </Button>
            </ModalFooter>
          </Form>
        )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}