import React, { useMemo } from 'react'
import Form from '@rjsf/chakra-ui'
import { FormProps } from '@rjsf/core'
import { TitleFieldProps, ArrayFieldTemplateProps, ErrorListProps, FieldTemplateProps, getSubmitButtonOptions, ObjectFieldTemplateProps, SubmitButtonProps } from '@rjsf/utils';
import { PropsWithChildren, useEffect, useState } from 'react'
import validator from '@rjsf/validator-ajv8'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { Heading, Divider, Stack, Box, Flex, useDisclosure, Text, Collapse, Button, Table, Tbody } from '@chakra-ui/react'
import { SwitchWidget } from './widgets/SwitchWidget'
import RangeWidget from './widgets/RangeWidget'
import { WrapIfAdditionalTemplate } from './templates'



const renderLayout = (layout: any[], fields: { [k: string]: React.ReactElement }, n = 1) => {
  n++;
  return layout.map((item, i) => {
    if (Array.isArray(item)) {
      const even = (n & 1) === 0;
      return (
        <Flex
          key={`r-${n}-${i}`}
          direction={even ? 'row' : 'column'}
          justify="space-between"
          sx={{
            width: '100%',
            '& > div:not(:first-of-type)': {
              marginLeft: even ? '10px' : '0'
            }
          }}
        >
          {renderLayout(item, fields, n)}
        </Flex>
      );
    } else {
      return (
        <Box key={`r-${n}-${i}`} mb="10px" width="100%">
          {fields[item]}
        </Box>
      );
    }
  });
};

const ObjectFieldTemplate = ({ title, idSchema: { $id }, properties, uiSchema: { layout } }: ObjectFieldTemplateProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const fields = Object.fromEntries(properties.map((item) => [item.name, item.content]));
  return (
    <Box w="100%">
      {$id === 'root' ? (
        layout ? (
          renderLayout(layout, fields)
        ) : (
          properties.map((element) => {
            return (
              <Box key={element.content.key} mb="10px">
                {element.content}
              </Box>
            );
          })
        )
      ) : (
        <>
          <Flex
            mt="20px"
            mb="10px"
            padding="5px 0"
            align="center"
            justify="space-between"
            cursor="pointer"
            borderTop="1px solid #E5E5EA"
            borderBottom="1px solid #E5E5EA"
            borderColor="gray.100"
            _hover={{ backgroundColor: 'gray.100' }}
            onClick={onToggle}
          >
            <Text fontSize="18px" fontWeight={700}>
              {title}
            </Text>
            {isOpen ? <BiChevronUp /> : <BiChevronDown />}
          </Flex>
          <Collapse in={isOpen} animateOpacity>
            {layout
              ? renderLayout(layout, fields)
              : properties.map((element) => {
                return (
                  <Box key={element.content.key} mb="10px">
                    {element.content}
                  </Box>
                );
              })}
          </Collapse>
        </>
      )}
    </Box>
  );
};

const FieldTemplate = (props: FieldTemplateProps) => {
  const { id, classNames, label, help, required, description, errors, children, hidden } = props;
  return (
    <Flex direction="column" className={classNames} position={'relative'} css={{
      '.chakra-form-control': {
        '.chakra-form__label': {
          display: 'none'
        }
      },
      '.chakra-input': {
        height: '36px',
        lineHeight: '36px',
      }
    }}>
      {!hidden && <label style={{fontSize: '14px', color: '#0F0F0F', fontWeight: 500, marginBottom: 2}} htmlFor={id}>{label}{required ? <Text ml={'5px'} display={'inline-block'} color={'#e53e3e'}>*</Text> : null}</label>}
      <Box fontSize="12px" lineHeight={'14px'} css={{
        '.chakra-text': {
          marginTop: 0,
          marginBottom: '8px',

        }
      }}>{description}</Box>
      {!hidden && <Box>{children}</Box>}
      {help}
    </Flex>
  );
};

/*
const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <Stack>
      {props.items.map((element) => element.children)}
      {props.canAdd && <Button onClick={props.onAddClick}>Add</Button>}
    </Stack>
  );
}*/


const TitleFieldTemplate = ({
  id,
  title,
}: TitleFieldProps) => {
  return (
    <Box id={id} mt={1} mb={4}>
      <Heading size='sm'>{title}</Heading>
      <Divider />
    </Box>
  );
}

const ErrorListTemplate = ({ errors }: ErrorListProps) => {
  return (
    <Box mt="10px">
      <Text fontWeight={700}>Errors</Text>
      <Stack mt="10px">
        {errors.map((error, i) => (
          <Text key={`error-${i}`} color="red">{error.message}</Text>
        ))}
      </Stack>
    </Box>
  );
};

const defaultTemplates = {
  // FieldTemplate,
  // ObjectFieldTemplate,
  // ArrayFieldTemplate,
  TitleFieldTemplate,
  ErrorListTemplate,
  WrapIfAdditionalTemplate,
};

const defaultWidgets = {
  switch: SwitchWidget,
  range: RangeWidget,
}

type Props = FormProps;

const JSONForm = React.forwardRef(({
  formData: _formData,
  widgets: _widgets,
  templates: _templates,
  onSubmit,
  children,
  ...restProps
}: PropsWithChildren<Props>, ref) => {  
  const [formData, setFormData] = useState()
  const widgets = useMemo(() => ({...defaultWidgets, ..._widgets}), [_widgets])
  const templates = useMemo(() => ({...defaultTemplates, ..._templates}), [_templates])

  useEffect(() => {
    setFormData(_formData);
  }, [_formData])
  
  const handleSubmit = (props) => {
    const { formData } = props
    setFormData(formData)
    onSubmit?.(props)
  }

  return (
    <Form
      ref={ref}
      showErrorList="bottom"
      templates={templates}
      widgets={widgets}
      formData={formData}
      onSubmit={handleSubmit}
      validator={validator}
      onChange={(data) => setFormData(data.formData)}
      {...restProps}
    >
      {children}
    </Form>
  );
});


JSONForm.displayName = 'JSONForm';

export default JSONForm;