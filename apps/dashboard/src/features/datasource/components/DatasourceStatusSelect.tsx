import { useMemo, useEffect, useState } from 'react';
import {
  Box,
  Button, 
  Circle, 
  Text,
  Menu, 
  MenuButton, 
  MenuOptionGroup, 
  MenuItemOption, 
  MenuList, 
  Portal, 
  HStack, 
  Stack, 
  useColorModeValue,
} from "@chakra-ui/react";
import { DatasourceStatus } from 'models';
import { ChevronDownIcon } from '@chakra-ui/icons';


const statusColorMap = {
  [DatasourceStatus.pending]: 'gray',
  [DatasourceStatus.synced]: 'twitter.500',
  [DatasourceStatus.unsynced]: 'gray',
  [DatasourceStatus.running]: 'whatsapp.500',
  [DatasourceStatus.error]: 'red',
}

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const DatasourceStatusSelect = ({
  value,
  onChange,
}: Props) => {
  const options = useMemo(() => [
    { label: 'Pending', value: DatasourceStatus.pending },
    { label: 'Synced', value: DatasourceStatus.synced },
    { label: 'Running', value: DatasourceStatus.running },
    { label: 'Error', value: DatasourceStatus.error },
    { label: 'Unsynced', value: DatasourceStatus.unsynced },
  ], [])

  const handleChange = (v: string[]) => {
    onChange?.(v);
  }

  const badgeBg = useColorModeValue('white', 'gray.800');

  return (
    <Menu>
      <MenuButton 
        as={Button} variant='outline' rightIcon={<ChevronDownIcon />}
        leftIcon={
          <HStack spacing={-1}>
            {options.map((it, i) => (
              <Circle 
                key={it.value} 
                bg={(!value || value.indexOf(it.value) !== -1) ? statusColorMap[it.value] : 'gray.50'} 
                size="12px" 
                border="1px solid" 
                borderColor={badgeBg}
              />
            ))}
          </HStack>
        }
        fontSize="sm"
      >
        <HStack>
          <Text>Status</Text>
          <Box px="4px" py="2px" fontSize="xs" rounded="md" borderWidth={1} borderColor="gray">{value ? value.length : 0}/{options.length}</Box>
        </HStack>
      </MenuButton>
      <Portal>
        <MenuList zIndex={1500}>
          <Stack maxH={'35vh'} overflowY="scroll" spacing="0">
            <MenuOptionGroup type='checkbox' value={value} onChange={handleChange}>
              {options.map(it => (
                <MenuItemOption
                  key={it.value}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  value={it.value}
                >
                  <HStack spacing={4}>
                    <Circle
                      key={it.value} 
                      bg={statusColorMap[it.value]} 
                      size="12px" 
                      border="1px solid" 
                      borderColor={badgeBg}
                    />
                    <Text>{it.label}</Text>
                  </HStack>  
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </Stack>
        </MenuList>
      </Portal>
    </Menu>
  );
}