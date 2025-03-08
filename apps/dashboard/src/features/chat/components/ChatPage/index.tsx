import {
  Flex,
} from '@chakra-ui/react';
import {
  Chat,
} from '@openbot/aibot-uikit'
import { useMemo } from 'react'
import { ChatContainer } from './ChatContainer'
import { Client } from '../../client'
import '@stream-io/stream-chat-css/dist/v2/css/index.css'

export const ChatPage = () => {  
  const client = useMemo(() => new Client({
    baseURL: process.env.NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL,
  }), []); // TODO openbot-js-sdk

  return (
    <Flex h="100vh">
      <Chat client={client}>
        <ChatContainer />
      </Chat>
    </Flex>
  );
}