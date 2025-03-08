import { Integration, AgentTool } from 'models'
import {
  Flex,
  Button,
  Box,
  WrapItem,
  Stack,
  Tag,
  HStack,
  Avatar,
  Text,
  Heading,
  useColorModeValue,
  Card,
} from '@chakra-ui/react'
import { PlusIcon } from '@/components/icons'



type Props = {
  isLoading?: boolean
  agentTool: AgentTool
  integration: Integration
  onAdd?: () => void
}

export const IntegrationToolItem: React.FC<Props> = ({
  isLoading,
  agentTool,
  integration,
  onAdd,
}) => {
  return (
    <WrapItem
      as={Card}
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
            <Avatar name={integration.name} src={integration.icon} w='48px' h='48px' borderRadius={8} />
            <Stack>
              <Heading size="sm">{integration.name}</Heading>
              <Tag>{integration.catalog}</Tag>
            </Stack>
          </HStack>
          <Text fontSize="sm" noOfLines={2} color="gray">
            {integration.description}
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