import { ConfirmModal } from "@/components/ConfirmModal"
import { PlusIcon } from "@/components/icons"
import { InfiniteGrid } from "@/components/InfiniteGrid"
import { useToast } from "@/hooks/useToast"
import { trpc } from "@/utils/trpc-client"
import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Card, Avatar, Button, Grid, GridItem, Heading, HStack, IconButton, Stack, useDisclosure } from "@chakra-ui/react"
import { App, Connection } from "models"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { useApp } from "../../context/AppProvider"



export const AppConnections = () => {
  const { app } = useApp()
  const query = trpc.connection.list.useInfiniteQuery(
    {
      app_id: app?.id,
      size: 20,
    },
    {
      enabled: !!app?.id,
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  )

  const connections = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  )

  const handleDeleteConnection = (connection: Connection) => {
    query.refetch()
  }

  return (
    <Stack spacing={8} p={8}>
      <InfiniteGrid<Connection>
        isLoading={query.isLoading}
        items={connections}
        itemRender={(item) => (
          <Link key={item.id} href={`/apps/${app.id}/connections/${item.id}`}>
            <ConnectionItem app={app} connection={item} onDelete={handleDeleteConnection}/>
          </Link>
        )}
        hasMore={query.hasNextPage}
        loadMore={query.fetchNextPage}
        columns={[1]}
        gap={2}
        minChildWidth="100%"
      />
    </Stack>
  )
}

const ConnectionItem = ({ app, connection, onDelete }: { 
  app?: App
  connection: Connection
  onDelete: (connection: Connection) => void
}) => {
  const { showToast } = useToast()
  const scopedT = useTranslations('connection')

  const deleteAppMutation = trpc.connection.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: () => {
      onDelete(connection)
    },
  })

  return (
    <Card>
      <Grid 
        templateAreas={`"icon name options"`}
        gridTemplateColumns={'48px 1fr 148px'}
        gridTemplateRows={`1fr`}
        gap={4} 
        p={4}
      >
        <GridItem as={HStack} area={'icon'}>
          <Avatar bgColor={app.theme ?? '#0099cc'} p={2} boxSize="48px" rounded="md" name={app.name} src={app.icon} />
        </GridItem>
        <GridItem as={HStack} area={'name'}>
          <Heading size="sm">{connection.name}</Heading>
        </GridItem>
        <GridItem as={HStack} area={'options'} spacing={2}>
          <ConfirmModal
            isLoading={deleteAppMutation.isLoading}
            trigger={
              <Button isLoading={deleteAppMutation.isLoading} colorScheme="red" leftIcon={<DeleteIcon />}>{scopedT('deleteButton.label')}</Button>
            }
            confirmText={scopedT('confirmModal.confirm')}
            title={scopedT('confirmModal.title')}
            message={scopedT.rich('confirmModal.message', { 
              confirmText: (chunks) => <b>{scopedT('confirmModal.confirm')}</b>,
            })}
            onConfirm={() => deleteAppMutation.mutate(connection.id)}
          />
        </GridItem>
      </Grid>
    </Card>
  )
}