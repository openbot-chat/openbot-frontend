import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Text,
  Heading,
  Checkbox,
  Skeleton,
  Stack,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import { useToast } from '@/hooks/useToast'
import React, { useState } from 'react'
import { byId, isDefined } from '@openbot/lib'
import { ApiKey } from 'models'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs';
import { trpc } from '@/utils/trpc-client'
import { ConfirmModal } from '@/components/ConfirmModal'
import { CreateApikeyModal } from './CreateApikeyModal'



export const ApiKeyList = () => {
  const trpcContext = trpc.useContext();
  const t = useTranslations('apikeys')
  const { showToast } = useToast()
  
  const { data: apikeysData, isLoading } = trpc.apikey.list.useQuery(undefined, {
    onError: (e) => showToast({ title: 'Failed to fetch tokens', description: e.message }),
  })
  const deleteApiKeyMutation = trpc.apikey.delete.useMutation()
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const [deletingId, setDeletingId] = useState<string>()

  const refreshListWithNewApikey = (apikey: ApiKey) => {
    if (!apikeysData) return

    trpcContext.apikey.list.invalidate()
  }

  const deleteToken = async (id?: string) => {
    if (!apikeysData || !id) return
    await deleteApiKeyMutation.mutateAsync(id)

    trpcContext.apikey.list.invalidate()
  }

  return (
    <Stack spacing={4}>
      <Heading fontSize="2xl">{t('heading')}</Heading>
      <Text>{t('description')}</Text>
      <Flex justifyContent="flex-end">
        <Button onClick={onCreateOpen}>{t('createButton.label')}</Button>
        <CreateApikeyModal
          isOpen={isCreateOpen}
          onNewApikey={refreshListWithNewApikey}
          onClose={onCreateClose}
        />
      </Flex>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('table.nameHeader')}</Th>
              <Th w="130px">{t('table.createdHeader')}</Th>
              <Th w="0" />
            </Tr>
          </Thead>
          <Tbody>
            {apikeysData?.items?.map((apikey) => (
              <Tr key={apikey.id}>
                <Td>{apikey.name}</Td>
                <Td>{dayjs(apikey.created_at).fromNow()}</Td>
                <Td>
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => setDeletingId(apikey.id)}
                  >
                    {t('deleteButton.label')}
                  </Button>
                </Td>
              </Tr>
            ))}
            {isLoading &&
              Array.from({ length: 3 }).map((_, idx) => (
                <Tr key={idx}>
                  <Td>
                    <Checkbox isDisabled />
                  </Td>
                  <Td>
                    <Skeleton h="5px" />
                  </Td>
                  <Td>
                    <Skeleton h="5px" />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ConfirmModal
        isLoading={deleteApiKeyMutation.isLoading}
        isOpen={isDefined(deletingId)}
        onConfirm={() => deleteToken(deletingId)}
        onClose={() => setDeletingId(undefined)}
        message={
          <Text>
            {t.rich('deleteConfirmationMessage', {
              tokenName: (chunks) => <strong>{apikeysData?.items?.find(byId(deletingId))?.name}</strong>
            })}
          </Text>
        }
        confirmButtonLabel={t('deleteButton.label')}
      />
    </Stack>
  )
}
