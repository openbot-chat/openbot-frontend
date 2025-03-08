import { Integration } from 'models';
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
} from '@chakra-ui/react';

type Props = {
  integration: Integration;
  onClick?: () => void;
}

export const IntegrationItem: React.FC<Props> = ({
  integration,
  onClick,
}) => {
  return (
    <WrapItem
      key={integration.id}
      alignItems="center"
      style={{ width: '320px', height: '160px' }}
      whiteSpace={'normal'}
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderWidth={1}
      borderRadius={4}
      boxShadow="lg"
      cursor="pointer"
      _hover={useColorModeValue({ shadow: 'md', bgColor: 'gray.50' }, { bgColor: 'gray.700' })}
      onClick={onClick}
    >
      <Stack h='full' w='full' spacing={4}>
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
      </Stack>
    </WrapItem>
  );
}