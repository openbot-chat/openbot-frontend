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
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import {
  Tool,
} from 'models'

import JSONForm from "@/components/JSONForm"
import validator from '@rjsf/validator-ajv8'

import { 
  FileWidget,
  CodeEditorWidget,
} from '@/components/JSONForm/widgets'
import { trpc } from '@/utils/trpc-client'
import { DeleteIcon } from '@chakra-ui/icons'
import { useToast } from '@/hooks/useToast'
import { ConfirmModal } from '@/components/ConfirmModal'
import { UrlInput } from '@/components/UrlInput'
import { useTranslations } from 'next-intl'
import {
  TableArrayFieldTemplate,
  RowObjectFieldTemplate,
  RowFieldTemplate,
} from '@/components/JSONForm/templates/TableArrayFieldTemplate'


const DEFAULT_SCHEMA = {
  "type": "object",
  "properties": {
    "options": {
      "title": "",
      "type": "object",
      "properties": {
        "credentials_id": {
          "title": "Credentials",
          "type": "string"
        },
        "headers": {
          "type": "array",
          "title": "Headers",
          "items": {
            "type": "object",
            "required": [
              "name",
              "value"
            ],
            "properties": {
              "name": {
                "type": "string",
                "title": "Name"
              },
              "value": {
                "type": "string",
                "title": "Value"
              }
            }
          }
        }
      }
    }
  }
}

const DEFAULT_UISCHEMA = {
  "options": {
    "credentials_id": {
      "ui:widget": "CredentialsSelectWidget",
      "ui:options": {
          "type": "http_header_auth"
      }
    }
  }
};


const schema = {
  "type": "object",
  "required": [
    "type",
    "name",
    "description",
    "url"
  ],
  "properties": {
    "name": {
      "title": "Name",
      "type": "string",
    },
    "description": {
      "type": "string",
      "title": "Description",
      "description": "Use clear language to describe the tool's capabilities and appropriate use cases."
    },
    "url": {
      "type": "string",
      "title": "Url",
    },
    "headers": {
      "type": "array",
      "title": "Headers",
      "items": {
        "type": "object",
        "required": ["name", "value"],
        "properties": {
          "name": {
            "type": "string",
            "title": "Name"
          },
          "value": {
            "type": "string",
            "title": "Value"
          },
        }
      }
    },
    "query": {
      "type": "array",
      "title": "Query Parameters",
      "items": {
        "type": "object",
        "required": ["name", "value"],
        "properties": {
          "name": {
            "type": "string",
            "title": "Field Name"
          },
          "type": {
            "type": "string",
            "title": "Field Type",
            "enum": [
              "string",
              "number",
              "boolean",
              "integer"
            ]
          },
          "required": {
            "type": "boolean",
            "title": "Required",
            "default": false
          },
          "description": {
            "type": "string",
            "title": "Description"
          },
          "default": {
            "type": "string",
            "title": "Default Value"
          },
          "example": {
            "type": "string",
            "title": "Example Value"
          },
        }
      }
    },
    "body": {
      "type": "array",
      "title": "Request Body",
      "items": {
        "type": "object",
        "required": ["name", "value"],
        "properties": {
          "name": {
            "type": "string",
            "title": "Field Name"
          },
          "type": {
            "type": "string",
            "title": "Field Type",
            "enum": [
              "string",
              "number",
              "boolean",
              "integer"
            ]
          },
          "required": {
            "type": "boolean",
            "title": "Required",
            "default": false
          },
          "description": {
            "type": "string",
            "title": "Description"
          },
          "default": {
            "type": "string",
            "title": "Default Value"
          },
          "example": {
            "type": "string",
            "title": "Example Value"
          },
        }
      }
    }
  }
};

const uiSchema = {
  "headers": {
    "ui:ArrayFieldTemplate": TableArrayFieldTemplate,
    "items": {
      "ui:FieldTemplate": RowFieldTemplate,
      "ui:ObjectFieldTemplate": RowObjectFieldTemplate,
    }
  },
  "query": {
    "ui:ArrayFieldTemplate": TableArrayFieldTemplate,
    "items": {
      "ui:FieldTemplate": RowFieldTemplate,
      "ui:ObjectFieldTemplate": RowObjectFieldTemplate,
    }
  },
  "body": {
    "ui:ArrayFieldTemplate": TableArrayFieldTemplate,
    "items": {
      "ui:FieldTemplate": RowFieldTemplate,
      "ui:ObjectFieldTemplate": RowObjectFieldTemplate,
    }
  },
}


const widgets = {
  FileWidget,
  CodeEditorWidget,
}

const templates = {
  TableArrayFieldTemplate,
  RowObjectFieldTemplate,
}

type Props = {
  value?: Tool;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (tool: Partial<Tool>) => void;
}

export const EditAPIToolModal: React.FC<Props> = ({
  value,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const scopedT = useTranslations('tools.editOpenApiToolModal')

  const submit = async (props) => {
    const { formData } = props

    const options = {
      ...formData.options,
      schema: DEFAULT_SCHEMA,
      uiSchema: DEFAULT_UISCHEMA,
    }

    const data = {
      ...formData,
      options,
    }

    await onSubmit?.(data)
    onClose()
  }

  const formRef = createRef<Form>()

  const formData = useMemo(() => value ?? { type: 'openapi' }, [value])

  const deleteToolMutation = trpc.tool.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.tool.list.invalidate()
      onClose()
    },
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      closeOnOverlayClick={false}
      blockScrollOnMount={false}
      motionPreset='slideInBottom'
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={HStack} spacing={2}>
          <Text>{value ? scopedT('editTitle') : scopedT('createTitle')}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="0">
          <VStack
            h="full"
            py="6"
            w="100%"
            px="4"
            borderLeftWidth={1}
            spacing={2}
          >
            <FormControl>
              <FormLabel>Url</FormLabel>
              <UrlInput />
            </FormControl>
            <JSONForm
              ref={formRef}
              schema={schema}
              uiSchema={uiSchema}
              className="w-full"
              validator={validator}
              templates={templates}
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
                isLoading={deleteToolMutation.isLoading}
                trigger={
                  <IconButton 
                    aria-label="Delete"
                    colorScheme="red"
                    icon={<DeleteIcon />} 
                    isLoading={deleteToolMutation.isLoading}
                    isDisabled={isLoading}
                  />
                }
                title={"确认删除选中的工具"}
                message={"确认删除选中的工具?"}
                onConfirm={() => deleteToolMutation.mutateAsync(value.id)}
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