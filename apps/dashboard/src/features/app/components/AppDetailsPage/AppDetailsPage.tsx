import { trpc } from "@/utils/trpc-client"
import { AddIcon, ArrowBackIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons"
import { 
  Skeleton, 
  Tag, 
  Heading, 
  IconButton, 
  HStack, 
  Stack, 
  Tab, 
  TabList, 
  Tabs, 
  Menu,
  MenuButton,
  ButtonGroup,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react"
import { OAuth2EditPage } from "./OAuth2EditPage"
import { App, Connection } from 'models'
import { Link } from "@chakra-ui/next-js"
import { useTranslations } from "next-intl"
import { EditAppModal } from "../EditAppModal"
import { AppProvider, useApp } from "../../context/AppProvider"
import { useMemo } from "react"
import { useRouter } from "@/navigation"
import { AppConnections } from "./AppConnections"
import { AppActions } from "./AppActions"
import { CreateConnectionModal } from "../CreateConnectionModal"
import { ConfirmModal } from "@/components/ConfirmModal"
import { useToast } from "@/hooks/useToast"



const tabs = ['connections', 'actions', 'webhooks']

type Props = {
  id: string
  tab: string
}

export const AppDetailsPage = (props: Props) => {
  const { id, tab } = props
  return (
    <AppProvider appId={id}>
      <AppDetailsPageInner {...props} />
    </AppProvider>
  )
}

const AppDetailsPageInner = ({
  id,
  tab,
}: Props) => {
  const router = useRouter()
  const scopedT = useTranslations('app.list')
  const tabIndex = useMemo(() => Math.max(tabs.indexOf(tab), 0), [tab])
  const onTabChange = (index: number) => {
    const tab = tabs[index]
    router.push(`/apps/${id}/${tab}`)
  }

  return (
    <Stack>
      <AppListPageHeader />
      <Stack py={8}>
        <Tabs isLazy onChange={onTabChange} index={tabIndex}>
          <TabList>
            <Tab>{scopedT('tabs.connections.label')}</Tab>
            <Tab>{scopedT('tabs.actions.label')}</Tab>
            <Tab>{scopedT('tabs.webhooks.label')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AppConnections />
            </TabPanel>
            <TabPanel>
              <AppActions />
            </TabPanel>
            <TabPanel>
              webhooks
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Stack>
  )
}

const AppListPageHeader = () => {
  const t = useTranslations()
  const scopedT = useTranslations('app.list.header')
  const router = useRouter()
  const { app, refetch } = useApp()
  const { showToast} = useToast()
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure()

  const handleEditApp = () => {
    refetch()
  }


  const {
    isOpen: isOpenCreateConnection,
    onOpen: onOpenCreateConnection,
    onClose: onCloseCreateConnection,
  } = useDisclosure()

  const handleNewConnection = (connection: Connection) => {
    router.push(`/apps/${app.id}/connections/${connection.id}`)
  }

  const deleteAppMutation = trpc.app.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      router.push('/apps')
    },
  })

  return (
    <HStack px={8} py={4} spacing={4} justifyContent="space-between">
      {app && <EditAppModal app={app} onClose={onCloseEdit} isOpen={isOpenEdit} onEditApp={handleEditApp}/>}
      {app && <CreateConnectionModal app={app} onClose={onCloseCreateConnection} isOpen={isOpenCreateConnection} onNewConnection={handleNewConnection} />}

      <Skeleton isLoaded={!!app}>
        <HStack spacing={8}>
          <Link href="/apps">
            <IconButton
              icon={<ArrowBackIcon />}
              aria-label="back"
              variant="outline"
              rounded="full"
              size="sm"
            />
          </Link>
          <HStack spacing={2}>
            <Heading>{app?.name}</Heading>
            {app?.public ? <Tag variant="solid" colorScheme="green">Public</Tag>: <Tag variant="solid" colorScheme="red">Private</Tag>}
          </HStack>
        </HStack>
      </Skeleton>
      {app && (
      <HStack spacing={2}>
        <Menu>
          <MenuButton>
            <ButtonGroup isAttached colorScheme="twitter">
              <IconButton aria-label="options" icon={<HamburgerIcon />} />
            </ButtonGroup>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<EditIcon />} onClick={onOpenEdit}>
              {scopedT('editButton.label')}
            </MenuItem>
            <ConfirmModal
              isLoading={deleteAppMutation.isLoading}
              trigger={
                <MenuItem icon={<DeleteIcon color="red" />}>
                  {scopedT('deleteButton.label')}
                </MenuItem>
              }
              onConfirm={async () => await deleteAppMutation.mutateAsync(app?.id)}
              confirmText={t('app.confirmModal.confirm')}
              title={t('app.confirmModal.title')}
              message={t.rich('app.confirmModal.message', { 
                confirmText: (chunks) => <b>{t('app.confirmModal.confirm')}</b>,
              })}
            />
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton>
            <ButtonGroup isAttached colorScheme="twitter">
              <IconButton aria-label="add" icon={<AddIcon />} />
            </ButtonGroup>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<AddIcon />} onClick={onOpenCreateConnection}>
              {scopedT('newConnectionButton.label')}
            </MenuItem>
            <MenuItem icon={<AddIcon />}>
              {scopedT('newActionButton.label')}
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>)}
    </HStack>
  )
}


