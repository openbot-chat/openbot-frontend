import {
  Chat,
} from '@openbot/aibot-uikit'
import { useMemo } from 'react'
import { ConversationListContainer } from "./ConversationListContainer"
import { Client } from '@/features/chat/client'


export const ConversationBlock = () => {
  const client = useMemo(() => new Client({
    baseURL: process.env.NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL,
  }), []) // TODO openbot-js-sdk

  return (
    <Chat client={client}>
      <ConversationListContainer />
    </Chat>
  );
}