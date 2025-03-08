import { Tool, AgentTool } from 'models'
import {
  WrapItem,
  Stack,
  HStack,
  Avatar,
  Text,
  Heading,
  useColorModeValue,
  Card,
  Flex,
  Box,
  Button,
} from '@chakra-ui/react'
import { PlusIcon } from '@/components/icons'

type Props = {
  isLoading?: boolean
  agentTool: AgentTool
  tool: Tool
  onAdd?: () => void
}

export const ToolItem: React.FC<Props> = ({
  isLoading,
  tool,
  agentTool,
  onAdd,
}) => {
  return (
    <WrapItem
      key={tool.id}
      as={Card}
      variant="outline"
      alignItems="center"
      style={{ width: '320px', height: '180px' }}
      whiteSpace={'normal'}
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius={4}
      cursor="pointer"
      _hover={useColorModeValue({ shadow: 'lg' }, { bgColor: 'gray.700' })}
    >
      <Flex h='full' w='full' justifyContent="space-between" direction="column">
        <Stack w='full' spacing={4}>
          <HStack spacing={4}>
            <Avatar name={tool.name} src={tool.icon} w='48px' h='48px' borderRadius={8} />
            <Stack>
              <Heading size="sm">{tool.name}</Heading>
            </Stack>
          </HStack>
          <Text fontSize="sm" noOfLines={2} color="gray">
            {tool.description}
          </Text>
        </Stack>
        <Flex>
          <Box flexGrow={1} />
          {agentTool ? (
            <Button size="sm" leftIcon={<PlusIcon />} isDisabled={true}>Added</Button>
          ): (
            <Button size="sm" colorScheme="twitter" leftIcon={<PlusIcon />} onClick={onAdd} isLoading={isLoading}>Add</Button>  
          )}
        </Flex>
      </Flex>
    </WrapItem>
  );
}