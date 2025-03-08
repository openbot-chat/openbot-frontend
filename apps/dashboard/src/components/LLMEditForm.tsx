import { createRef, useEffect, useMemo, useState } from 'react'
import {
  Button,
  VStack,
} from '@chakra-ui/react'
import JSONForm from '@/components/JSONForm'
import { 
  CredentialsSelectWidget,
} from '@/components/JSONForm/widgets'
import { useTranslations } from 'next-intl'


const openaiSchema = {
  "type": "object",
  "required": ["model_name"],
  "properties": {
    "model_name": {
      "title": "Model",
      "type": "string",
      "default": "gpt-3.5-turbo-1106",
      "oneOf": [
        { "type": "string", "title": "gpt-3.5-turbo-0613", "enum": ["gpt-3.5-turbo-0613"] },
        { "type": "string", "title": "gpt-3.5-turbo-1106", "enum": ["gpt-3.5-turbo-1106"] },
        { "type": "string", "title": "GPT-4", "enum": ["gpt-4"] }
      ]
    },
    "temperature": {
      "title": "Temperature",
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "multipleOf": 0.1
    },
    "credentials_id": {
      "title": "Credentials",
      "type": "string"
    },
  }
};

const openaiUISchema = {
  "temperature": {
    "ui:widget": "range",
    "ui:options": {
    }
  },
  "credentials_id": {
    "ui:widget": "CredentialsSelectWidget",
    "ui:options": {
        "type": "openai"
    }
  }
}

const claudeSchema = {
  "type": "object",
  "required": ["model_name"],
  "properties": {
    "model_name": {
      "title": "Model",
      "type": "string",
      "default": "claude-v1",
      "oneOf": [
        { "type": "string", "title": "ClaudeV1", "enum": ["claude-v1"] },
        { "type": "string", "title": "claudeV1_100k", "enum": ["claude-v1-100k"] },
        { "type": "string", "title": "claudeV1_0", "enum": ["claude-v1-0"] },
        { "type": "string", "title": "claudeV1_2", "enum": ["claude-v1-2"] },
        { "type": "string", "title": "claudeV1_3", "enum": ["claude-v1-3"] },
        { "type": "string", "title": "claudeV1_3_100k", "enum": ["claude-v1-100k"] },
        { "type": "string", "title": "ClaudeInstantV1", "enum": ["claude-instant-v1"] },
        { "type": "string", "title": "ClaudeInstantV1_100k", "enum": ["claude-instant-100k"] },
        { "type": "string", "title": "ClaudeInstantV1_0", "enum": ["claude-instant-v1_0"] },
        { "type": "string", "title": "ClaudeInstantV1_1", "enum": ["claude-instant-v1_1"] },
        { "type": "string", "title": "ClaudeInstantV1_1_100k", "enum": ["claude-instant-v1_1_100k"] },
      ]
    },
    "temperature": {
      "title": "Temperature",
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "multipleOf": 0.1
    },
    "credentials_id": {
      "title": "Credentials",
      "type": "string"
    },
  }
};

const claudeUISchema = {
  "temperature": {
    "ui:widget": "range",
    "ui:options": {
    }
  },
  "credentials_id": {
    "ui:widget": "CredentialsSelectWidget",
    "ui:options": {
        "type": "claude"
    }
  }
}

const replicateSchema = {
  "type": "object",
  "required": [
    "model_type",
    "version"
  ],
  "properties": {
    "model_type": {
      "title": "Model",
      "type": "string",
      "default": "LLaMa",
      "oneOf": [
        { "type": "string", "title": "LLaMa", "enum": ["llama"] },
        { "type": "string", "title": "StableLM", "enum": ["stablelm"] },
        { "type": "string", "title": "Open Assistant", "enum": ["open-assistant"] },
      ]
    },
    "version": {
      "title": "Version",
      "type": "string"
    },
    "credentials_id": {
      "title": "Credentials",
      "type": "string"
    }
  }
};

const replicateUISchema = {
  "credentials_id": {
    "ui:widget": "CredentialsSelectWidget",
    "ui:options": {
        "type": "replicate"
    }
  }
}

const huggingfaceEndpointSchema = {
  "type": "object",
  "required": [
    "endpoint_url"
  ],
  "properties": {
    "endpoint_url": {
      "title": "Endpoint URL",
      "type": "string",
      "format": "uri"
    },
    "task": {
      "title": "Task",
      "type": "string"
    },
    "credentials_id": {
      "title": "Credentials",
      "type": "string"
    },
  }
};

const huggingfaceEndpointUISchema = {
  "credentials_id": {
    "ui:widget": "CredentialsSelectWidget",
    "ui:options": {
        "type": "huggingface_endpoint"
    }
  }
}

const schemas = {
  openai: openaiSchema,
  claude: claudeSchema,
  replicate: replicateSchema,
  huggingface_endpoint: huggingfaceEndpointSchema,
}

const uiSchemas = {
  "openai": openaiUISchema,
  "claude": claudeUISchema,
  "replicate": replicateUISchema,
  "huggingface_endpoint": huggingfaceEndpointUISchema
}

const typeSchema = {
  "title": "Service",
  "type": "string",
  "default": "openai",
  "oneOf": [
    { "type": "string", "title": "OpenAI", "enum": ["openai"] },
    { "type": "string", "title": "Claude", "enum": ["claude"] },
    { "type": "string", "title": "Replicate", "enum": ["replicate"] },
    { "type": "string", "title": "HuggingFace Endpoint", "enum": ["huggingface_endpoint"] }
  ]
}

const widgets = {
  CredentialsSelectWidget,
}


type Props = {
  isLoading?: boolean
  formData: any
  onSubmit: (values) => void
}

export const LLMEditForm: React.FC<Props> = ({
  isLoading,
  formData,
  onSubmit,
}) => {
  const t = useTranslations()
  const formRef = createRef()
  const typeFormRef = createRef()
  const [type, setType] = useState('openai')
  useEffect(() => {
    if (formData && formData?._type) {
      setType(formData?._type);
    }
  }, [formData]);

  const schema = useMemo(() => schemas[type], [type])
  const uiSchema = useMemo(() => uiSchemas[type], [type])

  const handleSubmit = (props) => {
    const { formData } = props;
    const data = {
      ...formData,
      _type: type,
    }

    onSubmit(data)
  }

  const handleSetType = ({ formData }) => {
    setType(formData)
  }

  return (
    <VStack spacing={4} w='full' alignItems="flex-start">
      <JSONForm className="w-full" ref={typeFormRef} formData={type} schema={typeSchema} onChange={handleSetType}>
        <Button type="submit" display="none"></Button>
      </JSONForm>
      {schema && (
        <JSONForm
          className="w-full"
          ref={formRef}
          schema={schema}
          uiSchema={uiSchema}
          widgets={widgets}
          formData={formData}
          onSubmit={handleSubmit}
          noHtml5Validate
          showErrorList={false}
        >
          <Button type="submit" display="none"></Button>
        </JSONForm>
      )}
      <Button isLoading={isLoading} type="submit" colorScheme="twitter" onClick={() => formRef.current?.submit()} loadingText={t('saveButton.label')}>{t('saveButton.label')}</Button>
    </VStack>
  )
}