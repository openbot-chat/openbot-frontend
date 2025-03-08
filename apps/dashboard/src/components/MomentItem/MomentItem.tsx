import React from 'react';
import {
  HStack,
  VStack,
  Avatar,
  Text,
  Card,
} from '@chakra-ui/react';
import { Moment } from 'types/global';

export type MomentItemProps = {
  moment: Moment;
}

export const MomentItem: React.FC<MomentItemProps> = ({ moment }) => {
  return (
    <HStack w='full'>
      <Avatar src={moment.avatar} />
      <Card p='4' flex='1'>
        <VStack w='full' alignItems="flex-start">
          <Text>{moment.text}</Text>
          <HStack w='full' fontSize="12px"><Text alignItems="flex-end">{moment.createdAt?.toString()}</Text></HStack>
        </VStack>
      </Card>
    </HStack>
  );
} 