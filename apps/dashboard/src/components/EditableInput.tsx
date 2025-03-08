import {
  Editable,
  EditablePreview,
  EditableInput as ChakraEditableInput,
  Tooltip,
  useColorModeValue,
  useEditableControls,
  HStack,
  EditableProps,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'



function EditableControls() {
  const {
    isEditing,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (<></>) : (
    <EditIcon cursor="pointer" fontSize={18} {...getEditButtonProps()} />
  )
}


type Props = {
  value?: string
  onNewValue: (value: string) => void
} & EditableProps;

export const EditableInput = ({
  value: _value,
  onNewValue,
  ...restProps
}: Props) => {
  const emptyBg = useColorModeValue('gray.100', 'gray.700')
  const [value, setValue] = useState(_value)

  useEffect(() => {
    setValue(_value);
  }, [_value]);

  const submitNewValue = (newValue: string) => {
    if (newValue === '') return setValue(_value)
    if (newValue === _value) return
    onNewValue(newValue)
  }

  return (
    <Editable
      value={value}
      onChange={setValue}
      onSubmit={submitNewValue}
      {...restProps}
    >
      <HStack spacing={4}>
        <EditablePreview
          noOfLines={1}
          cursor="pointer"
          overflow="hidden"
          minW="30px"
          minH="20px"
          bgColor={value === '' ? emptyBg : 'inherit'}
        />
        <ChakraEditableInput />
        <EditableControls />
      </HStack>
    </Editable>
  )
}
