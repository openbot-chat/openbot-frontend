import {
  List,
  ListItem,
  Card,
  HStack,
  Image,
  Heading,
  Text,
  Link,
  VStack,
  Avatar,
} from '@chakra-ui/react';

import { Integration } from 'models';

type Props = {
  dataProviders: Integration[];
  onSelect?: (dataProvider: Integration) => void;
}

export const DataProviderList: React.FC<Props> = ({
  dataProviders,
  onSelect,
}) => {
  return (
    <List spacing={2} w='full' overflowY="auto">
      {dataProviders.map(it => (
        <ListItem key={it.identifier} as={Card} p={4} onClick={() => onSelect?.(it)}>
          <Link>
            <VStack alignItems="left">
              <HStack spacing={4}>
                <Avatar src={it.icon} size="md" name={it.name} borderRadius="8" />
                <VStack w='full' alignItems="left">
                  <Heading size="sm">{it.name}</Heading>
                  <Text fontSize="xs" color="gray.600">{it.description}</Text>
                </VStack>
              </HStack>
            </VStack>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};