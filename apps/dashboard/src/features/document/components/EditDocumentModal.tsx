import React, { FormEvent, useState, useMemo, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  FormLabel,
  Textarea,
  FormControl,
  Spinner,
} from '@chakra-ui/react';

import {
  Document,
} from 'models';
import { useFormik } from 'formik'
import { Loading } from '@/components/Loading';


export type Props = {
  document?: Document;
  isLoading: boolean;
  isOpen: boolean;
  onEdit?: (document: Document) => void
  onClose: () => void
}

export const EditDocumentModal: React.FC<Props> = ({
  document,
  isLoading,
  isOpen,
  onEdit,
  onClose,
}) => {
  const formik = useFormik({
    initialValues: document ?? {},
    onSubmit: async (values, formikHelpers) => {
      await onEdit?.(values)
    },
  })

  useEffect(() => {
    formik.setValues(document ?? {});
  }, [document])

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Loading isLoading={isLoading}>
              <VStack spacing="6" w="full">
                <FormControl id="text">
                  <FormLabel>
                    文本({formik.values.text?.length ?? 0}) 
                  </FormLabel>
                  <Textarea 
                    placeholder=""
                    minH={600}
                    onBlur={formik.handleBlur}
                    value={formik.values.text}
                    onChange={formik.handleChange}
                  />
                </FormControl>
              </VStack>
            </Loading>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="twitter"
              isLoading={isLoading}
            >
              保存
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}