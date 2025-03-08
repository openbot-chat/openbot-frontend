"use client"
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Container,
  Stack,
  VStack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  HStack,
  Heading,
  Button,
  Flex,
  Tag,
  Card,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
  Divider,
  useColorModeValue,
  SkeletonText,
} from '@chakra-ui/react'
import { SearchIcon, ChevronRightIcon, SettingsIcon } from '@chakra-ui/icons'
import { PlusIcon, DatasourceIcon, HomeIcon } from '@/components/icons'
import { DatasourceTableTab } from '@/features/datasource/components/DatasourceTableTab'
import { DatasourceDrawer } from '@/features/datasource/components/DatasourceDrawer'
import { EditDatasourceModal } from '@/features/datasource/components/EditDatasourceModal'
import { trpc } from "@/utils/trpc-client"
import { Integration, Datasource } from 'models'
import { Bubble } from "@typebot.io/react"
import { DatastoreSettings } from './DatastoreSettings'
import { useParams } from 'next/navigation'
import { useSaveDatasource } from '@/features/datasource/hooks/useSaveDatasource'
import { DatastoreSearch } from './DatastoreSearch'
import { useCallback } from 'react'
import { ParentModalProvider } from '@/features/graph/providers/ParentModalProvider';



export const DatastoreDetailsPage = () => {
  const params = useParams();
  const t = useTranslations();
  const query = trpc.datastore.details.useQuery(params?.id);
  const datastore = useMemo(() => query.data, [query.data]);
  const { 
    isOpen: isOpenDrawer, 
    onOpen: onOpenDrawer, 
    onClose: onCloseDrawer,
  } = useDisclosure();
  const { 
    isOpen: isOpenEdit, 
    onOpen: onOpenEdit, 
    onClose: onCloseEdit,
  } = useDisclosure();

  const [provider, setProvider] = useState<string | undefined>(undefined);
  const [selectedDatasource, setSelectedDatasource] = useState<Datasource | undefined>(undefined);
  const { saveDatasource, isLoading } = useSaveDatasource({ datastoreId: datastore?.id });

  const handleSelectDataProvider = (dataProvider: Integration) => {
    setProvider(dataProvider.identifier);
    onOpenEdit();
  };

  const handleEdit = (datasource: Datasource) => {
    setProvider(datasource.type);
    setSelectedDatasource(datasource);
    onOpenEdit();
  };

  const handleCloseDatasource = useCallback(() => {
    setProvider(undefined);
    setSelectedDatasource(undefined);
    onCloseDrawer();
    onCloseEdit();
  }, [
    onCloseDrawer,
    onCloseEdit,
  ]);

  const handleSaveDataSource = useCallback(async (datasource: Partial<Datasource>) => {
    await saveDatasource(provider, datasource);
    handleCloseDatasource();
  }, [provider, saveDatasource, handleCloseDatasource]);


  return (
    <Container w="full" maxW="1280px">
      <Stack w="full" spacing={6} pt={8}>
        {datastore && <Bubble
          prefilledVariables={{
            question: `当前数据集名字叫 ${datastore?.name_for_model}`,
          }}
          typebot="my-typebot-8ixfa6w"
          apiHost="https://v.openbot.chat"
          theme={{
            button: { backgroundColor: "#0042DA", iconColor: "#FFFFFF" },
            previewMessage: { backgroundColor: "#ffffff", textColor: "black" },
          }}
          onNewInputBlock={(ids) => {
            console.log('onNewInputBlock: ', ids);
          }}
          onAnswer={(answer) => {
            console.log('answer: ', answer);
          }}
        />}
        
        {!!datastore && (
          <ParentModalProvider>
            <EditDatasourceModal 
              isLoading={isLoading}
              datastore={datastore}
              provider={provider}
              isOpen={!!provider && isOpenEdit}
              datasource={selectedDatasource}
              onClose={handleCloseDatasource}
              onCreate={handleSaveDataSource}
            />
          </ParentModalProvider>
        )}
        <DatasourceDrawer isOpen={isOpenDrawer} onClose={onCloseDrawer} onSelect={handleSelectDataProvider} />

        <Breadcrumb fontWeight='medium' fontSize="sm" spacing='8px' separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'><HomeIcon /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='/datastores'>{t('datastores')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#'>{datastore?.name_for_model}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex w='full' justifyContent="space-between">
          <HStack>
            <Heading color={useColorModeValue('gray.900', 'white')}>
              <SkeletonText noOfLines={1} skeletonHeight={10} isLoaded={!(query.isFetching && !datastore)} minW='240px'>
                {datastore?.name_for_model}
              </SkeletonText>
            </Heading>
            <Tag colorScheme="red">{datastore?.visibility ?? 'private'}</Tag>
          </HStack>
          <HStack spacing={2}>
            <Button colorScheme="orange" leftIcon={<PlusIcon />} onClick={onOpenDrawer}>{t('datasource.add')}</Button>
          </HStack>
        </Flex>
        <Tabs w='full' size="md" colorScheme="twitter" variant="solid-rounded" as={VStack} spacing={8} isLazy>
          <HStack>
            <TabList as={Card} p={1} bgColor={useColorModeValue('gray.200', 'gray.700')}>
              <Tab borderRadius={4}>
                <HStack spacing={2}>
                  <DatasourceIcon /> <Text>{t('datastore.datasources')}</Text>
                </HStack>
              </Tab>
              <Tab borderRadius={4}>
                <HStack spacing={2}>
                  <SearchIcon /><Text>{t('datastore.search')}</Text>
                </HStack>
              </Tab>
              <Tab borderRadius={4}>
                <HStack spacing={2}>
                  <SettingsIcon /><Text>{t('datastore.settings')}</Text>
                </HStack>
              </Tab>
            </TabList>
          </HStack>
          <Divider />
          <TabPanels>
            <TabPanel px={0}>
              <DatasourceTableTab datastore={datastore} onEdit={(datasource: Datasource) => handleEdit(datasource)} />
            </TabPanel>
            <TabPanel px={0}>
              {datastore && <DatastoreSearch datastore={datastore} />}
            </TabPanel>
            <TabPanel px={0}>
              {datastore && <DatastoreSettings datastore={datastore} />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}