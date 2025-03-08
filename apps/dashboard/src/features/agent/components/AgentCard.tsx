import { Agent } from 'models'
import {
  Flex,
  Box,
  Button,
  WrapItem,
  VStack,
  Avatar,
  Text,
  useColorModeValue,
  Heading,
  ButtonGroup,
  HStack,
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { ChatIcon } from '@chakra-ui/icons'
import { useTranslations } from 'next-intl'
import { UsersIcon } from '@/components/icons'


type Props = {
  agent: Agent
}

export const AgentCard: React.FC<Props> = ({
  agent,
}) => {
  const scopedT = useTranslations('agent.agentCard')

  return (
    <WrapItem
      key={agent.id} 
      alignItems="center"
      whiteSpace={'normal'}
      borderWidth={1}
      borderRadius={16}
      boxShadow="lg"
      transition="background-color .3s"
      bg={useColorModeValue("linear-gradient(326deg,#d6e4f9 3%,#fff 97%)", 'gray.800')}
      _hover={useColorModeValue({ shadow: 'md', bgColor: 'gray.50' }, { bgColor: 'gray.700' })}
      h="280px"
      w="208px"
      cursor="pointer"
      role="group"
      overflow="hidden"
    >
      <VStack h='full' w='full' p={4} spacing={4} position="relative">
        <Avatar name={agent.name} src={agent.avatar?.thumbnail ?? undefined} w='108px' h='108px' mt={2} />
        <Heading size="sm">{agent.name}</Heading>
        <Text 
          w="full"
          noOfLines={3}
          textOverflow="ecllipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          fontSize="xs"
        >
          {agent.description}
        </Text>
        <VStack 
          _groupHover={{
            opacity: 1,
          }}
          opacity={0}
          w='full' 
          position="absolute" 
          top="108px"
          left="50%" 
          transform="translateX(-50%)" 
          transition="all .3s ease-in-out"
        >
          <Link href={`/marketplace/agents/${agent.id}`}>
            <Button colorScheme="twitter" rounded="full" size="sm" leftIcon={<ChatIcon />}>{scopedT('chatButton.label')}</Button>
          </Link>
        </VStack>
        <Flex
          alignItems="center"
          position="absolute"
          bottom={0}
          justifyContent="space-between"
          w="full"
          h="40px"
          px={4}
          py={4}
          color="gray.500" 
          fontSize="14px"
        >
          <HStack>
            <ChatIcon fontSize="12px" /><Text>0</Text>
          </HStack>
          <HStack>
            <UsersIcon fontSize="12px" /><Text>0</Text>
          </HStack>
        </Flex>
      </VStack>
    </WrapItem>
  );
}