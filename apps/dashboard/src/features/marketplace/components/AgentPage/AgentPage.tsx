import React, { useMemo, useRef } from 'react';

import {
  VStack,
  HStack,
  Button,
  Container,
  SlideFade,
} from '@chakra-ui/react';
import Link from 'next/link';
import { AgentCard } from '@/features/agent/components/AgentCard'
import { trpc } from "@/utils/trpc-client"
import { InfiniteGrid } from '@/components/InfiniteGrid';
import { Agent } from 'models';

export function AgentPage() {
  const query = trpc.marketplace.listAgents.useInfiniteQuery(
    {
      size: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  )

  const fetchNextPageRef = useRef(query.fetchNextPage)
  fetchNextPageRef.current = query.fetchNextPage;

  const agents = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  );

  const collections = useMemo(() => [
    {
      id: '1',
      name: '推荐',
    },
    {
      id: '2',
      name: '历史人物',
    },
    {
      id: '3',
      name: '名人',
    },
    {
      id: '4',
      name: '品牌',
    },
    {
      id: '5',
      name: '工具',
    },
    {
      id: '6',
      name: '游戏',
    },
    {
      id: '7',
      name: '图片生成',
    },
    {
      id: '8',
      name: '语言学习',
    },
    {
      id: '9',
      name: '动物',
    },
    {
      id: '10',
      name: '书籍',
    },
    {
      id: '11',
      name: '新闻',
    },
    {
      id: '12',
      name: '软件开发',
    }
  ], []);

  const loadMore = () => {
    if (query.hasNextPage && fetchNextPageRef.current) {
      fetchNextPageRef.current();
    }
  }

  return (
    <VStack spacing={4} w='full'>
      <HStack spacing='2'>
        {collections.map(collection => (
          <Button key={collection.id}>{collection.name}</Button>
        ))}
      </HStack>
      <Container maxW="full">
        <InfiniteGrid<Agent>
          isLoading={query.isLoading}
          items={agents}
          itemRender={(item) => <AgentCard agent={item} />}
          hasMore={query.hasNextPage}
          loadMore={loadMore}
          minChildWidth="208px"
        />
      </Container>
    </VStack>
  );
}