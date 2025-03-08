"use client"

import React, { useMemo, useState } from 'react'

import {
  Container,
  Stack,
  VStack,
  Box,
  Heading,
  HStack,
  Button,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
} from '@chakra-ui/react'
import { useToast } from '@/hooks/useToast'
import { HomeIcon, PlusIcon } from '@/components/icons'
import { InfiniteGrid } from '@/components/InfiniteGrid'
import { trpc } from "@/utils/trpc-client"
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useTranslations } from 'next-intl'
import { Prompt } from 'models'
import EditPromptModal from '@/features/prompt/components/EditPromptModal'
import PromptCard from '@/features/prompt/components/PromptCard'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'

type Props = {
  data?: Prompt[]
}

export default function PromptsClientPage({ data }: Props) {
  const t = useTranslations("prompts")
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | undefined>(undefined)
  const { organization } = useOrganization()
  
  const query = trpc.prompt.list.useInfiniteQuery({
    org_id: organization?.id,
    size: 10,
  }, {
    enabled: !!organization?.id,
    getNextPageParam: (lastPage) => lastPage.next_page,
  })
  const createPromptMutation = trpc.prompt.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async (prompt: Prompt) => {
      onClose()
      /*
      if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
        analytics.track("Created Prompt", { ...payload });
      }
      */
      trpcContext.prompt.list.invalidate()
    },
  })
  const updatePromptMutation = trpc.prompt.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async (prompt: Prompt) => {
      onClose()
      /*
      if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
        analytics.track("Updated Prompt", { ...payload });
      }
      */

      trpcContext.prompt.list.invalidate()
    },
  })
  const deletePromptMutation = trpc.prompt.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async (prompt: Prompt) => {
      onClose()
      trpcContext.prompt.list.invalidate()
    },
  })

  const prompts = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? data ?? [],
    [data, query.data]
  )

  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure()

  const handleSubmit = async (data: Prompt) => {
    const payload = {
      ...data,
      org_id: organization.id,
    }

    if (selectedPrompt) {
      payload.id = selectedPrompt.id
      await updatePromptMutation.mutateAsync(payload)
    } else {
      await createPromptMutation.mutateAsync(payload)
    }
  }

  const handleDelete = async (prompt: Prompt) => {
    await deletePromptMutation.mutateAsync(prompt.id)

    /*
    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Deleted Prompt", { id });
    }
    */
  }

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    onOpen()
  }

  return (
    <Container maxW="1280px">
      <VStack w="full" h="full" spacing={8} py={8}>
        <Stack w='full'>
          <Breadcrumb color={useColorModeValue('gray.500', 'white')} fontWeight='medium' fontSize="sm" spacing='8px' separator={<ChevronRightIcon color={useColorModeValue('gray.500', 'white')} />}>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'><HomeIcon /></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='/prompts'>{t('title')}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Stack>

        <EditPromptModal data={selectedPrompt} isLoading={createPromptMutation.isLoading || updatePromptMutation.isLoading} onClose={onClose} isOpen={isOpen} onSubmit={handleSubmit} />
        <HStack w='full'>
          <Heading>{t("title")}</Heading>
          <Box flexGrow={1} />
          <Box>
            <Button colorScheme="orange" leftIcon={<PlusIcon />} onClick={() => {
              setSelectedPrompt(undefined)
              onOpen()
            }}>{t("createButton.label")}</Button>
          </Box>
        </HStack>
        
        <InfiniteGrid<Prompt>
          isLoading={query.isLoading}
          items={prompts}
          itemRender={(item) => (
            <PromptCard 
              key={item.id}
              prompt={item} 
              onEdit={() => handleEdit(item)} 
              onDelete={() => handleDelete(item)} />
          )}
          hasMore={query.hasNextPage}
          loadMore={query.fetchNextPage}
          columns={[1, 2, 2, 4]} 
          gap={6}
          minChildWidth="320px"
        />
      </VStack>
    </Container>
  );
}