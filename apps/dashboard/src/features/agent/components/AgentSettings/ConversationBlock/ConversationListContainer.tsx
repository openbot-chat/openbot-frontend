import { useAgent } from "@/features/agent/providers/AgentProvider";
import { trpc } from "@/utils/trpc-client";
import { TagLeftIcon, TagLabel, Box, Divider, Flex, HStack, Stack, Tag, useColorModeValue } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  useChatContext,
  VirtualizedMessageList,
  Channel as UIChannel,
  Window,
} from '@openbot/aibot-uikit';

import type { Channel } from '@openbot/aibot-uikit/dist/types';


import '@stream-io/stream-chat-css/dist/v2/css/index.css'
import { ConversationList } from "./ConversationList";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import { Conversation } from 'models';



export const ConversationListContainer = () => {
  const { agent } = useAgent();
  const [provider, setProvider] = useState<string | undefined>();

  const { client, channel, setActiveChannel } = useChatContext();

  const query = trpc.conversation.list.useInfiniteQuery(
    {
      agent_id: agent?.id,
      ...({ provider }),  
      size: 20,
    },
    {
      enabled: !!agent,
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  );

  const conversations = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  );

  const messagesQuery = trpc.conversation.queryMessages.useInfiniteQuery(
    {
      conversation_id: channel?.id,
      size: 20,
    },
    {
      enabled: !!channel,
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  );

  const messages = useMemo(
    () => messagesQuery.data?.pages.flatMap((d) => d.items) ?? [],
    [messagesQuery.data]
  );
  console.log('didi channel: ', channel);
  console.log('didi query: ', messages);

  const handleSelectConversation = (conversation: Conversation) => {
    // TODO 为何构造不了
    // const channel = new Channel(client, 'messaging', conversation.id, conversation);
    const channel = {
      type: 'messaging',
      cid: `messaging:${conversation.id}`,
      id: conversation.id,
      getConfig: async() => ({}),
      watch: async () => { return },
      off: () => { return },
      on: () => { return },
      countUnread: () => 0,
      state: {
        members: [],
        messages: [],
        pinnedMessages: [],
        read: {},
        watchers: [],
        threadMessages: [],
        latestMessages: [],
        threads: [],
        membership: {},
      },
    }
    
    setActiveChannel(channel);
  }

  // TODO 查询目前开通的 provider
  const providers = useMemo(() => [
    {
      name: 'Dashboard',
      identifier: 'dashboard',
    },
    {
      name: 'Telegram',
      identifier: 'telegram',
      icon: FaTelegram,
    },
    {
      name: 'Whatsapp',
      identifier: 'whatsapp',
      icon: FaWhatsapp,
    },
    {
      name: 'Messenger',
      identifier: 'messenger',
    },
    {
      name: 'Wechat',
      identifier: 'wechat',
      icon: FaWhatsapp,
    },
    {
      name: 'Wework',
      identifier: 'wework',
    },
    {
      name: 'Dingtalk',
      identifier: 'dingtalk',
    }
  ], []);

  return (
    <Stack h="full">
      <HStack spacing={2}>
        {providers.map(it => (
          <Tag 
            key={it.identifier}
            cursor="pointer"
            variant="none"
            onClick={() => setProvider(it.identifier)}
            bg={it.identifier === provider ? 'twitter.500' : undefined}
          >
            <TagLeftIcon boxSize='12px' as={it.icon} />
            <TagLabel>{it.name}</TagLabel>
          </Tag>
        ))}
      </HStack>
      <Flex flex={1} h="full">
        <Box w="240px" h="full" overflowY="auto" bg={useColorModeValue('white', 'gray.800')}>
          <ConversationList activeConversation={channel} conversations={conversations} onSelect={handleSelectConversation} hasMore={query.hasNextPage} loadMore={query.fetchNextPage} />
        </Box>
        <Divider orientation="vertical" />
        <Box flex={1} h="full">
          <UIChannel
            dragAndDropWindow={false}
            skipMessageDataMemoization
            EmptyStateIndicator={() => null}
          >
            <Window>
              <VirtualizedMessageList messages={messages} />
            </Window>
          </UIChannel>
        </Box>
      </Flex>
    </Stack>
  );
}