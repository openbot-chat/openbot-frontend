import { createRef, useMemo } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  StackDivider,
  Textarea,
} from '@chakra-ui/react'
import { Agent } from 'models'
import { useTranslations } from 'next-intl'
import { CloseIcon } from '@chakra-ui/icons'
import { Formik, Form, Field, FieldArray } from 'formik'
import { CodeEditor } from '@/components/inputs/CodeEditor'



function validateJson(value: string) {
	let error
	if (!value) {
		error = 'Please enter Json'
	} else {
		try {
      JSON.parse(value)
    } catch(e) {
      error = 'not valid json'
    }
	}
	return error
}


type Props = {
  isLoading?: boolean
  formData: any
  onSubmit: (values: Agent) => void
}

export const MetadataEditForm: React.FC<Props> = ({
  isLoading,
  formData,
  onSubmit,
}) => {
  const t = useTranslations()
  const scopedT = useTranslations('agent')
  const initialValues = useMemo(() => ({
    metadata: JSON.stringify(formData.metadata ?? {}, '\t', 4),
  }), [formData])

  const handleSubmit = async (values) => {
    const data = {...values}
    data.metadata = JSON.parse(data.metadata ?? '{}')

    await onSubmit(data)
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize={true}>
    {({ handleSubmit, values, errors }) => {
      return (
        <Form className="w-full">
          <Stack spacing="4" alignItems="flex-start">
            <Field name={`metadata`} validate={validateJson}>
              {({ field: { onChange, ...rest }, form }) => (
                <FormControl isInvalid={form.errors.metadata && form.touched.metadata}>
                  <FormLabel>Metadata</FormLabel>
                  <CodeEditor {...rest} lang="json" onChange={(value) => form.setFieldValue('metadata', value)}/>
                  {form.touched.metadata && <FormErrorMessage>{form.errors.metadata}</FormErrorMessage>}
                </FormControl>
              )}
            </Field>

            <Button isLoading={isLoading} type="submit" colorScheme="twitter" loadingText={t('saveButton.label')}>{t('saveButton.label')}</Button>
          </Stack>
        </Form>
      )
    }}
    </Formik>
  )
}