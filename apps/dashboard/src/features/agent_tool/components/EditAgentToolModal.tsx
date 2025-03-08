import React, { createRef, useMemo } from 'react'
import {
  Text,
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
  IconButton,
} from '@chakra-ui/react'
import {
  AgentTool,
  Tool,
} from 'models'

import JSONForm from "@/components/JSONForm"
import validator from '@rjsf/validator-ajv8'
import { 
  FileWidget,
  CodeEditorWidget,
  CredentialsSelectWidget,
  DatastoreSelectWidget,
} from '@/components/JSONForm/widgets'
import { trpc } from '@/utils/trpc-client'
import { DeleteIcon } from '@chakra-ui/icons'
import { useToast } from '@/hooks/useToast'
import { ConfirmModal } from '@/components/ConfirmModal'
import $pick from 'lodash.pick'
import { useParentModal } from '@/features/graph/providers/ParentModalProvider'


const widgets = {
  FileWidget,
  CodeEditorWidget,
  CredentialsSelectWidget,
  DatastoreSelectWidget,
}

type Props = {
  tool: Tool
  value?: AgentTool
  isLoading?: boolean
  isOpen: boolean;
  onClose: () => void
  onSubmit?: (agentTool: Partial<AgentTool>) => void
}

export const EditAgentToolModal: React.FC<Props> = ({
  tool,
  value,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { ref } = useParentModal()
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()

  const submit = async (props) => {
    const { formData } = props

    const data = {
      ...formData, 
    }

    await onSubmit?.(data)
    onClose()
  }

  const formRef = createRef<Form>()

  const formData = useMemo(() => {
    if (!value) {
      return {
        name: tool.name,
        description: tool.description,
      }
    } else {
      return $pick(value, 'name', 'description', 'return_direct', 'options')
    }
  }, [value, tool])

  const removeAgentToolMutation = trpc.agent.removeTool.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.agentTool.list.invalidate()
      onClose()
    },
  })

  const schema = useMemo(() => {
    const basicProperties = {
      "name": {
        "type": "string",
        "title": "Name"
      },
      "description": {
        "type": "string",
        "title": "Description"
      }
    }

    if (!tool.options?.schema) {
      return {
        "type": "object",
        "properties": basicProperties,
      }
    } else {
      const schema = {...tool.options?.schema}
      schema.properties = {...basicProperties, ...schema.properties}
      return schema
    }
  }, [tool.options?.schema])

  const uiSchema = useMemo(() => {
    const basicUiSchema = {
      "description": {
        "ui:widget": "textarea"
      }
    }

    if (!tool.options?.uiSchema) {
      return basicUiSchema
    } else {
      const uiSchema = {...tool.options?.uiSchema}
      for(const k in basicUiSchema) {
        uiSchema[k] = basicUiSchema[k]
      }
      return uiSchema
    }
  }, [tool.options?.uiSchema])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent ref={ref}>
        <ModalHeader as={HStack} spacing={2}>
          <Text>{value ? 'Edit Tool' : 'Add Tool'}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody as={HStack} p="0" spacing="0">
          <VStack
            h="full"
            py="6"
            w="100%"
            px="4"
            borderLeftWidth={1}
          >
            <JSONForm
              ref={formRef}
              schema={schema}
              uiSchema={uiSchema}
              className="w-full"
              validator={validator}
              widgets={widgets}
              formData={formData}
              onSubmit={submit}
              noHtml5Validate
              showErrorList={false}
            >
              <Button type="submit" display="none"></Button>
            </JSONForm>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            {value && (
              <ConfirmModal 
                isLoading={removeAgentToolMutation.isLoading}
                trigger={
                  <IconButton 
                    aria-label="Delete"
                    colorScheme="red"
                    icon={<DeleteIcon />} 
                    isLoading={removeAgentToolMutation.isLoading}
                    isDisabled={isLoading}
                  />
                }
                title={"Are You Sure to delete this tool"}
                message={"Are You Sure to delete this tool?"}
                onConfirm={() => removeAgentToolMutation.mutateAsync({
                  agent_tool_id: value.id,
                  agent_id: value.agent_id,
                })}
              />
            )}
            <Button 
              type="submit" 
              borderRadius="lg" 
              width="full"
              colorScheme="twitter"
              isLoading={isLoading}
              onClick={async () => await formRef.current.submit()}
            >
              {value ? 'Save' : 'Create'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}