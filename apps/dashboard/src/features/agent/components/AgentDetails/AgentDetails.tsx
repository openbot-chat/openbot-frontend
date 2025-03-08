"use client"
import React from 'react';
import {
  Container,
  HStack,
  Stack, 
  Box,
  VStack,
} from '@chakra-ui/react';
import { Main } from './Main'
import { useParams } from 'next/navigation'
import { AgentProvider, useAgent } from '../../providers/AgentProvider'
import { AgentPreviewButton } from '../AgentPreviewButton'
import { AgentShareButton } from '../AgentShareButton'



export const AgentDetailsInner: React.FC = () => {  
  const { agent } = useAgent()

  return (
    <Container maxW="1280px" h="100vh">
      <Stack w='full' h='full' spacing={8} py={8}>
        <VStack>
          <HStack>
            {agent && <AgentPreviewButton agent={agent} />}
            {agent && <AgentShareButton agent={agent} />}
          </HStack>
        </VStack>
        <Box flex={1}>
          <Main />
        </Box>
      </Stack>
    </Container>
  )
}

export const AgentDetails = () => {
  const params = useParams()

  return (
    <AgentProvider agentId={params?.id as string}>
      <AgentDetailsInner />
    </AgentProvider>
  )
}