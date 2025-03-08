import { createRef, useEffect, useState } from 'react';
import {
  Button,
  VStack,
} from '@chakra-ui/react';
import JSONForm from '@/components/JSONForm';
import { useTranslations } from 'next-intl';







const typeSchema = {
  "title": "Type",
  "type": "string",
  "oneOf": [
    { "type": "string", "title": "ConversationBufferWindow", "enum": ["conversation_buffer_window"] },
    { "type": "string", "title": "ConversationSummaryBufferMemory", "enum": ["conversation_summary_buffer_memory"] },
    { "type": "string", "title": "Zep", "enum": ["zep"] },
    // { "type": "string", "title": "Vectorstore", "enum": ["vectorstore"] },
  ]
}


const zepSchema = {
  "type": "object",
  "required": [
  ],
  "properties": {
    "api_url": {
      "type": "string",
      "title": "Api Url",
    },
    "api_key": {
      "type": "string",
      "title": "Api Key",
    },
  }
}

const zepUISchema = {
}

const schemas = {
  "zep": zepSchema,
};

const uiSchemas = {
  "zep": zepUISchema,
}

const widgets = {
}


type Props = {
  isLoading?: boolean;
  formData: any;
  onSubmit: (values) => void;
}

export const MemorySettingForm: React.FC<Props> = ({
  isLoading,
  formData: _formData,
  onSubmit,
}) => {
  const t = useTranslations()
  const typeFormRef = createRef()
  const formRef = createRef()
  const [type, setType] = useState<string>()
  const [formData, setFormData] = useState()
  useEffect(() => {
    setType(_formData?.type)
    setFormData(_formData)
  }, [_formData])

  const handleSetType = ({ formData: value }) => {
    if (value !== type) {
      setFormData({})
      setType(value)
    }
  }

  const handleSubmit = (props) => {
    const { formData } = props
    onSubmit({
      ...formData,
      type,
    })
  }

  const schema = schemas[type] ?? {}
  const uiSchema = uiSchemas[type]
  

  return (
    <VStack spacing={4} w='full' alignItems="flex-start">
      <JSONForm className="w-full" ref={typeFormRef} formData={type} schema={typeSchema} onChange={handleSetType}>
        <Button type="submit" display="none"></Button>
      </JSONForm>

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
      <Button isLoading={isLoading} type="submit" colorScheme="twitter" onClick={() => formRef.current?.submit()} loadingText={t('saveButton.label')}>{t('saveButton.label')}</Button>
    </VStack>
  );
}