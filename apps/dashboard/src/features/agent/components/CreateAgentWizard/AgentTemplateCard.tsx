import {
  Text,
  Avatar,
  Heading,
  Button,
  useColorModeValue,
  VStack,
  HStack,
} from '@chakra-ui/react';
import {
  Agent,
} from 'models';

type Props = {
  agent: Agent;
  onPreview?: () => void;
  onSelect?: () => void;
}

export const AgentTemplateCard: React.FC<Props> = ({
  agent,
  onPreview,
  onSelect,
}) => {  
  return (
    <VStack
      width="400px"
      height="300px"
      boxShadow="lg"
      p={4}
      spacing={4}
      borderWidth={1}
      borderRadius={16}
      bg={useColorModeValue('white', 'gray.800')}
      justifyContent="space-between"
      _hover={useColorModeValue({ shadow: 'md', bgColor: 'gray.50' }, { bgColor: 'gray.700' })}
    >
      <VStack spacing={4} overflow="hidden" pt={4}>
        <Avatar src={agent.avatar?.thumbnail} width="64px" height="64px" />
        <Heading size="md">
          {agent.name}
        </Heading>
        <Text>{agent.instructions}</Text>
      </VStack>
      <HStack spacing={4}>
        <Button onClick={onPreview}>Preview</Button>
        <Button colorScheme="whatsapp" onClick={onSelect}>Select</Button>
      </HStack>
    </VStack>
  );
}