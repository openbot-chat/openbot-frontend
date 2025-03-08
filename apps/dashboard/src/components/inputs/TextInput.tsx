import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input as ChakraInput,
  InputProps,
} from '@chakra-ui/react'
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { MoreInfoTooltip } from '../MoreInfoTooltip'

export type TextInputProps = {
  defaultValue?: string
  onChange?: (value: string) => void
  debounceTimeout?: number
  label?: ReactNode
  helperText?: ReactNode
  moreInfoTooltip?: string
  withVariableButton?: boolean
  isRequired?: boolean
  placeholder?: string
  isDisabled?: boolean
} & Pick<
  InputProps,
  'autoComplete' | 'onFocus' | 'onKeyUp' | 'type' | 'autoFocus' | 'name'
>

export const TextInput = forwardRef(function TextInput(
  {
    type,
    defaultValue,
    debounceTimeout = 1000,
    label,
    helperText,
    moreInfoTooltip,
    isRequired,
    placeholder,
    autoComplete,
    isDisabled,
    autoFocus,
    onChange: _onChange,
    onFocus,
    onKeyUp,
    ...restProps
  }: TextInputProps,
  ref
) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  useImperativeHandle(ref, () => inputRef.current)
  const [isTouched, setIsTouched] = useState(false)
  const [localValue, setLocalValue] = useState<string>(defaultValue ?? '')
  const [carretPosition, setCarretPosition] = useState<number>(
    localValue.length ?? 0
  )

  const onChange = useDebouncedCallback(
    (e) => _onChange?.(e),
    debounceTimeout ?? 300,
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

  const updateCarretPosition = (e: React.FocusEvent<HTMLInputElement>) => {
    const carretPosition = e.target.selectionStart
    if (!carretPosition) return
    setCarretPosition(carretPosition)
  }

  const Input = (
    <ChakraInput
      type={type}
      ref={inputRef}
      value={localValue}
      autoComplete={autoComplete}
      placeholder={placeholder}
      isDisabled={isDisabled}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onKeyUp={onKeyUp}
      onBlur={updateCarretPosition}
      onChange={(e) => changeValue(e.target.value)}
      {...restProps}
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
      {Input}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
})
