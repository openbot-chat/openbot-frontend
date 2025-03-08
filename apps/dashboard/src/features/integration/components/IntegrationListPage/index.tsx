"use client"
import { useMemo, useState } from 'react';
import { IntegrationList } from './IntegrationList';
import {
  InputGroup,
  Flex,
  Box,
  VStack,
  HStack,
  Input,
  Button,
  useDisclosure,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { trpc } from "@/utils/trpc-client"
import { useToast } from '@/hooks/useToast'

import {
  SearchIcon,
} from '@chakra-ui/icons';

import { ImportPluginModal } from '@/features/plugin/components/ImportPluginModal';

import {
  Categories,
} from './Categories';
import { InfiniteGrid } from '@/components/InfiniteGrid';
import { Integration } from 'models';
import { IntegrationItem } from './IntegrationItem';
import { useTranslations } from 'next-intl';


const catalogs = [
  {
    value: "ai_plugin",
    label: "AIPlugin"
  },
  {
    value: "datasource",
    label: "Datasource"
  },
  {
    value: "tool",
    label: "Tool"
  }
]

const categories = [
  {
    value: "1",
    label: "教育"
  },
  {
    value: "2",
    label: "电商"
  },
  {
    value: "3",
    label: "社交"
  },
  {
    value: "4",
    label: "ERP"
  },
  {
    value: "5",
    label: "营销"
  },
  {
    value: "6",
    label: "开发"
  },
  {
    value: "7",
    label: "工具"
  },
]

type Props = {
  catalog: string[]
}

export const IntegrationListPage = ({
  catalog,
}: Props) => {
  const scopedT = useTranslations('marketplace')
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()
  const [collection, setCollection] = useState()

  const query = trpc.integration.list.useInfiniteQuery(
    {
      catalog,
      collection,
      size: 20,
    },{
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  );

  const integrations = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  );


  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const importPluginMutation = trpc.integration.importPlugin.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      onCreateClose();
      trpcContext.integration.list.invalidate();
    },
  });

  return (
    <VStack w="full" spacing={4} pl={8} pr={8} pt={4}>
      <Flex w="full" pt={12} alignItems="center">
        <Box flex={1}>
          <Categories title="场景" options={categories} value={collection} onSelect={setCollection} />
        </Box>
        <Box>
          <InputGroup>
            <Input bgColor="white" placeholder="Search..." />
            <InputRightElement>
              <SearchIcon />
            </InputRightElement>
          </InputGroup>  
        </Box>
      </Flex>
      <InfiniteGrid<Integration>
        w='full'
        isLoading={query.isLoading}
        items={integrations}
        itemRender={(item) => <IntegrationItem integration={item} />}
        hasMore={query.hasNextPage}
        loadMore={query.fetchNextPage}
        columns={[1, 1, 2, 2, 3, 4]}
        minChildWidth="320px"    
      />
    </VStack>
  );
}