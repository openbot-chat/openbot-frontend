import { useAgent } from '@/features/agent/providers/AgentProvider'
import { Standard } from '@openbot/react'


export const WebPreview = () => {
  const { agent } = useAgent()

  console.log('WebPreview render')

  return (
    <Standard
      agent={agent}
      showAvatar
      provider="dashboard"
      apiHost={process.env.NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL}
    />
  )
}