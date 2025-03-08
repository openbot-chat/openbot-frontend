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
  Tool,
} from 'models';

import JSONForm from "@/components/JSONForm";
import validator from '@rjsf/validator-ajv8';

import { 
  FileWidget,
  CodeEditorWidget,
} from '@/components/JSONForm/widgets';
import { trpc } from '@/utils/trpc-client';
import { DeleteIcon } from '@chakra-ui/icons';
import { useToast } from '@/hooks/useToast';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useTranslations } from 'next-intl';



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
}


const DEFAULT_SPEC = JSON.stringify({
  "openapi": "3.0.0",
  "info": {
    "title": "TaskAPI",
    "version": "1.0.0",
    "description": "an OpenAPI REST descriptor"
  },
  "servers": [
    {
      "url": "https://task.openbot.chat"
    }
  ],
  "paths": {
    "/api/v1/tasks/:id": {
      "get": {
        "operationId": "Operation_1",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Operation Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Task": {
        "type": "object",
        "required": [],
        "properties": {}
      }
    }
  }
}, null, 4)


const defaultSchema = {
  "type": "object",
  "required": [
    "name",
    "description",
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
    "options": {
      "type": "object",
      "title": "Options",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
}

const defaultUiSchema = {
}


const openapiSchema = {
  "type": "object",
  "required": [
    "name",
    "description",
  ],
  "properties": {
    "options": {
      "type": "object",
      "title": "",
      "properties": {
        "spec": {
          "type": "string",
          "title": "Spec",
          "default": DEFAULT_SPEC,
        },
      }
    },
    "name": {
      "title": "Name",
      "type": "string",
    },
    "description": {
      "type": "string",
      "title": "Description",
    },
  }
};

const openapiUiSchema = {
  "name": {
    "ui:readonly": true,
  },
  "description": {
    "ui:readonly": true,
    "ui:widget": "textarea",
  },
  "options": {
    "spec": {
      "ui:widget": "CodeEditorWidget",
      "ui:options": {
        "editorHeight": "400px"
      }
    },
  }
};


const DEFAULT_CODE = `function (context, callback) {
    console.log('context args: ', context.message);
    console.log('context args: ', context.args);

    const response = {
      "text": "echo"
    };

    callback(response)
}
`;


const functionSchema = {
  "type": "object",
  "required": [
    "type",
    "name",
    "description",
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
    "options": {
      "type": "object",
      "title": "",
      "properties": {
        "secrets": {
          "title": "Secrets",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "key": {
                "title": "Key",
                "type": "string"
              },
              "value": {
                "title": "Value",
                "type": "string"
              }
            }
          }
        },
        "parameters": {
          "title": "Parameters",
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "name",
              "type",
            ],
            "properties": {
              "name": {
                "title": "Name",
                "type": "string"
              },
              "description": {
                "title": "Description",
                "type": "string"
              },
              "type": {
                "title": "Type",
                "type": "string",
                "default": "string",
                "oneOf": [
                  { "type": "string", "title": "String", "enum": ["string"] },
                  { "type": "string", "title": "Number", "enum": ["number"] },
                  { "type": "string", "title": "Boolean", "enum": ["boolean"] }
                ]
              },
              "enum": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "required": {
                "title": "Required",
                "type": "boolean"
              }
            },
            "dependencies": {
              "type": {
                "oneOf": [
                  {
                    "properties": {
                      "type": {
                        "enum": ["string"]
                      },
                      "default": {
                        "title": "Default",
                        "type": "string"
                      }
                    }
                  },
                  {
                    "properties": {
                      "type": {
                        "enum": ["number"]
                      },
                      "default": {
                        "title": "Default",
                        "type": "number"
                      }
                    }
                  },
                  {
                    "properties": {
                      "type": {
                        "enum": ["boolean"]
                      },
                      "default": {
                        "title": "Default",
                        "type": "boolean"
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        "code": {
          "type": "string",
          "title": "Code",
          "default": DEFAULT_CODE,
        },
      }
    },
  }
};

const functionUiSchema = {
  "description": {
    "ui:widget": "textarea",
  },
  "options": {
    "code": {
      "ui:widget": "CodeEditorWidget",
      "ui:options": {
        "editorHeight": "400px",
        "lang": "javascript"
      }
    },
  },
};




const schemas = {
  openapi: openapiSchema,
  function: functionSchema,
};

const uiSchemas = {
  openapi: openapiUiSchema,
  function: functionUiSchema,
};


const widgets = {
  FileWidget,
  CodeEditorWidget,
}

type Props = {
  type: string;
  value?: Tool;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (tool: Partial<Tool>) => void;
}

export const EditToolModal: React.FC<Props> = ({
  type,
  value,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const scopedT = useTranslations('tools.editOpenApiToolModal')
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()

  const submit = async (props) => {
    const { formData } = props

    const { options: _options, ...rest } = formData

    const options = {
      ..._options,
      schema: DEFAULT_SCHEMA,
      uiSchema: DEFAULT_UISCHEMA,
    }

    const data = {
      type,
      ...rest,
      options,
    }

    await onSubmit?.(data)
    onClose()
  }

  const formRef = createRef<Form>();

  const formData = useMemo(() => value ?? { type }, [value, type])

  const schema = schemas[type] ?? defaultSchema
  const uiSchema = uiSchemas[type] ?? defaultUiSchema

  const deleteToolMutation = trpc.tool.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.tool.list.invalidate();
      onClose();
    },
  });

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