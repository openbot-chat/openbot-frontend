"use client"
import {
  Flex,
  Box,
} from '@chakra-ui/react'
import { PreviewDrawer } from '@/features/preview/components/PreviewDrawer'
import { useParams } from 'next/navigation'
import { AgentProvider, useAgent } from '@/features/agent/providers/AgentProvider'


type Props = {
  children: React.ReactNode
}

function InnerLayout({
  children,
}: Props) {
  const { agent } = useAgent()

  return (
    <Flex minW="1280px" h="full">
      <Box flex={1} overflowY="auto">
        {children}
      </Box>
      {(!!agent) && <PreviewDrawer />}
    </Flex>
  )
}

export default function Layout({
  children,
}: Props) {
  const params = useParams()

  return (
    <AgentProvider agentId={params?.id as string}>
      <InnerLayout>
        {children}
      </InnerLayout>
    </AgentProvider>
  );
}