import { createRef, useEffect, useMemo, useState } from 'react';
import {
  Button,
  VStack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import validator from '@rjsf/validator-ajv8';
import { RadioButtons } from '@/components/inputs';
import { CodeEditorWidget, PromptSelectWidget } from '@/components/JSONForm/widgets';
import JSONForm from '@/components/JSONForm';
import { useTranslations } from 'next-intl';


const chatSchema = {
  "type": "object",
  "properties": {
    "prompt_id": {
      "type": "string",
      "title": "Prompt"
    }
  }
}

const chatUISchema = {
  "prompt_id": {
    "ui:widget": "PromptSelectWidget"
  }
}

const qaSchema = {
  "type": "object",
  "required": [
  ],
  "properties": {
    "question_prompt_id": {
      "type": "string",
      "title": "Question Prompt",
    },
    "qa_prompt_id": {
      "type": "string",
      "title": "QAPrompt",
    }
  }
}

const qaUISchema = {
  "question_prompt_id": {
    "ui:widget": "PromptSelectWidget"
  },
  "qa_prompt_id": {
    "ui:widget": "PromptSelectWidget"
  }
}


const salesSchema = {
  "type": "object",
  "required": [
    "salesperson_role",
    "company_name",
    "company_business",
    "company_values",
    "conversation_purpose"
  ],
  "properties": {
    "salesperson_role": {
      "type": "string",
      "title": "Role",
      "minLength": 3,
      "maxLength": 32
    },
    "company_name": {
      "type": "string",
      "title": "Company Name",
      "minLength": 3,
      "maxLength": 32
    },
    "company_business": {
      "type": "string",
      "title": "Company Business",
      "minLength": 3,
      "maxLength": 300,
    },
    "company_values": {
      "type": "string",
      "title": "Company Values",
      "minLength": 3,
      "maxLength": 300,
    },
    "conversation_purpose": {
      "type": "string",
      "title": "Conversation Purpose",
      "minLength": 3,
      "maxLength": 100,
    }
  }
};

const salesUISchema = {
  "salesperson_role": {
    "ui:options": {
      "placeholder": "e.g.: Business Development Representative"
    }
  },
  "company_business": {
    "ui:widget": "textarea"
  },
  "company_values": {
    "ui:widget": "textarea"
  }
}

const generativeSchema = {
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "title": "Status",
      "minLength": 3,
      "maxLength": 300
    }  
  }
};

const generativeUISchema = {
  "status": {
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 5
    }
  }
}

const webhookSchema = {
  "type": "object",
  "required": ["url"],
  "properties": {
    "url": {
      "type": "string",
      "title": "URL",
      "format": "uri"
    },
    "headers": {
      "type": "array",
      "title": "",
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
    }
  }
}

const functionSchema = {
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "default": "module.export = function on_message({ message, conversation, agent }, chatApi) {\n\tchatApi.reply({ text: 'reply' });\n}",
    }
  }
}

const functionUISchema = {
  "code": {
    "ui:widget": "CodeEditorWidget",
    "ui:options": {
      "lang": "javascript",
      "editorHeight": "400px",
      docUri: {
        title: 'SDK Document',
        uri: 'https://docs.openbot.chat/chain/function/README.md'
      }
    }
  }
}

const schemas = {
  "chat": chatSchema,
  "qa": qaSchema,
  "sales": salesSchema,
  "generative": generativeSchema,
  "webhook": webhookSchema,
  "function": functionSchema,
};

const uiSchemas = {
  "chat": chatUISchema,
  "qa": qaUISchema,
  "generative": generativeUISchema,
  "sales": salesUISchema,
  "function": functionUISchema,
}

const widgets = {
  CodeEditorWidget,
  PromptSelectWidget,
}


type Props = {
  isLoading?: boolean;
  formData: any;
  onSubmit: (values) => void;
}

export const ChainSettingForm: React.FC<Props> = ({
  isLoading,
  formData: _formData,
  onSubmit,
}) => {
  const t = useTranslations()
  const formRef = createRef()
  const [type, setType] = useState<string>()
  const [formData, setFormData] = useState()
  const types = useMemo(() => [
    {
      label: 'Chat',
      value: 'chat',
    },
    {
      label: 'Tools',
      value: 'tools',
    },
    {
      label: 'QA',
      value: 'qa',
    },
    {
      label: 'Sales',
      value: 'sales',
    },
    {
      label: 'OpenAI Assistant',
      value: 'openai_assistant',
    },
  ], []);
  useEffect(() => {
    const type = _formData?.type
    setType(type)

    setFormData(_formData?.[type])
  }, [_formData]);

  const handleChangeType = (value: string) => {
    if (value !== type) {
      setFormData({})
      setType(value)
    }
  }

  const handleSubmit = (props) => {
    const { formData } = props;
    const payload = { 
      ..._formData,
      type
    }
    payload[type] = formData
    onSubmit(payload)
  }

  const schema = schemas[type] ?? {}
  const uiSchema = uiSchemas[type]
  

  return (
    <VStack spacing={4} w='full' alignItems="flex-start">
      <FormControl>
        <FormLabel>
          Choose Agent Provider
        </FormLabel>
        <RadioButtons options={types} value={type} onSelect={handleChangeType} />
      </FormControl>

      <JSONForm
        className="w-full"
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        widgets={widgets}
        formData={formData}
        onSubmit={handleSubmit}
        noHtml5Validate
        showErrorList={false}
      >
        <Button type="submit" display="none"></Button>
      </JSONForm>
      <Button isLoading={isLoading} type="submit" colorScheme="twitter" onClick={() => formRef.current?.submit()} loadingText={t('saveButton.label')}>{t('saveButton.label')}</Button>
    </VStack>
  );
}