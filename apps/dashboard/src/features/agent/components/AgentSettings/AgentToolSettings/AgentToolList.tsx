import {
  VStack,
  HStack,
  Box,
  Button,
  useDisclosure,
  Heading,
  Container,
} from '@chakra-ui/react';
import { trpc } from "@/utils/trpc-client"
import { useToast } from '@/hooks/useToast'
import { SelectToolModal } from '@/features/tool/components/SelectToolModal'
import { AgentToolItem } from '@/features/agent_tool/components/AgentToolList/AgentToolItem'
import { useAgent } from '../../../providers/AgentProvider'
import { Tool, AgentTool } from 'models'
import { FaTools } from 'react-icons/fa'
import { InfiniteGrid } from '@/components/InfiniteGrid'
import { useMemo, useState } from 'react'
import { EditAgentToolModal } from '@/features/agent_tool/components/EditAgentToolModal'
import { useTranslations } from 'next-intl'
import { ParentModalProvider } from '@/features/graph/providers/ParentModalProvider';



export const AgentToolList: React.FC = () => {
  const scopedT = useTranslations()
  const { agent } = useAgent()
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const [tool, setTool] = useState<Tool | undefined>()
  const [selectedAgentTool, setSelectedAgentTool] = useState<AgentTool | undefined>()
  const query = trpc.agent.listTools.useInfiniteQuery({
    id: agent?.id,
  })
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure()

  const {
    isOpen: isOpenAgentTool,
    onOpen: onOpenAgentTool,
    onClose: onCloseAgentTool,
  } = useDisclosure()

  const handleCloseAgentTool = () => {
    setSelectedAgentTool(undefined)
    onCloseAgentTool()
  }

  const agentTools = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  )

  const addAgentToolMutation = trpc.agent.addTool.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      onClose()
      trpcContext.agent.listTools.invalidate()
    },
  })

  const updateAgentToolMutation = trpc.agent.updateTool.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      onClose();
      trpcContext.agent.listTools.invalidate()
    },
  })
  const handleSelectTool = async (tool: Tool) => {
    if (!agent) return

    setTool(tool)
    // 如果需要配置
    if (tool.options?.schema) {
      onOpenAgentTool()
    } else {
      await addAgentToolMutation.mutateAsync({
        agent_id: agent.id,
        tool_id: tool.id,
        name: tool.name,
        description: tool.description,
      })
    }
  }

  const handleSubmitAgentTool = async (agentTool: AgentTool) => {
    if (selectedAgentTool) {
      // edit
      await updateAgentToolMutation.mutateAsync({
        agent_id: agent.id,
        agent_tool_id: selectedAgentTool.id,
        ...agentTool,
      });
    } else {
      await addAgentToolMutation.mutateAsync({
        agent_id: agent.id,
        tool_id: tool.id,
        ...agentTool,
      });
    }
  }

  const handleEditAgentTool = async (agentTool: AgentTool) => {
    setSelectedAgentTool(agentTool)
    onOpenAgentTool()
  }

  return (
    <VStack w='full'>
      <ParentModalProvider>
        {(selectedAgentTool || tool) && <EditAgentToolModal isLoading={addAgentToolMutation.isLoading || updateAgentToolMutation.isLoading} isOpen={isOpenAgentTool} onClose={handleCloseAgentTool} onSubmit={handleSubmitAgentTool} value={selectedAgentTool} tool={tool || selectedAgentTool.tool} />}
      </ParentModalProvider>

      <HStack w='full'>
        <Box>
          <Heading size="sm">{scopedT('agent.tools.heading.label')}</Heading>
        </Box>
        <Box flexGrow={1}/>
        <Box>
          <SelectToolModal isLoading={addAgentToolMutation.isLoading || updateAgentToolMutation.isLoading} isOpen={isOpen} onClose={onClose} onSelect={handleSelectTool} added={agentTools} />
          <Button colorScheme="twitter" leftIcon={<FaTools />} onClick={onOpen}>Add Tool</Button>
        </Box>
      </HStack>
      <Container maxW="full">
        <InfiniteGrid<AgentTool>
          isLoading={query.isLoading}
          items={agentTools}
          itemRender={(item) => <AgentToolItem agentTool={item} onEdit={() => handleEditAgentTool(item)} />}
          hasMore={query.hasNextPage}
          loadMore={query.fetchNextPage}
          columns={[1, 1, 2, 2, 3, 4]}
          minChildWidth="320px"    
        />
      </Container>
    </VStack>
  )
}