"use client"
import { useCallback, useMemo } from 'react'
import {
  Stack,
  VStack,
} from '@chakra-ui/react'
import { trpc } from "@/utils/trpc-client"
import { useToast } from '@/hooks/useToast'
import { useParams } from 'next/navigation'
import { ConnectionEditForm } from './ConnectionEditForm'
import { Connection } from 'models'
import { useRouter } from 'next/navigation'


export const ConnectionEditPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()

  const query = trpc.connection.details.useQuery(id)
  const formData = useMemo(() => {
    if (query.data && query.data.options) {
      const options = JSON.stringify(query.data.options, '\t', 4)
      return {...query.data, options }
    }
    return query.data
  }, [query.data])

  const connectionUpdateMutation = trpc.connection.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      showToast({ status: 'success', description: 'Save Success' })
      trpcContext.connection.list.invalidate()
      router.push('/credentials')
    },
  })

  const handleEdit = useCallback(async (connection: Partial<Connection>) => {
    const data = { ...connection, id };
    await connectionUpdateMutation.mutateAsync(data)
  }, [connectionUpdateMutation.mutateAsync, id])

  return (
    <VStack w="full" spacing={4} px={12} pt={8}>
      <Stack w="full" maxW="1024px">
        {formData && <ConnectionEditForm isLoading={query.isLoading} formData={formData} onSubmit={handleEdit} />}
      </Stack>
    </VStack>
  )
}