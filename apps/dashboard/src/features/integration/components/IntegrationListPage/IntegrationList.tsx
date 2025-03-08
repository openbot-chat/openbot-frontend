"use client"
import React from 'react';
import {
  Integration,
} from 'models';
import { IntegrationItem } from './IntegrationItem';
import {
  Wrap,
} from '@chakra-ui/react';

export type IntegrationListProps = {
  integrations: Integration[];
  onConnect?: (integration: Integration) => void;
}

export const IntegrationList: React.FC<IntegrationListProps> = ({
  integrations,
  onConnect,
}) => {
  
  return (
    <Wrap spacing={4} p={4} w='full' h='full' overflowY="auto">
      {integrations?.map(integration => (
        <IntegrationItem key={integration.id} integration={integration} onConnect={() => onConnect?.(integration)} />
      ))}
    </Wrap>
  );
}