


import React, { useEffect, useMemo } from 'react'
import {
  Tag,
  Text,
  Stack,
  Button,
  HStack,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react'
import { Prompt, createPromptSchema } from 'models';
import $pick from 'lodash.pick';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik'
import { toFormikValidationSchema } from '@artizon/zod-formik-adapter';
import { getPromptVariables } from '../helpers';



type Props = {
  data?: Prompt;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (prompt: Partial<Prompt>) => void;
}

export default function EditPromptModal({
  data,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const scopedT = useTranslations('prompts.editPromptModal')
  const formData = useMemo(() => $pick(data, 'name', 'content', 'input_variables'), [data])

  const formik = useFormik<Prompt>({
    initialValues: formData ?? {},
    validationSchema: () => toFormikValidationSchema(createPromptSchema.omit({ org_id: true })),
    onSubmit: async (values: Prompt) => {
      const payload = {
        ...values,
        input_variables: getPromptVariables(values.content) || [],
      } 
      await onSubmit?.(payload)

      formik.resetForm()
      onClose()
    },
  })

  useEffect(() => {
    formik.setValues(formData ?? {})
  }, [formData])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={HStack} spacing={2}>
          <Text>{data ? scopedT('edit.title') : scopedT('create.title')}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Stack
              spacing={4}
            >
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>
                  {scopedT('alert.description')}
                </AlertDescription>
              </Alert>
              <Stack>
                <FormControl isRequired isInvalid={formik.touched.name && formik.errors.name}>
                  <FormLabel>{scopedT('name.label')}</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <FormHelperText>{scopedT('name.helpTxt')}</FormHelperText>
                  {formik.errors.name && (
                    <FormErrorMessage>{scopedT('name.error')}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={formik.touched.content && formik.errors.content}>
                  <FormLabel>{scopedT('content.label')}</FormLabel>
                  <Textarea
                    minHeight="300px"
                    placeholder="You are an AI assistant"
                    name="content"
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                  />
                  <FormHelperText>
                    {scopedT.rich('content.helpTxt', {
                      tag: () => <Tag size="sm">{'{input}'}</Tag>
                    })}
                  </FormHelperText>
                  {formik.errors.content && (
                    <FormErrorMessage>{scopedT('content.error_message')}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Input variables</FormLabel>
                  <HStack>
                    {getPromptVariables(formik.values.content).map((variable) => (
                      <Tag key={variable}>{variable}</Tag>
                    ))}
                  </HStack>
                </FormControl>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button 
                type="submit" 
                borderRadius="lg" 
                colorScheme="twitter"
                isLoading={isLoading}
              >
                {data ? scopedT('updateButton.label') : scopedT('createButton.label')}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}