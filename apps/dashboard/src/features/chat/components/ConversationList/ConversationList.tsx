import {
  useCallback,
  useMemo,
  useRef,
} from 'react';

import {
  Button,
  Stack,
  VStack,
  Box,
} from '@chakra-ui/react';
import { ConversationPreview } from '../ConversationPreview';
import { ChatIcon } from '@chakra-ui/icons';
import {
  InfiniteScroll,
  ChannelList,
} from '@openbot/aibot-uikit';


export const ConversationList = () => {
  // const hoverStyles = useColorModeValue({ bgColor: 'twitter.400' }, { bgColor: 'gray.800' });


  return (
    <Stack w='full' spacing={4} pt={4} h="full">
      <VStack px={4}>
        <Button colorScheme="twitter" leftIcon={<ChatIcon />} rounded="full">New Chat</Button>
      </VStack>
      <Box w='full' flex={1} overflowY="auto">
        <ChannelList Preview={ConversationPreview} Paginator={InfiniteScroll} />
      </Box>
    </Stack>
  );
}