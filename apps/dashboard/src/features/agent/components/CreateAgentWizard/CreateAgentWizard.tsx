import { useTranslations } from 'next-intl';
import { trpc } from "@/utils/trpc-client";
import { 
  Text, 
  Button, 
  Heading, 
  Stack, 
  Wrap, 
  HStack,
} from "@chakra-ui/react";
import { AgentTemplateCard } from "./AgentTemplateCard";
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation';
import { Agent, CreateAgent, AgentVisibility } from 'models';
import { LoadingModal } from "@/components/LoadingModal";
import { PlusIcon } from "@/components/icons";
import { useAgent } from "../../providers/AgentProvider";
import { useOrganization } from '@/features/organization/context/OrganizationProvider';



export const CreateAgentWizard = () => {
  const t = useTranslations()
  const router = useRouter()
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()
  const { organization } = useOrganization()
  const query = trpc.agent.listTemplates.useQuery({})

  const { switchAgent } = useAgent()

  const createAgentMutation = trpc.agent.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async (agent) => {
      trpcContext.user.listAgents.invalidate()
      router.push(`/agents/${agent.id}`)
    },
  })

  const createAgent = async (template?: Agent) => {
    if (!organization) return

    const data = { 
      name: 'Unamed',
      options: {
        provider: 'openai_assistant',
        chain: {
          type: 'openai_assistant',
        }
      },
      visibility: AgentVisibility.Private,
      org_id: organization.id,
    } as CreateAgent

    if (template) {
      data['template_id'] = template.id
    }

    await createAgentMutation.mutateAsync(data)
  }

  return (
    <Stack p={{ base: '20px', md: '30px' }} spacing={8}>
      <LoadingModal isOpen={createAgentMutation.isLoading} />
      <HStack spacing={4}>
        <Button rounded="full" colorScheme="twitter" leftIcon={<PlusIcon />} onClick={() => createAgent()}>{t('agent.btnCreateFromScratch')}</Button>
        <Text>OR</Text>
        <Heading size="md">Select a template to quick start</Heading>
      </HStack>
      <Wrap spacing={4}>
        {query.data?.items?.map((template, i) => (
          <AgentTemplateCard key={i} agent={template} onSelect={() => createAgent(template)} onPreview={() => switchAgent(template.id)}/>
        ))}
      </Wrap>
    </Stack>
  )
}