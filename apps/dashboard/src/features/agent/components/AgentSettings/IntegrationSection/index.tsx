import { TabList, TabPanels, TabPanel, Tabs, Tab, Stack, HStack, Text, Switch } from "@chakra-ui/react"
import { EmbedsSection } from '@/features/deploy/components/EmbedsSection'
import { useTranslations } from "next-intl"
import { useAgent } from "@/features/agent/providers/AgentProvider"
import { AgentVisibility } from 'models'
import { parseDefaultPublicId } from "@/features/deploy/helpers/parseDefaultPublicId"



export const IntegrationSection = () => {
  const t = useTranslations()
  const { agent, save } = useAgent()
  
  const handleChangeVisibility = (e) => {
    if (!agent) return

    const data = {
      visibility: e.target.checked ? AgentVisibility.Public : AgentVisibility.Private,
    } as any

    if (!agent.identifier) {
      data.identifier = parseDefaultPublicId(agent.name, agent.id)
    }

    save(data)
  }
  

  return (
    <Stack spacing={4}>
      <HStack spacing={2}>
        <Text>{t('agent.visibility')}</Text>
        <Switch isChecked={agent?.visibility === AgentVisibility.Public} onChange={handleChangeVisibility} />
      </HStack>

      <EmbedsSection />
    </Stack>
  )
}