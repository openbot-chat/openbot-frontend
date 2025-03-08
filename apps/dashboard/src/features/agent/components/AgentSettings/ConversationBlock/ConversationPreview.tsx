import {
  HStack,
  Avatar,
  Text,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { Conversation } from 'models';
import dayjs from 'dayjs';

type ConversationPreviewProps = {
  active?: boolean;
  conversation: Conversation;
  onSelect?: (conversation: Conversation) => void;
}

export const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  active,
  conversation,
  onSelect,
}) => {
  return (
    <HStack
      spacing="2" 
      p="2" 
      w='full' 
      h='full'
      bg={active ? "rgba(0, 150, 255, 0.3)": ""}
      cursor="pointer"
      onClick={() => onSelect?.(conversation)}
    >
      <Avatar name={""} size="sm" />
      <Stack w="full" spacing={1}>
        <Heading size="sm">{conversation.name ?? "Unamed"}</Heading>
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="xs"></Text>
          <Text fontSize="xs">{dayjs(conversation.created_at).fromNow()}</Text>
        </HStack>
      </Stack>
    </HStack>
  );
}
