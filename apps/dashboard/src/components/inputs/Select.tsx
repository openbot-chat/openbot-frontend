import {
  useDisclosure,
  Flex,
  Popover,
  Input,
  PopoverContent,
  Button,
  useColorModeValue,
  PopoverAnchor,
  Avatar,
  Portal,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { ChevronDownIcon, CloseIcon } from '../icons'
import { useParentModal } from '@/features/graph/providers/ParentModalProvider'

const dropdownCloseAnimationDuration = 300

type Item =
  | string
  | {
      icon?: JSX.Element | string
      label: string
      value: string
      extras?: Record<string, unknown>
    }

type Props<T extends Item> = {
  isPopoverMatchingInputWidth?: boolean
  selectedItem?: string
  items: readonly T[]
  placeholder?: string
  onSelect?: (value: string | undefined, item?: T) => void
  suffix?: React.ReactNode
  clearable?: boolean
}

export const Select = <T extends Item>({
  isPopoverMatchingInputWidth = true,
  selectedItem,
  placeholder,
  items = [],
  onSelect,
  suffix,
  clearable = true,
}: Props<T>) => {
  const focusedItemBgColor = useColorModeValue('gray.200', 'gray.700')
  const selectedItemBgColor = useColorModeValue('blue.50', 'blue.400')
  const [isTouched, setIsTouched] = useState(false)
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [inputValue, setInputValue] = useState(
    getItemLabel(
      items.find((item) =>
        typeof item === 'string'
          ? selectedItem === item
          : selectedItem === item.value
      )
    )
  )

  useEffect(() => {
    console.warn('selectedItem changed', placeholder, selectedItem);
    setInputValue(
      getItemLabel(
        items.find((item) =>
          typeof item === 'string'
            ? selectedItem === item
            : selectedItem === item.value
        )
      )
    );
  }, [selectedItem, items, placeholder]);


  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState<
    number | undefined
  >()
  const dropdownRef = useRef(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { ref: parentModalRef } = useParentModal()

  const filteredItems = (
    isTouched
      ? [
          ...items.filter((item) =>
            getItemLabel(item)
              .toLowerCase()
              .includes((inputValue ?? '').toLowerCase())
          ),
        ]
      : items
  ).slice(0, 50)

  const closeDropdown = () => {
    onClose()
    setTimeout(() => {
      setIsTouched(false)
    }, dropdownCloseAnimationDuration)
  }

  useOutsideClick({
    ref: dropdownRef,
    handler: closeDropdown,
    isEnabled: isOpen,
  })

  const updateInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isOpen) onOpen()
    if (!isTouched) setIsTouched(true)
    setInputValue(e.target.value)
  }

  const handleItemClick = (item: T) => () => {
    if (!isTouched) setIsTouched(true)
    setInputValue(getItemLabel(item))
    onSelect?.(getItemValue(item), item)
    setKeyboardFocusIndex(undefined)
    closeDropdown()
  }

  const updateFocusedDropdownItem = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' && !!keyboardFocusIndex) {
      e.preventDefault()
      handleItemClick(filteredItems[keyboardFocusIndex])()
      return setKeyboardFocusIndex(undefined)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (keyboardFocusIndex === undefined) return setKeyboardFocusIndex(0)
      if (keyboardFocusIndex === filteredItems.length - 1)
        return setKeyboardFocusIndex(0)
      itemsRef.current[keyboardFocusIndex + 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
      return setKeyboardFocusIndex(keyboardFocusIndex + 1)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (keyboardFocusIndex === 0 || keyboardFocusIndex === undefined)
        return setKeyboardFocusIndex(filteredItems.length - 1)
      itemsRef.current[keyboardFocusIndex - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
      setKeyboardFocusIndex(keyboardFocusIndex - 1)
    }
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    setInputValue('')
    onSelect?.(undefined)
    setKeyboardFocusIndex(undefined)
    closeDropdown()
  }

  return (
    <Flex ref={dropdownRef} w="full">
      <Popover
        isOpen={isOpen}
        initialFocusRef={inputRef}
        matchWidth={isPopoverMatchingInputWidth}
        placement="bottom-start"
        offset={[0, 1]}
        isLazy
      >
        <PopoverAnchor>
          <InputGroup>
            <Box
              pos="absolute"
              pb={2}
              // We need absolute positioning the overlay match the underlying input
              pt="8px"
              pl="17px"
              pr={selectedItem ? 16 : 8}
              w="full"
            >
              {!isTouched && (
                <Text noOfLines={1} data-testid="selected-item-label">
                  {inputValue}
                </Text>
              )}
            </Box>
            <Input
              type="text"
              autoComplete="off"
              ref={inputRef}
              className="select-input"
              value={isTouched ? inputValue : ''}
              placeholder={
                !isTouched && inputValue !== '' ? undefined : placeholder
              }
              onChange={updateInputValue}
              onFocus={onOpen}
              onKeyDown={updateFocusedDropdownItem}
              pr={selectedItem ? 16 : undefined}
            />

            <InputRightElement
              width={selectedItem && isOpen ? '5rem' : undefined}
              pointerEvents="none"
            >
              <HStack>
                {selectedItem && isOpen && clearable && (
                  <IconButton
                    onClick={clearSelection}
                    icon={<CloseIcon />}
                    aria-label={'Clear'}
                    size="sm"
                    variant="ghost"
                    pointerEvents="all"
                  />
                )}
                <ChevronDownIcon />
              </HStack>
            </InputRightElement>
          </InputGroup>
        </PopoverAnchor>
        <Portal containerRef={parentModalRef}>
          <PopoverContent
            maxH="35vh"
            overflowY="scroll"
            role="menu"
            w="inherit"
            shadow="lg"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {filteredItems.length > 0 && (
              <>
                {filteredItems.map((item, idx) => {
                  return (
                    <Button
                      minH="40px"
                      ref={(el) => (itemsRef.current[idx] = el)}
                      key={idx}
                      onClick={handleItemClick(item)}
                      fontSize="16px"
                      fontWeight="normal"
                      rounded="none"
                      colorScheme="gray"
                      role="menuitem"
                      variant="ghost"
                      bg={
                        keyboardFocusIndex === idx
                          ? focusedItemBgColor
                          : selectedItem === getItemValue(item)
                          ? selectedItemBgColor
                          : 'transparent'
                      }
                      justifyContent="flex-start"
                      transition="none"
                      leftIcon={getItemIcon(item)}
                    >
                      {getItemLabel(item)}
                    </Button>
                  )
                })}
              </>
            )}
            <Box w='full' onClick={() => closeDropdown()}>
              {suffix}
            </Box>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  )
}

const getItemIcon = (item?: Item) => {
  if (!item) return undefined
  if (typeof item !== 'object') return undefined
  return (!item.icon || typeof item.icon === 'string') ? <Avatar w="32px" h="32px" name={item.label} src={item.icon} /> : item.icon
}

const getItemLabel = (item?: Item) => {
  if (!item) return ''
  if (typeof item === 'object') return item.label
  return item
}

const getItemValue = (item: Item) => {
  if (typeof item === 'object') return item.value
  return item
}
