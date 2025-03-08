import React, { createRef, useCallback, useMemo } from 'react'
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
  Image,
} from '@chakra-ui/react'
import {
  Datasource,
  Datastore,
} from 'models'

import JSONForm from "@/components/JSONForm"
import validator from '@rjsf/validator-ajv8'
import $pick from 'lodash.pick'

import { schemas, uiSchemas } from './datasource-form-schemas'
import { 
  FileWidget,
  UrlPreviewWidget,
  CredentialsSelectWidget,
} from '@/components/JSONForm/widgets'
import { trpc } from '@/utils/trpc-client'
import { Loading } from '@/components/Loading'
import { useDataProvider } from '../hooks/useDataProviders'
import { useParentModal } from '@/features/graph/providers/ParentModalProvider'

const widgets = {
  FileWidget,
  UrlPreviewWidget,
  CredentialsSelectWidget,
}

const templates = {
}

type Props = {
  datastore: Datastore
  provider: string
  datasource?: Datasource
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onCreate?: (datasource: Partial<Datasource>) => void
}

export const EditDatasourceModal: React.FC<Props> = ({
  datasource,
  datastore,
  provider,
  isLoading,
  isOpen,
  onClose,
  onCreate,
}) => {
  const { ref } = useParentModal()

  const { data: dataProvider, isLoading: isLoadingProvider } = useDataProvider(provider)

  const create = useCallback(async (props) => {
    const { formData } = props;

    const data = {
      ...formData, 
      type: provider, 
      datastore_id: datastore.id,
    } as Partial<Datasource>
    return await onCreate?.(data)
  }, [onCreate, provider, datastore])

  const schema = useMemo(() => {
    let schema;
    if (dataProvider) {
      schema = dataProvider.options?.schema;
    }
    
    if (!schema) {
      schema = schemas[provider];
    }

    if (schema && schema.properties) {
      schema.properties.metadata = {
        "type": "object",
        "title": "Metadata",
        "description": "Metadata for Customization",
        "maxProperties": 10,
        "additionalProperties": {
          "type": "string",
          "title": ""
        }
      };
    }

    return schema;
  }, [dataProvider, provider]);

  const uiSchema = useMemo(() => {
    let uiSchema;
    if (dataProvider) {
      uiSchema = dataProvider.options?.uiSchema;
    }

    if (!uiSchema) {
      uiSchema = uiSchemas[provider];
    }

    if (uiSchema) {
      uiSchema.metadata = {
        "ui:help": "Max 10 items",
        "additionalProperties": {
          "ui:options": {
            "placeholder": "Value"
          },
        }
      }
    }

    return uiSchema;
  }, [dataProvider, provider])
  const formRef = createRef()

  const formData = useMemo(() => {
    if (!datasource) {
      return {
        datastoreId: datastore?.id,
      };
    } else {
      return $pick(datasource, 'id', 'name', 'options', 'metadata');
    }
  }, [datastore, datasource])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnOverlayClick={false}
      motionPreset='slideInBottom'
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent ref={ref}>
        <ModalHeader as={HStack} spacing={2}>
          {dataProvider?.icon && <Image src={dataProvider?.icon} boxSize="48px" alt="" />}
          <Text>Load data from {dataProvider?.name}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py="6" px="4">
          <Loading isLoading={!schema && isLoadingProvider}>
            {schema && (
              <JSONForm
                ref={formRef}
                schema={schema}
                uiSchema={uiSchema}
                className="w-full"
                validator={validator}
                templates={templates}
                widgets={widgets}
                formData={formData}
                onSubmit={create}
                noHtml5Validate
                showErrorList={false}
              >
                <Button type="submit" display="none"></Button>
              </JSONForm>
            )}
          </Loading>
        </ModalBody>
        <ModalFooter>
          <Button 
            type="submit" 
            borderRadius="lg" 
            width="full"
            colorScheme="twitter"
            mt={8} 
            isLoading={isLoading}
            onClick={async () => await formRef.current.submit()}
          >
            {datasource ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}