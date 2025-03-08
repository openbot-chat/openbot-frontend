import {
  HStack,
  Avatar,
  Text,
  Heading,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

export const ConversationPreview: React.FC = (props) => {
  const {
    active,
    channel,
    className: customClassName = '',
    displayImage,
    displayTitle,
    latestMessage,
    onSelect: customOnSelectChannel,
    setActiveChannel,
    unread,
    watchers,
  } = props;
  const onSelectChannel = (e) => {
    if (customOnSelectChannel) {
      customOnSelectChannel(e);
    } else if (setActiveChannel) {
      setActiveChannel(channel, watchers);
    }
  };

  return (
    <HStack
      spacing="2" 
      p="2" 
      w='full' 
      h='full'
      bg={active ? "rgba(0, 150, 255, 0.3)": ""}
      cursor="pointer"
      onClick={onSelectChannel}
    >
      <Avatar name={""} size="sm" />
      <Stack w="full" spacing={1}>
        <Heading size="sm">{displayTitle ?? "Unamed"}</Heading>
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="xs"></Text>
          <Text fontSize="xs">{dayjs(new Date()).fromNow()}</Text>
        </HStack>
      </Stack>
    </HStack>
  );
}
