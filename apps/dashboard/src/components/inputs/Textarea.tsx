import {
  FormControl,
  FormLabel,
  Textarea as ChakraTextarea,
  TextareaProps,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { MoreInfoTooltip } from '../MoreInfoTooltip'

type Props = {
  id?: string
  defaultValue?: string
  debounceTimeout?: number
  label?: string
  moreInfoTooltip?: string
  isRequired?: boolean
  placeholder?: string
  onChange: (value: string) => void
} & TextareaProps;

export const Textarea = ({
  id,
  defaultValue,
  onChange: _onChange,
  debounceTimeout = 1000,
  label,
  moreInfoTooltip,
  placeholder,
  isRequired,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const [isTouched, setIsTouched] = useState(false)
  const [localValue, setLocalValue] = useState<string>(defaultValue ?? '')
  const [carretPosition, setCarretPosition] = useState<number>(
    localValue.length ?? 0
  )

  const onChange = useDebouncedCallback(
    (e) => _onChange?.(e),
    debounceTimeout
  )

  useEffect(() => {
    if (isTouched || localValue !== '' || !defaultValue || defaultValue === '')
      return
    setLocalValue(defaultValue ?? '')
  }, [defaultValue, isTouched, localValue])

  useEffect(
    () => () => {
      onChange.flush()
    },
    [onChange]
  )

  const changeValue = (value: string) => {
    if (!isTouched) setIsTouched(true)
    setLocalValue(value)
    onChange(value)
  }

  const updateCarretPosition = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const carretPosition = e.target.selectionStart
    if (!carretPosition) return
    setCarretPosition(carretPosition)
  }

  const Textarea = (
    <ChakraTextarea
      ref={inputRef}
      id={id}
      value={localValue}
      onBlur={updateCarretPosition}
      onChange={(e) => changeValue(e.target.value)}
      placeholder={placeholder}
      {...rest}
    />
  )

  return (
    <FormControl isRequired={isRequired}>
      {label && (
        <FormLabel>
          {label}{' '}
          {moreInfoTooltip && (
            <MoreInfoTooltip>{moreInfoTooltip}</MoreInfoTooltip>
          )}
        </FormLabel>
      )}
      {Textarea}
    </FormControl>
  )
}
