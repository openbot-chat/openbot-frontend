"use client"

import { WelcomeCard } from '@/features/marketplace/components/WelcomeCard';
import { useRouter } from 'next/navigation';
import {
  Stack,
  VStack,
  SlideFade,
  Divider,
  Box,
  Tabs,
  Tab,
  TabList,
  Button,
} from '@chakra-ui/react';
import { useMemo } from 'react';


import { IntegrationListPage } from '@/features/integration/components/IntegrationListPage';
import { AgentPage } from '@/features/marketplace/components/AgentPage/AgentPage';
import { AgentIcon, DatasourceIcon, DatastoreIcon } from '@/components/icons';
import { FaTools } from 'react-icons/fa';

const catalogs = [
  'agents',
  'tool',
  'datasource',
  'datastore',
  'channel'
];

const components: Record<string, React.Component | React.FunctionComponent> = {
  'agents': AgentPage,
  'tool': IntegrationListPage,
  'datasource': IntegrationListPage,
}

type Props = {
  catalog: string
}

export function CatalogPage({
  catalog,
}: Props) {
  const router = useRouter()
  const tabIndex = useMemo(() => catalogs.indexOf(catalog), [catalog])

  const handleTabsChange = (index: number) => {
    const catalog = catalogs[index]
    router.push(`/marketplace/${catalog}`)
  }

  const Component = components[catalog]
  const props = useMemo(() => ({
    catalog: [catalog],
  }), [catalog])

  return (
    <VStack p='8'>
      <WelcomeCard />
      {/*
      <Tabs isLazy index={tabIndex} onChange={handleTabsChange}>
        <HStack w="full">
          <TabList>
            <Tab><Button leftIcon={<AgentIcon />} variant="ghost">Agents</Button></Tab>
            <Tab><Button leftIcon={<FaTools />} variant="ghost">Tools</Button></Tab>
            <Tab><Button leftIcon={<DatasourceIcon />} variant="ghost">Datasource</Button></Tab>
            <Tab><Button leftIcon={<DatastoreIcon />} variant='ghost'>Datastore</Button></Tab>
            <Tab><Button variant='ghost'>Channel</Button></Tab>
          </TabList>
        </HStack>
      </Tabs>
      */}
      <Box w="full">
        <SlideFade in={true} offsetY='20px'>
          <Stack spacing={4} w='full'>
            <Divider/>
            <AgentPage />
            {/* Component && <Component {...props}/>*/}
          </Stack>
        </SlideFade>
      </Box>
    </VStack>
  );
}