import React, { FormEvent, useState } from 'react'
import {
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
import { TextInput } from '@/components/inputs'

type Props = {
  isSubmitting?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onImportPlugin: (data: { url: string }) => void;
}

export const ImportPluginModal: React.FC<Props> = ({
  isSubmitting,
  isOpen,
  onClose,
  onImportPlugin,
}) => {
  const [url, setUrl] = useState('');

  const importPlugin = async (e: FormEvent) => {
    e.preventDefault();
    onImportPlugin?.({ url });
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
          导入插件
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={importPlugin}>
          <ModalBody as={HStack} p="0" spacing="0">
            <VStack
              h="full"
              py="6"
              w="100%"
              px="4"
              borderLeftWidth={1}
            >
              <TextInput 
                label="导入插件URL"
                placeholder="https://www.domain.com/.well-known/ai-plugin.json"
                onChange={setUrl}
                debounceTimeout={0}
                isRequired
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              type="submit" 
              borderRadius="lg" 
              width="full"
              colorScheme="blue"
              mt={8} 
              isLoading={isSubmitting}
              isDisabled={url === ''}
            >
              导入
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}