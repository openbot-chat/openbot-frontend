import React, { useEffect, useMemo } from 'react'
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
  Stack,
  IconButton,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  TableContainer,
  Table,
  Thead,
  Th,
  Td,
  Tbody,
  Tr,
} from '@chakra-ui/react'
import {
  Tool,
} from 'models'
import { trpc } from '@/utils/trpc-client'
import { DeleteIcon } from '@chakra-ui/icons'
import { useToast } from '@/hooks/useToast'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useTranslations } from 'next-intl'
import { useDebounce } from 'use-debounce'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useFormik } from 'formik'



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

type Props = {
  value?: Tool
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onSubmit?: (tool: Partial<Tool>) => void
}

export const EditOpenAPIToolModal: React.FC<Props> = ({
  value,
  isLoading,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const scopedT = useTranslations('tools.editOpenApiToolModal')
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const formik = useFormik({
    initialValues: value ? {
      spec: value.options?.spec,
      privacy: value.options?.privacy,
      name: value.name,
      description: value.description,
    } : {},
    // validationSchema: () => toFormikValidationSchema(voiceConfigSchema),
    onSubmit: async (values) => {
      const { spec, privacy } = values

      let specObj
      try {
        specObj = JSON.parse(debouncedSpec ?? '')
      // eslint-disable-next-line no-empty
      } catch(e) {        
      }

      if (!specObj) return

      const name = specObj.info.title
      const description = specObj.info.description

      const data = {
        type: 'openapi',
        name,
        description,
        options: {
          spec,
          schema: DEFAULT_SCHEMA,
          uiSchema: DEFAULT_UISCHEMA,
          privacy,
        },
      }
  
      await onSubmit?.(data)
      onClose()
    },
  })

  useEffect(() => {
    if (value) {
      formik.setValues({
        spec: value.options?.spec,
        privacy: value.options?.privacy,
        name: value.name,
        description: value.description,
      })
    } else {
      formik.resetForm()
    }
  }, [value])

  const [debouncedSpec] = useDebounce(formik.values.spec, 500)
  const spec = useMemo(() => {
    try {
      return JSON.parse(debouncedSpec ?? '')
    } catch(e) {
      return {}
    }
  }, [debouncedSpec])

  useEffect(() => {
    if(spec?.info?.title) {
      formik.setFieldValue('name', spec?.info?.title)
    } else {
      formik.setFieldValue('name', undefined)
    }

    if(spec?.info?.description) {
      formik.setFieldValue('description', spec?.info?.description)
    } else {
      formik.setFieldValue('description', undefined)
    }
  }, [spec])

  const deleteToolMutation = trpc.tool.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.tool.list.invalidate()
      onClose()
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
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
          <ModalBody>
            <Stack
              h="full"
              w="full"
              spacing={2}
            >
              <Box w="full">
                <CodeEditor
                  data-testid="code-editor"
                  defaultValue={DEFAULT_SPEC}
                  withVariableButton={false}
                  value={formik.values.spec}
                  height="400px"
                  lang={'json'}
                  onChange={(value) => formik.setFieldValue('spec', value)}
                  onBlur={formik.handleBlur}
                  spellCheck={true}
                />
              </Box>
              <FormControl>
                <FormLabel>
                  Name
                </FormLabel>
                <Input value={formik.values.name} readOnly />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Description
                </FormLabel>
                <Textarea value={formik.values.description} readOnly />
              </FormControl>

              <FormControl>
                <ApiOperationList spec={spec} />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Privacy Policy
                </FormLabel>
                <Input 
                  name="privacy"
                  value={formik.values.privacy} 
                  placeholder="https://api.example-weather-app.com/privacy"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
            </Stack>
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
                onClick={() => formik.submitForm()}
              >
                {value ? 'Save' : 'Create'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  )
}





const ApiOperationList = ({
  spec
}: {
  spec: any
}) => {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Th>Name</Th>
          <Th>Method</Th>
          <Th>Path</Th>
        </Thead>
        <Tbody>
        {Object.entries(spec?.paths ?? {}).map(([path, operations]) => 
          Object.entries(operations).map(([method, operation], i) => (
            <ApiOperationRow key={i} spec={spec} path={path} method={method} operation={operation} />
          ))
        )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

const ApiOperationRow = ({
  spec,
  path,
  method,
  operation,
}: {
  spec: any
  path: string
  method: string
  path: any
}) => {
  const name = useMemo(() => operation.operationId ?? formatName(path, method), [operation, path, method])
  return (
    <Tr>
      <Td>{name}</Td>
      <Td>{method}</Td>
      <Td>{path}</Td>
    </Tr>
  )
}


function formatName(path, method) {
  return method + '_' + path.replace(/\//g, '_')
}