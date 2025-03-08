import { useRef, useMemo } from 'react';
import {
  Stack,
  HStack,
  Modal,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  List,
  Text,
  ListItem,
  Heading,
} from '@chakra-ui/react'
import { Integration, Tool, AgentTool } from 'models'
import { trpc } from "@/utils/trpc-client"
import { InfiniteGrid } from '@/components/InfiniteGrid'
import { ToolItem } from './ToolItem'
import { IntegrationToolItem } from './IntegrationToolItem'
import $keyby from 'lodash.keyby'
import { FiTool } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'



type Props = {
  isLoading?: boolean
  added: AgentTool[]
  isOpen: boolean
  onClose: () => void
  onSelect: (tool: Tool) => void
}

export const SelectToolModal: React.FC<Props> = ({
  isLoading,
  added,
  isOpen,
  onClose,
  onSelect,
}) => {
  const trpcContext = trpc.useContext();
  
  const handleSelectIntegration = async (integration: Integration) => {
    const integration_details = await trpcContext.integration.details.fetch(integration.id);
    if (!integration_details) return;

    const tool = integration_details.options.tool
    if (!tool) return;
    
    onSelect?.(tool)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
      size="6xl"
      colorScheme="twitter"
      autoFocus={false}
    >
      <ModalOverlay />
      <ModalContent>
        <Tabs w='full' h='full' isLazy display="flex" flexDirection="column" overflow="hidden">
          <ModalHeader as={HStack} spacing={16}>
            <HStack spacing={2}>
              <FiTool />
              <Text>Add Tool</Text>
            </HStack>
            <TabList>
              <Tab>Tool Market</Tab>
              <Tab>Custom</Tab>
            </TabList>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <TabPanels>
              <TabPanel h="calc(100vh - 210px)" p={0}>
                <IntegrationPanel isLoading={isLoading} added={added} onSelect={handleSelectIntegration} />
              </TabPanel>
              <TabPanel h="calc(100vh - 210px)" p={0}>
                <ToolPanel isLoading={isLoading} added={added} onSelect={onSelect} />
              </TabPanel>
            </TabPanels>
          </ModalBody>
        </Tabs>
      </ModalContent>
    </Modal>
  );
}




type IntegrationPanelProps = {
  isLoading?: boolean
  added: AgentTool[]
  onSelect?: (item: Integration) => void
}

const IntegrationPanel = ({
  isLoading,
  added,
  onSelect,
}: IntegrationPanelProps) => {
  const t = useTranslations();
  const query = trpc.integration.list.useInfiniteQuery(
    {
      catalog: ['tool', 'toolkit'],
      size: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  )
  const fetchNextPageRef = useRef(query.fetchNextPage)
  fetchNextPageRef.current = query.fetchNextPage;
  const integrations = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  );

  const id2added = useMemo(() => $keyby(added, 'tool_id'), [added]);

  const categoriesQuery = trpc.category.list.useQuery()

  const categories = useMemo(() => categoriesQuery.data?.items, [categoriesQuery.data]);

  return (
    <Flex h="full" w="full" overflow="hidden">
      <Stack p="6" w="270px" spacing={4} overflowY="auto">
        <Heading px="4" size="md">{t('tools.select_dialog.category_browse_title')}</Heading>
        <List>
          {categories?.map(it => (
            <ListItem 
              key={it.id}
              cursor="pointer"
              borderRadius="lg"
              px="4"
              py="2"
              fontWeight="400"
              _hover={{
                bg: 'gray.300',
              }}
              textOverflow="ecllipsis"
            >
              {it.name}
            </ListItem>
          ))}
        </List>
      </Stack>
      <Box flexGrow={1} h="full" overflowY="auto" p="4">
        <InfiniteGrid<Integration>
          w='full'
          isLoading={query.isLoading}
          items={integrations}
          itemRender={(item) => <IntegrationToolItem isLoading={isLoading} onAdd={() => onSelect?.(item)} agentTool={id2added[item?.options?.id]} integration={item} />}
          hasMore={query.hasNextPage}
          loadMore={query.fetchNextPage}
          columns={[1, 1, 3, 3, 4, 5]}
          minChildWidth="320px"
        />
      </Box>
    </Flex>
  )
}



type ToolPanelProps = {
  isLoading?: boolean
  added: AgentTool[]
  onSelect?: (item: Tool) => void
}


const ToolPanel = ({
  isLoading,
  added,
  onSelect,
}: ToolPanelProps) => {
  const { organization } = useOrganization()
  const query = trpc.tool.list.useInfiniteQuery({
    org_id: organization?.id,
    size: 20,
  }, {
    enabled: !!organization?.id,
  })

  const tools = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data],
  );

  const id2added = useMemo(() => $keyby(added, 'tool_id'), [added])

  return (
    <InfiniteGrid<Tool>
      w='full'
      px={4}
      isLoading={query.isLoading}
      items={tools}
      itemRender={(item) => <ToolItem isLoading={isLoading} tool={item} onAdd={() => onSelect?.(item)} agentTool={id2added[item.id]} />}
      hasMore={query.hasNextPage}
      loadMore={query.fetchNextPage}
      columns={[1, 1, 2, 2, 3, 4]}
      minChildWidth="320px"
    />
  );
}