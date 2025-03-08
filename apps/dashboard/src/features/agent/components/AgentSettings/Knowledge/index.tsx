import React, { useMemo, useState } from 'react'
import {
  Stack,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tr,
  Td,
  Text,
} from '@chakra-ui/react'
import { useToast } from '@/hooks/useToast'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@/components/icons'
import { useAgent } from '../../../providers/AgentProvider'
import { trpc } from '@/utils/trpc-client'
import { DatastoreBindingTable } from './DatastoreBindingTable'
import Link from 'next/link'
import { Datastore } from 'models'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'


export const KnowledgeList: React.FC = () => {
  const { agent, isLoading } = useAgent()
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const [tabIndex, setTabIndex] = useState(0)
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const { organization } = useOrganization()
  const bindDatastoreMutation = trpc.agent.bindDatastore.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.agent.details.invalidate();
    },
  })
  const unbindDatastoreMutation = trpc.agent.unbindDatastore.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.agent.details.invalidate();
    },
  })
  const [cursor, setCursor] = useState(undefined)
  const query = trpc.datastore.list.useInfiniteQuery({
    cursor,
    org_id: organization?.id,
  }, {
    enabled: !!organization?.id,
  })

  const datastores = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  )

  const handleBindingChange = async (datastore: Datastore, enabled: boolean) => {
    if (enabled) {
      await bindDatastoreMutation.mutateAsync({
        agentId: agent.id,
        datastoreId: datastore.id,
      });
    } else {
      await unbindDatastoreMutation.mutateAsync({
        agentId: agent.id,
        datastoreId: datastore.id,
      })
    }
  }

  const emptyBinding = (
    <Tr>
      <Td colSpan={5}>
        <VStack>
          {datastores.length > 0 ? (
            <Button colorScheme="twitter" leftIcon={<PlusIcon/>} onClick={() => setTabIndex(1)}>绑定知识库</Button>
          ) : (
            <Link href={`/datastores`}>去创建知识库</Link>
          )}
        </VStack>
      </Td>
    </Tr>
  )

  return (
    <VStack w='full' alignItems="left">
      <Tabs onChange={(index) => setTabIndex(index)} index={tabIndex} variant='soft-rounded' colorScheme='twitter'>
        <TabList>
          <Tab>Binded({agent?.datastores?.length ?? 0})</Tab>
          <Tab>All({datastores.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DatastoreBindingTable 
              empty={emptyBinding}
              isFetching={query.isFetching && !query.data}
              isLoading={bindDatastoreMutation.isLoading || unbindDatastoreMutation.isLoading }
              bindings={agent?.datastores} 
              items={agent?.datastores?.map(it => it.datastore) ?? []} 
              onBindingChange={handleBindingChange}
            />
          </TabPanel>
          <TabPanel as={Stack} spacing={4}>
            <DatastoreBindingTable 
              empty={emptyBinding}
              isFetching={query.isFetching && !query.data}
              isLoading={bindDatastoreMutation.isLoading || unbindDatastoreMutation.isLoading }
              bindings={agent?.datastores} 
              items={datastores}
              onBindingChange={handleBindingChange}
            />
            <HStack justifyContent="space-between" w='full'>
              <Button 
                leftIcon={<ChevronLeftIcon />} 
                isDisabled={!query.data?.previous_page}
                onClick={() => setCursor(query.data?.previous_page)}
              >
                Previous
              </Button>
              <Text>
                Total: {query.data?.total ?? 0}
              </Text>
              <Button 
                rightIcon={<ChevronRightIcon />}
                isDisabled={!query.data?.next_page}
                onClick={() => setCursor(query.data?.next_page)}
              >
                Next
              </Button>
            </HStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};