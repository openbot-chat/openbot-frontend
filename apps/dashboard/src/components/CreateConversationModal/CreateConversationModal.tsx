import React, { FormEvent, useState, useMemo } from 'react'
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
} from '@chakra-ui/react'

import {
  Conversation
} from '@/lib/api/llm-chat-api.adaptor'

import { TextInput } from '@/components/inputs'
import { DropdownList } from '@/components/DropdownList'


export type CreateConversationModalProps = {
  isOpen: boolean
  onNewConversation?: (conversation: Conversation) => void
  onClose: () => void
}

export const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  isOpen,
  onClose,
  onNewConversation,
}) => {
  const [name, setName] = useState('');
  const [llm, setLLM] = useState('');
  const [model, setModel] = useState('');

  const createConversation = async (e: FormEvent) => {
    e.preventDefault();
    onNewConversation?.({
      id: "aa",
      name,
    });
  }

  const handleLLMChange = (value: string) => {
    setLLM(value);
  }

  const handleModelChange = (value: string) => {
    setModel(value);
  }

  const llms = useMemo(() => [
    {
      value: "openai",
      label: "OpenAI",
    },
    {
      value: "hugging_face",
      label: "Hugging Face",
    },
    {
      value: "wenxin",
      label: "文心",
    }
  ], []);

  const models = useMemo(() => [
    {
      value: "gpt-4o",
      label: "GPT-4o",
    },
    {
      value: "gpt-o1-preview",
      label: "GPT-O1-Preview",
    },
    {
      value: "deepseek-chat",
      label: "DeepSeek",
    }
  ], []);


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={createConversation}>
          <ModalHeader>
            新建会话
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody as={VStack} spacing="6">
            <TextInput 
              label="会话名称"
              placeholder="会话名称"
              onChange={setName}
              debounceTimeout={0}
            />

            <HStack w="full">
              <FormLabel mb="0" htmlFor="button">
                自然语言大模型:
              </FormLabel>
              <DropdownList
                value={llm}
                onItemSelect={handleLLMChange}
                items={llms}
                placeholder="请选择模型"
              />
            </HStack>

            <HStack w="full">
              <FormLabel mb="0" htmlFor="button">
                模型:
              </FormLabel>
              <DropdownList
                value={model}
                onItemSelect={handleModelChange}
                items={models}
                placeholder="请选择模型"
              />
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="twitter"
              isDisabled={name.length === 0}
              isLoading={false}
            >
              创建会话
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}