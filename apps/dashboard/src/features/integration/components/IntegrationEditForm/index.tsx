import { useMemo, useCallback } from 'react';
import {
  Button,
} from '@chakra-ui/react';
import JSONForm from "@/components/JSONForm";
import {
  Integration,
} from 'models';
import { FileWidget, CodeEditorWidget } from '@/components/JSONForm/widgets';

import { schemas, uiSchemas } from './schemas';

const widgets = {
  FileWidget,
  CodeEditorWidget,
}

type Props = {
  catalog: string;
  formData?: Integration;
  onSubmit?: (values: Partial<Integration>) => Promise<void>;
}

export const IntegrationEditForm = ({
  catalog,
  formData: _formData,
  onSubmit,
}: Props) => {
  const schema = useMemo(() => schemas[catalog], [catalog])
  const uiSchema = useMemo(() => uiSchemas[catalog], [catalog])
  const formData = useMemo(() => ({..._formData, catalog}), [_formData, catalog])

  const handleSubmit = useCallback(async ({ formData }) => {
    const { options: optionsStr, ...rest} = formData;
    const data = { ...rest, catalog };
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
      <Button colorScheme="twitter" type="submit">{formData ? 'Save' : 'Create'}</Button>
    </JSONForm>
  ) : <></>;
}