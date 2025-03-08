import React, { useState, useEffect } from 'react';

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
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { Textarea, TextInput } from '../inputs';
import { FileWidget } from '@/components/JSONForm/widgets';

type Props = {
  isLoading?: boolean;
  url?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (image: { url: string }) => Promise<void>;
}

export const ImageUploadModal: React.FC<Props> = ({
  isLoading,
  url,
  isOpen,
  onClose,
  onSelect,
}) => {
  const [file, setFile] = useState()

  useEffect(() => {
    setFile({ url })
  }, [url])

  const handleConfirm = async () => {
    await onSelect?.(file)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          上传图片
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="0">
          <Tabs w="full">
            <TabList>
              <Tab>Upload</Tab>
              <Tab>Image Gallery</Tab>
              <Tab>AIGC</Tab>
            </TabList>
            <TabPanels>
              <TabPanel h='full'>
                <FileWidget 
                  value={file?.url}
                  options={{
                    tips: "Upload",
                    mode: 'image',
                    resultType: 'fileinfo',
                    flexProps: {
                      h: '400px'
                    }
                  }}
                  onChange={setFile}
                />
              </TabPanel>
              <TabPanel>
                comming soon
              </TabPanel>
              <TabPanel>
                <Textarea label="Prompt" w="full" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button 
            type="submit" 
            borderRadius="lg" 
            colorScheme="twitter"
            mt={8} 
            isDisabled={false}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            确认
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}