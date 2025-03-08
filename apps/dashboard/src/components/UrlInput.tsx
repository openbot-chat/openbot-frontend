import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Stack,
} from '@chakra-ui/react'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react'

export type UrlInputProps = {
  defaultMethod?: string
  method?: string  
  url?: string
  onChangeMethod?: (value: string) => void
  onChangeUrl?: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
} & Pick<
  InputProps,
  'autoComplete' | 'onFocus' | 'onKeyUp' | 'type' | 'autoFocus' | 'name'
>

export const UrlInput = forwardRef(function TextInput(
  {
    type,
    defaultMethod = 'GET',
    method,
    url,
    placeholder,
    autoFocus,
    onChangeUrl,
    onChangeMethod,
    onFocus,
    onKeyUp,
    autoComplete,
    isDisabled,
    ...restProps
  }: UrlInputProps,
  ref
) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  useImperativeHandle(ref, () => inputRef.current)
  const [isTouched, setIsTouched] = useState(false)

  const [localUrl, setLocalUrl] = useState<string>(url ?? '')
  useEffect(() => {
    if (isTouched || localUrl !== '' || !url || url === '') return

    setLocalUrl(url ?? '')
  }, [url, isTouched, localUrl])

  const [localMethod, setLocalMethod] = useState<string>(method ?? defaultMethod)
  useEffect(() => {
    if (isTouched || localMethod !== '' || !localMethod || localMethod === '') return

    setLocalMethod(method ?? '')
  }, [method, isTouched, localMethod])


  const changeUrl = (value: string) => {
    if (!isTouched) setIsTouched(true)
    setLocalUrl(value)
    onChangeUrl?.(value)
  }

  const changeMethod = (value: string) => {
    if (!isTouched) setIsTouched(true)

    setLocalMethod(value)
    onChangeMethod?.(value)
  }

  return (
    <InputGroup p="0">
      <InputLeftAddon>
        <MethodSelect
          defaultValue={defaultMethod}
          value={localMethod} 
          onChange={changeMethod}
        />
      </InputLeftAddon>
      <Input
        type={type}
        ref={inputRef}
        value={localUrl}
        autoComplete={autoComplete}
        placeholder={placeholder}
        isDisabled={isDisabled}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
        onChange={(e) => changeUrl(e.target.value)}
        {...restProps}
      />
    </InputGroup>
  )
})


type MethodSelectProps = {
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
}

const options = [
  {
    label: 'GET',
    value: 'GET',
  },
  {
    label: 'PUT',
    value: 'PUT',
  },
  {
    label: 'POST',
    value: 'POST',
  },
  {
    label: 'PATCH',
    value: 'PATCH',
  },
  {
    label: 'DELETE',
    value: 'DELETE',
  },
  {
    label: 'HEAD',
    value: 'HEAD',
  }
]

const MethodSelect = ({
  defaultValue = "GET",
  value,
  onChange,
}: MethodSelectProps) => {
  
  const handleChange = (v: string) => {
    onChange?.(v)
  }

  const currentItem = useMemo(() => {
    const v = value ?? defaultValue
    return options.find(it => it.value === v)
  }, [defaultValue, value])

  return (
    <Menu>
      <MenuButton cursor="pointer">
        <HStack fontWeight={500}>
          <Text size="sm">{currentItem?.label}</Text>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList zIndex={1500}>
          <Stack>
            {options.map((it, i) => (
              <MenuItem 
                key={i}
                onClick={() => handleChange(it.value)}
              >
                {it.label}
              </MenuItem>
            ))}
          </Stack>
        </MenuList>
      </Portal>
    </Menu>
  )
}