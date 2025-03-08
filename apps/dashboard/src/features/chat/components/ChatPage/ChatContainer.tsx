import { trpc } from '@/utils/trpc-client'
import { Box, Divider, useColorModeValue, Stack } from '@chakra-ui/react'
import {
  Channel,
  Window,
  VirtualizedMessageList,
  MessageInput,
  useChatContext,
} from '@openbot/aibot-uikit'
import { ConversationList } from '../ConversationList'
import { AgentList } from './AgentList'
import { useToast } from '@/hooks/useToast'
import { Agent } from 'models'



export const ChatContainer = () => {
  const trpcContext = trpc.useContext();
  const { showToast } = useToast();
  const {
    channel,
    setActiveChannel,
  } = useChatContext();

  const createConversationMutation = trpc.conversation.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.conversation.list.invalidate();
    },
  });

  const handleNewChat = async (agent: Agent) => {
    const conversation = await createConversationMutation.mutateAsync({
      agent_id: agent.id,
    });

    // TODO 创建新的 Conversation
    /*
    const conversation = client.channel('messaging', {
      members: [...selectedUsersIds, client.userID],
    });

    conversation.watch();

    setActiveChannel?.(conversation);
    */

    // TODO 设置新的 Conversation

    setActiveChannel(conversation)
  }

  return (
    <Stack h="full">
      <Box 
        w="240px"
        bg={useColorModeValue('white', 'gray.800')}
      >
        <ConversationList />
      </Box>
      <Divider orientation="vertical" />
      {/* <Box h="full" overflowY="auto" flex={1}></Box> */}  
      <Box flex={1} overflowY="auto">
        {channel ? (
          <Channel
            dragAndDropWindow={false}
            skipMessageDataMemoization
            EmptyStateIndicator={() => null}
          >
            <Window>
              <VirtualizedMessageList />
              <MessageInput focus grow useMentionsTransliteration={false} />
            </Window>
          </Channel>
        ) : (
          <AgentList onChat={handleNewChat}/>
        )}
      </Box>
    </Stack>
  )
}