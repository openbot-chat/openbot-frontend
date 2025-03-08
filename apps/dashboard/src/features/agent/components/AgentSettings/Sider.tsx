"use client"
import {
  VStack,
  Avatar,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';

import {
  PlusIcon,
} from '@/components/icons';

export function Sider({
  agent,
}) {
  return (
    <VStack p='8' h='full'>
      <Avatar src={agent?.avatar} width="108" height="108" borderRadius={16} />
      <Heading size="sm">{agent?.name}</Heading>
      <Text size="sm">全网粉丝: 20.1k</Text>
      <Text size="12px">模型/版本: GPT-4</Text>

      <VStack spacing='4'>
        <Button w='180px' colorScheme='twitter' leftIcon={<PlusIcon/>}>Twitter联系我</Button>
        <Button w='180px' colorScheme='facebook' leftIcon={<PlusIcon/>}>Facebook联系我</Button>
        <Button w='180px' colorScheme='green' leftIcon={<PlusIcon/>}>微信联系我</Button>
        <Button w='180px' colorScheme='green' leftIcon={<PlusIcon/>}>Discord联系我</Button>
        <Button w='180px' colorScheme='blue' leftIcon={<PlusIcon/>}>Telegram联系我</Button>
        <Button w='180px' colorScheme='green' leftIcon={<PlusIcon/>}>在马里奥游戏联系我</Button>
      </VStack>
    </VStack>
  );
}