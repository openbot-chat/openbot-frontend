import {
  createContext,
  PropsWithChildren,
  useEffect,
  useCallback,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from 'react'
import { useToast } from '@/hooks/useToast'
import { trpc } from "@/utils/trpc-client"
import { Agent, UpdateAgent } from 'models'
import { parseDefaultPublicId } from '@/features/deploy/helpers/parseDefaultPublicId'
import { isDefined } from '@openbot/lib'
import { useTranslations } from 'next-intl'

export type AgentContextProps = {
  agent?: Agent
  save: (data: Omit<UpdateAgent, 'id'>) => Promise<void>
  isFetchingAgent: boolean
  isSavingLoading: boolean
  switchAgent: Dispatch<SetStateAction<string | undefined>>
  refetch: () => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AgentContext = createContext<AgentContextProps>({})

type Props = {
  agentId?: string
}

export const AgentProvider = ({
  children,
  agentId: _agentId,
}: PropsWithChildren<Props>) => {
  const t = useTranslations()
  const trpcContext = trpc.useContext()
  const [agentId, setAgentId] = useState<string | undefined>(undefined)
  const [localAgent, setLocalAgent] = useState<Agent | undefined>(undefined)
  const { 
    data: agent, 
    isLoading: isFetchingAgent, 
    refetch: refetchAgent,
  } = trpc.agent.details.useQuery(agentId, { 
    enabled: !!agentId,
    refetchOnWindowFocus: false, // TODO
  })

  const { showToast } = useToast();
  useEffect(() => {
    setAgentId(_agentId);
  } ,[_agentId])

  useEffect(() => {
    if (!agent && isDefined(localAgent)) setLocalAgent(undefined)
    if (isFetchingAgent || !agent) return

    setLocalAgent(agent)
  }, [
    localAgent,
    isFetchingAgent,
    agent,
  ])

  const updateAgentMutation = trpc.agent.update.useMutation({
    onError: (error) => showToast({ 
      status: 'error',
      description: error.message,
    }),
    onSuccess: async () => {
      trpcContext.user.listAgents.invalidate()
      refetchAgent()
      showToast({ 
        status: 'success', 
        description: t('save.success'),
      })
    },
  })

  const save = useCallback(
    async (updates: UpdateAgent) => {
      const toSave = { ...updates, id: agent?.id }

      if (!updates.identifier && !agent.identifier) {
        const newIdentifier = parseDefaultPublicId(agent.name, agent.id)
        toSave.identifier = newIdentifier
      }

      // setLocalAgent({ ...localAgent, ...toSave })

      const newAgent = await updateAgentMutation.mutateAsync(toSave)

      setLocalAgent(newAgent)

      return newAgent
    }, 
    [
      agent, 
      localAgent, 
      setLocalAgent,
      updateAgentMutation,
    ]
  )

  const contextValue = {
    agent: localAgent,
    isFetchingAgent,
    refetch: refetchAgent,
    isSavingLoading: updateAgentMutation.isLoading,
    save,
    switchAgent: setAgentId,
  }

  return (
    <AgentContext.Provider value={contextValue}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => useContext(AgentContext)
