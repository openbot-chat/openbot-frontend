import { Tool } from 'models'
import {
  WrapItem,
  Stack,
  Tag,
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

type Props = {
  tool: Tool
  onClick?: () => void
}

export const ToolItem: React.FC<Props> = ({
  tool,
  onClick,
}) => {
  return (
    <WrapItem
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
      onClick={onClick}
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
      </Flex>
    </WrapItem>
  );
}