import { AgentSettings } from '@/features/agent/components/AgentSettings'

type Props = {
  params: { 
    id: string
    tab: string
  }
}

export default function Page({
  params: {
    id,
    tab,
  }
}: Props) {
  return (
    <AgentSettings id={id} tab={tab} />
  )
}