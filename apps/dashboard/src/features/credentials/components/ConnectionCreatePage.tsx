"use client"
import { useCallback } from 'react'
import {
  Stack,
  VStack,
} from '@chakra-ui/react'
import { trpc } from "@/utils/trpc-client"
import { useToast } from '@/hooks/useToast'
import { ConnectionEditForm } from './ConnectionEditForm'
import { useRouter } from 'next/navigation'
import { Connection } from 'models'

export const ConnectionCreatePage = () => {
  const router = useRouter()
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()
  
  const connectionCreateMutation = trpc.connection.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      showToast({ status: 'success', description: 'Create Success' });
      trpcContext.integration.list.invalidate();
      router.push('/credentials');
    },
  });

  const handleCreate = useCallback(async (connection: Partial<Connection>) => {
    await connectionCreateMutation.mutateAsync(connection)
  }, [connectionCreateMutation.mutateAsync])

  return (
    <VStack w="full" spacing={4} px={12} pt={8}>
      <Stack w="full" maxW="1024px">
        <ConnectionEditForm isLoading={connectionCreateMutation.isLoading} onSubmit={handleCreate} />
      </Stack>
    </VStack>
  )
}