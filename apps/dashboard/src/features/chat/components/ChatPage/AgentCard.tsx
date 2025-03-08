import { Agent } from 'models';
import {
  Button,
  WrapItem,
  VStack,
  Avatar,
  Text,
  useColorModeValue,
  Heading,
  ButtonGroup,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons'


type Props = {
  agent: Agent;
  onClick?: () => void;
}

export const AgentCard: React.FC<Props> = ({
  agent,
  onClick,
}) => {
  return (
    <WrapItem
      key={agent.id} 
      alignItems="center"
      whiteSpace={'normal'}
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius={16}
      boxShadow="lg"
      _hover={useColorModeValue({ shadow: 'md', bgColor: 'gray.50' }, { bgColor: 'gray.700' })}
    >
      <VStack h='full' w='full' spacing={4} justifyContent="space-between">
        <VStack h="240px" w='full' spacing={4} pt={4}>
          <Avatar name={agent.name} src={agent.avatar?.thumbnail ?? undefined} w='108px' h='108px' />
          <Heading size="sm">{agent.name}</Heading>
          <Text 
            noOfLines={3}
            textOverflow="ecllipsis"
            overflow="hidden"
            fontWeight={500}
            fontSize="xs"
          >
            {agent.instructions}
          </Text>  
        </VStack>
        <VStack w='full'>
          <ButtonGroup>
            <Button px={8} rounded="full">Details</Button>
            <Button px={8} rounded="full" leftIcon={<ChatIcon />} colorScheme="whatsapp" onClick={onClick}>Chat</Button>
          </ButtonGroup>
        </VStack>
      </VStack>
    </WrapItem>
  );
}