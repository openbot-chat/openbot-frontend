import { PlusIcon } from "@/components/icons"
import { InfiniteGrid } from "@/components/InfiniteGrid"
import { useOrganization } from "@/features/organization/context/OrganizationProvider"
import { trpc } from "@/utils/trpc-client"
import { SettingsIcon } from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"
import { Tag, Card, Avatar, Button, Grid, GridItem, Heading, HStack, IconButton, Stack, useDisclosure } from "@chakra-ui/react"
import { App } from "models"
import { useTranslations } from "next-intl"
import { useRouter } from "@/navigation"
import { useMemo } from "react"
import { CreateAppModal } from "../CreateAppModal"



export const AppListPage = () => {
  const scopedT = useTranslations('app.list')
  const {
    onOpen: onCreateOpen,
    onClose: onCreateClose,
    isOpen: isCreateOpen,
  } = useDisclosure()
  const router = useRouter()

  const { organization } = useOrganization()
  const query = trpc.app.list.useInfiniteQuery(
    {
      org_id: organization?.id,
      size: 20,
    },
    {
      enabled: !!organization?.id,
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  )

  const apps = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  )

  const handleNewApp = (app: App) => {
    router.push(`/apps/${app.id}`)
  }

  return (
    <Stack spacing={8} p={8}>
      <CreateAppModal isOpen={isCreateOpen} onClose={onCreateClose} onNewApp={handleNewApp}/>
      <HStack w='full' justifyContent="space-between">
        <Heading>Apps</Heading>
        <Button colorScheme="twitter" leftIcon={<PlusIcon />} onClick={onCreateOpen}>{scopedT('createButton.label')}</Button>
      </HStack>

      <Stack>
        <InfiniteGrid<App>
          isLoading={query.isLoading}
          items={apps}
          itemRender={(item) => <AppItem app={item} />}
          hasMore={query.hasNextPage}
          loadMore={query.fetchNextPage}
          columns={[1]}
          gap={2}
          minChildWidth="100%"
        />
      </Stack>
    </Stack>
  )
}

const AppItem = ({ app }: { app: App }) => {
  return (
    <Link href={`/apps/${app.id}`}>
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
            <Heading size="sm">{app.name}</Heading>
          </GridItem>
          <GridItem as={HStack} area={'options'} spacing={2}>
            {app.public ? <Tag variant="solid" colorScheme="green">Public</Tag>: <Tag variant="solid" colorScheme="red">Private</Tag>}
            <IconButton aria-label="settings" icon={<SettingsIcon/>} />
          </GridItem>
        </Grid>
      </Card>
    </Link>
  )
}