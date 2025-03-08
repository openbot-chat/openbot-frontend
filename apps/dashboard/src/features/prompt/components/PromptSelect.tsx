import { InfiniteGrid } from "@/components/InfiniteGrid"
import {
  Button, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  useDisclosure,
  HStack,
  Stack,
  Heading,
  Box,
} from "@chakra-ui/react"
import { Prompt } from "models"
import { trpc } from "@/utils/trpc-client"
import { useOrganization } from "@/features/organization/context/OrganizationProvider"
import PromptCard from "./PromptCard"
import { useMemo, useState } from "react"
import { useToast } from "@/hooks/useToast"
import EditPromptModal from "./EditPromptModal"
import { PlusIcon } from "@/components/icons"
import { useTranslations } from "next-intl"



type Props = {
  label?: string
  promptId?: string
  onSelect?: (promptId: string, prompt: Prompt) => void
}

export const PromptSelect = ({
  label,
  promptId,
  onSelect,
}: Props) => {
  const {
    onOpen,
    isOpen,
    onClose,
  } = useDisclosure()

  const scopedT = useTranslations('prompts.promptSelect')

  const query = trpc.prompt.details.useQuery(promptId, {
    enabled: !!promptId,
  })

  const handleSelect = (prompt: Prompt) => {
    onSelect?.(prompt.id, prompt)
  }

  return (
    <>
      <PromptSelectModal isOpen={isOpen} onClose={onClose} onSelect={handleSelect} />
      <Button onClick={onOpen}>{query.data?.name ?? label ?? scopedT('button.label')}</Button>
    </>
  )
}


type PromptSelectModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect?: (prompt: Prompt) => void
}

const PromptSelectModal = ({
  isOpen,
  onClose,
  onSelect,
}: PromptSelectModalProps) => {
  const t = useTranslations()
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
      onCloseEdit()
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
      onCloseEdit()
      setSelectedPrompt(undefined)
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
      onCloseEdit()
      trpcContext.prompt.list.invalidate()
    },
  })

  const prompts = useMemo(
    () => query.data?.pages?.flatMap((d) => d.items) ?? [],
    [query.data]
  )

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure()
  
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
    onOpenEdit()
  }

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

  const handleSelect = (prompt: Prompt) => {
    onSelect?.(prompt)
    onClose()
  }

  return (
    <>
      <EditPromptModal data={selectedPrompt} isLoading={createPromptMutation.isLoading || updatePromptMutation.isLoading} onClose={onCloseEdit} isOpen={isOpenEdit} onSubmit={handleSubmit} />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>选择提示词</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4} minH={400} w="full">
              <HStack w='full'>
                <Box flexGrow={1} />
                <Box>
                  <Button colorScheme="orange" leftIcon={<PlusIcon />} onClick={() => {
                    setSelectedPrompt(undefined)
                    onOpenEdit()
                  }}>{t("prompts.createButton.label")}</Button>
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
                    onDelete={() => handleDelete(item)}
                    onSelect={handleSelect}
                  />
                )}
                hasMore={query.hasNextPage}
                loadMore={query.fetchNextPage}
                columns={[1, 1, 2, 3]} 
                gap={4}
              />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}