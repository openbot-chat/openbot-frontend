import { useMemo, useCallback } from 'react'
import {
  Button,
} from '@chakra-ui/react';
import JSONForm from "@/components/JSONForm"
import {
  Connection,
} from 'models'
import { FileWidget, CodeEditorWidget } from '@/components/JSONForm/widgets'

const widgets = {
  FileWidget,
  CodeEditorWidget,
}






const schema = {
  "type": "object",
  "required": [
    "name",
    "identifier",
    "options"
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
    },
    "identifier": {
      "type": "string",
      "title": "Identifier",
    },
    "icon": {
      "type": "string",
      "title": "Icon",
      "format": "file"
    },
    "doc_url": {
      "type": "string",
      "title": "Doc Url",
      "format": "uri"
    },
    "options": {
      "type": "string",
      "title": "Options",
    }
  }
}

const uiSchema = {
  "icon": {
    "ui:options": {
      "tips": "Upload",
      "accept": {
        "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      },
      "mode": "image",
      "maxSize": 104857600,
      "flexProps": {
        "h": "200px",
        "borderRadius": "8px"
      }
    }
  },
  "options": {
    "ui:widget": "CodeEditorWidget",
    "ui:options": {
      "lang": "json",
      "editorHeight": "400px",
      "docUri": {
        "title": 'SDK Document',
        "uri": 'https://docs.openbot.chat/chain/function/README.md'
      }
    }
  }
}



type Props = {
  isLoading?: boolean;
  formData?: Connection;
  onSubmit?: (values: Partial<Connection>) => Promise<void>;
}

export const ConnectionEditForm = ({
  isLoading,
  formData,
  onSubmit,
}: Props) => {
  const handleSubmit = useCallback(async ({ formData }) => {
    const { options: optionsStr, ...rest} = formData;
    const data = { ...rest };
    /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
    try {
      data.options = JSON.parse(optionsStr);
    } catch (e) {
      /* empty */
    }

    return await onSubmit?.(data);
  }, [onSubmit]);

  return schema ? (
    <JSONForm
      className="w-full"
      schema={schema}
      uiSchema={uiSchema}
      widgets={widgets}
      formData={formData}
      onSubmit={handleSubmit}
      noHtml5Validate
      showErrorList={false}
    >
      <Button colorScheme="twitter" type="submit" isLoading={isLoading}>{formData ? 'Save' : 'Create'}</Button>
    </JSONForm>
  ) : <></>;
}