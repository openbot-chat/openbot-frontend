import React from 'react'
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
  Input,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react'
import {
  Organization,
  createOrganizationSchema,
} from 'models';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from "@artizon/zod-formik-adapter";
import { useTranslations } from 'next-intl';



type Props = {
  isSubmitting?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (org: Organization) => void;
}

export const CreateOrganizationModal: React.FC<Props> = ({
  isSubmitting,
  isOpen,
  onClose,
  onCreate,
}) => {
  const t = useTranslations()
  const scopedT = useTranslations('organization.createModal')

  const formik = useFormik<{ name?: string; }>({
    initialValues: {},
    validationSchema: () => toFormikValidationSchema(createOrganizationSchema),
    onSubmit: async (values) => {
      await onCreate?.(values)
      onClose()
    },
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      isCentered
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {scopedT('title')}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody as={HStack} p="0" spacing="0">
            <VStack
              h="full"
              py="6"
              w="100%"
              px="4"
              borderLeftWidth={1}
            >
              <FormControl isRequired isInvalid={formik.touched.name && formik.errors.name}>
                <FormLabel>{t('organization.name')}</FormLabel>
                <Input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} defaultValue={scopedT('name.defaultValue')} />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                <FormHelperText>
                  The name of your organization. This will be visible to other members.
                </FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              type="submit" 
              borderRadius="lg" 
              colorScheme="twitter"
              mt={8} 
              w='full'
              isLoading={isSubmitting}
              isDisabled={!formik.isValid}
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}