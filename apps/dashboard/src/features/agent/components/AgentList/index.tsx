"use client"
import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Stack,
  Image,
  Avatar,
  VStack,
  Text,
  Button,
  Card,
  Flex,
} from '@chakra-ui/react'
import {
  PlusIcon,
} from '@/components/icons'
import {
  Agent,
} from 'models'
import { Link } from '@chakra-ui/next-js'
import { trpc } from "@/utils/trpc-client"
import { useRouter } from '@/navigation'
import { useTranslations } from 'next-intl'
import { InfiniteGrid } from '@/components/InfiniteGrid'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { DeleteIcon } from '@chakra-ui/icons'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useToast } from '@/hooks/useToast'



type AgentPreviewProps = {
  selected?: string;
  agent: Agent;
  onSelect?: () => void;
}

const AgentPreview = ({
  selected,
  agent,
  onSelect,
}: AgentPreviewProps) => {
  const router = useRouter()
  const scopedT = useTranslations('agent')
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()
  const deleteAgentMutation = trpc.agent.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.agent.list.invalidate()
      router.push(`/agents`)
    },
  })
    
  return (
    <Link href={`/agents/${agent.id}`}>
      <Card
        my={2}
        onClick={onSelect}
        cursor="pointer"
        h="220px"
        w="160px"
        overflow="hidden"
        transition="background-color .3s"
        boxSizing="border-box"
        border={
          selected !== agent.id ? "1px solid #fefdff" : "1px solid #ecfdff"
        }
        bg={
          selected === agent.id ? "linear-gradient(326deg,#d6e4f9 3%,#fff 97%)" : undefined
        }
        role="group"
      >
        <Image 
          w="100%" 
          position="absolute" 
          top="56px" 
          left="50%" 
          transform="translateX(-50%)"
          src={agent.avatar?.thumbnail} 
          alt={agent.name} 
          fallback={
            <Avatar 
              size="lg"
              position="absolute" 
              top="64px" 
              left="50%" 
              transform="translateX(-50%)"
              src={agent.avatar?.thumbnail} 
              name={agent.name}
            />
          }
        />
        {selected !== agent.id && <Box w="full" h="full" position="absolute" background="#fff" opacity={0.5} />}
        <Box 
          position="absolute" 
          top="32px" 
          left="50%" 
          transform="translateX(-50%)"
          maxW="calc(100% - 10px)" 
          overflow="hidden"
          whiteSpace="nowrap" 
          textOverflow="ellipsis" 
        >
          <Text color="gray.900" fontSize="sm" fontWeight={500} noOfLines={1}>{agent.name}</Text>
        </Box>
        <Flex
          position="absolute"
          alignItems="center"
          bottom={0}
          justifyContent="space-between"
          w="100%"
          h="36px"
          bg="#f9f6f2"
          transform="translateY(36px)"
          transition="transform .3s,opacity .3s"
          _groupHover={{
            transform: "translateY(0)",
            opacity: 1,
          }}
          px={4}
          py={2}
        >
          <Box p={1}>
            <ConfirmModal
              isLoading={deleteAgentMutation.isLoading}
              trigger={
                <DeleteIcon 
                  fontSize="12px"
                  color="#acabb3"
                  _hover={{
                    color: '#0f0643'
                  }}
                />
              }
              confirmText={scopedT('confirmModal.confirm')}
              title={scopedT('confirmModal.title')}
              message={scopedT.rich('confirmModal.message', { 
                confirmText: (chunks) => <b>{scopedT('confirmModal.confirm')}</b>,
              })}
              onConfirm={() => deleteAgentMutation.mutateAsync(agent?.id)}
            />
          </Box>
        </Flex>
      </Card>
    </Link>
  )
}



type Props = {
  selected?: string;
  onChange?: (agent: Agent) => void;
}

export const AgentList: React.FC<Props> = ({
  selected: _selected,
  onChange,
}) => {
  const router = useRouter()
  const t = useTranslations()
  const { organization } = useOrganization()
  const [selected, setSelected] = useState<string | undefined>(undefined);
  useEffect(() => {
    setSelected(_selected)
  }, [_selected])

  const handleChange = (value: Agent) => {
    setSelected(value.id)
    onChange?.(value)
  }

  const query = trpc.agent.list.useInfiniteQuery(
    {
      org_id: organization?.id,
      size: 20,
    },
    {
      enabled: !!organization?.id,
      getNextPageParam: (lastPage) => lastPage.next_page,
    }
  )

  const agents = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  )
  
  return (
    <Stack w='full' h='full' spacing={4} pt={4}>
      <VStack>
        <Button rounded="full" leftIcon={<PlusIcon/>} colorScheme="twitter" onClick={() => router.push('/agents')}>{t('agent.btnCreate')}</Button>
      </VStack>
      <VStack overflowY="auto">
        <Box w="164px">
          <InfiniteGrid<Agent> 
            isLoading={query.isLoading}
            items={agents}
            itemRender={(item) => <AgentPreview agent={item} selected={selected} onSelect={() => handleChange(item)} />}
            hasMore={query.hasNextPage}
            loadMore={query.fetchNextPage}
            columns={[1]}
            spacing={0}
          />
        </Box>
      </VStack>
    </Stack>
  );
}