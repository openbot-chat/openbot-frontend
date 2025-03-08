import { createRef, useMemo } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react'
import { Agent } from 'models'
import { useTranslations } from 'next-intl'
import { CloseIcon } from '@chakra-ui/icons'
import { Formik, Form, Field, FieldArray } from 'formik'

type Props = {
  isLoading?: boolean
  formData: any
  onSubmit: (values: Agent) => void
}

export const ProfileEditForm: React.FC<Props> = ({
  isLoading,
  formData,
  onSubmit,
}) => {
  const t = useTranslations()
  const scopedT = useTranslations('agent')
  const initialValues = useMemo(() => ({
    ...formData,
    shortcuts: formData.shortcuts && formData.shortcuts.length > 0 ? formData.shortcuts : [
      { type: 'text', payload: '' }
    ],
  }), [formData])

  const handleShortcutChange = (shortcuts, i, arrayHelpers, onChange) => (e) => {
    if (i === (shortcuts.length - 1)) {
      if (e.target.value.length > 0) {
        arrayHelpers.push({ type: 'text', payload: ''})
      }
    } else {
      if (e.target.value.length === 0) {
        if (shortcuts.length > 1) {
          arrayHelpers.remove(i)
        }
      }
    }

    onChange(e)
  }

  const handleSubmit = async (values) => {
    const data = {...values}
    data.shortcuts = data.shortcuts.filter(it => it.payload.length > 0)
    await onSubmit(data)
  }

  const textBg = useColorModeValue('white', 'gray.600')

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize={true}>
    {({ handleSubmit, values, errors }) => {
      return (
        <Form className="w-full">
          <Stack spacing="4" alignItems="flex-start">
            <Field name={`instructions`}>
              {({ field }) => (
                <FormControl>
                  <FormLabel>{scopedT('instructions.label')} ({field.value?.length ?? 0})</FormLabel>
                  <Textarea {...field} rows={12} placeholder="" bg={textBg}/>
                </FormControl>
              )}
            </Field>

            <FormControl>
              <FormLabel>{scopedT('shortcuts.label')}</FormLabel>
              <Stack spacing={2} w="full">
                <FieldArray
                  name="shortcuts"
                  render={(arrayHelpers) => (
                    <Stack>
                      {values.shortcuts?.map((it, i) => (
                        <Field name={`shortcuts.${i}.payload`} key={i}>
                          {({ field: { onChange, ...rest }, }) => (
                            <InputGroup>
                              <Input {...rest} onChange={handleShortcutChange(values.shortcuts, i, arrayHelpers, onChange)} bg={textBg} />
                              <InputRightAddon>
                                <CloseIcon cursor="pointer" fontSize="12px" onClick={() => values.shortcuts.length > 1 && arrayHelpers.remove(i)} />
                              </InputRightAddon>
                            </InputGroup>
                          )}
                        </Field>
                      ))}
                    </Stack>
                  )}
                />
              </Stack>
            </FormControl>

            <Button isLoading={isLoading} type="submit" colorScheme="twitter" loadingText={t('saveButton.label')}>{t('saveButton.label')}</Button>
          </Stack>
        </Form>
      )
    }}
    </Formik>
  )
}