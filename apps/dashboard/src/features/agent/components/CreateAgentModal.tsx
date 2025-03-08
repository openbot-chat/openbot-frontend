import React, { FormEvent, useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  Divider,
  Heading,
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
  Radio,
  RadioGroup,
  Select,
} from '@chakra-ui/react'
import { TextInput, Textarea } from '@/components/inputs'
import {
  Agent,
  AgentVisibility
} from 'models';

type Props = {
  isSubmitting?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agent: Agent) => void;
}

export const CreateAgentModal: React.FC<Props> = ({
  isSubmitting,
  isOpen,
  onClose,
  onCreateAgent,
}) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('')
  const [visibility, setVisibility] = useState(AgentVisibility.Public)
  const [avatar, setAvatar] = useState('');//默认图像地址

  const createAgent = async (e: FormEvent) => {
    e.preventDefault();
    onCreateAgent?.({
      name,
      avatar,
      instructions,
      visibility,
    });
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
          新建智能体
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={createAgent}>
          <ModalBody as={HStack} p="0" spacing="0">
            <VStack
              h="full"
              py="6"
              w="100%"
              px="4"
              borderLeftWidth={1}
            >
              <TextInput 
                label="角色名称"
                placeholder="角色名称"
                onChange={setName}
                debounceTimeout={0}
                isRequired
              />
              <Textarea 
                isRequired
                label="介绍"
                placeholder="介绍"
                onChange={setInstructions}
                debounceTimeout={0}
              />
              <FormControl>
                <FormLabel as='legend'>
                  可见性
                </FormLabel>
                <RadioGroup onChange={setVisibility} value={visibility}>
                  <HStack spacing={4}>
                    <Radio value="public">任何人可访问</Radio>
                    <Radio value="protected">授权可访问</Radio>
                    <Radio value="private">只有组织内部可访问</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              type="submit" 
              borderRadius="lg" 
              colorScheme="twitter"
              mt={8} 
              isLoading={isSubmitting}
              isDisabled={name === '' || instructions === ''}
            >
              创建
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}