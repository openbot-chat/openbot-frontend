"use client"
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { SettingsIcon } from "@chakra-ui/icons";
import { signOut } from 'next-auth/react';
import { LogOutIcon } from '../icons';

export const SettingsMenu = () => {
  return (
    <Menu>
      <MenuButton w="full" variant="ghost" as={Button} leftIcon={<SettingsIcon />} textAlign="left">
        设置
      </MenuButton>
      <MenuList>
        <a href="#" onClick={() => signOut()}>
          <MenuItem icon={<LogOutIcon/>}>
            退登
          </MenuItem>
        </a>
        <MenuItem>
          版本
        </MenuItem>
      </MenuList>
    </Menu>
  )
}