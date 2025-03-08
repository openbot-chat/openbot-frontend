import {
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  Portal,
  Stack,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@/components/icons'
import React, { ReactNode, useMemo } from 'react'


export type Option = {
  value: string | number;
  label: string | ReactNode;
}

type Props = {
  value?: string | number | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemSelect?: (key: string | number | any, item: Option) => void;
  items: Option[];
  placeholder?: string;
}

export const DropdownList = ({
  value,
  onItemSelect,
  items,
  placeholder = '',
  ...props
}: Props & MenuButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMenuItemClick = (value: string | number | any, item: Option) => () => {
    onItemSelect?.(value, item)
  }

  const currentItem = useMemo(() => items?.find(it => it.value === value), [value, items]);

  return (
    <Menu isLazy placement="bottom-end" matchWidth>
      <MenuButton
        as={Button}
        rightIcon={<ChevronLeftIcon transform={'rotate(-90deg)'} />}
        colorScheme="gray"
        justifyContent="space-between"
        textAlign="left"
      >
        <chakra.span noOfLines={1} display="block">
          {(currentItem?.label ?? placeholder ?? '')}
        </chakra.span>
      </MenuButton>
      <Portal>
        <MenuList maxW="500px" zIndex={1500}>
          <Stack maxH={'35vh'} overflowY="scroll" spacing="0">
            {items.map((item) => (
              <MenuItem
                key={item.value}
                maxW="500px"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                onClick={handleMenuItemClick(item.value, item)}
              >
                {item.label}
              </MenuItem>
            ))}
          </Stack>
        </MenuList>
      </Portal>
    </Menu>
  )
}
