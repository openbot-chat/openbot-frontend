import React from 'react';
import {
  VStack,
} from '@chakra-ui/react';
import {
  MomentItem
} from '@/components/MomentItem';
import { Moment } from 'types/global';


export type MomentListProps = {
  moments: Moment[];
}

export const MomentList: React.FC<MomentListProps> = ({ moments }) => {
  return (
    <VStack w='full' alignItems="flex-start" p='4'>
      {moments?.map(moment => (
        <MomentItem key={moment.id} moment={moment}/>
      ))}
    </VStack>
  );
}