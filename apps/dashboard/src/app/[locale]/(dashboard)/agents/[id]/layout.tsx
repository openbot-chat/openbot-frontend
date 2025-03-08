"use client"
import { useAgentBuilder } from '@/features/agent/hooks/useAgentBuilder'
import { Bubble } from '@openbot/react'


type Props = {
  children: React.ReactNode
}

export default function Layout({
  children,
}: Props) {
  const { handleRunStep } = useAgentBuilder()

  return (
    <>
      {/*<Bubble
        previewMessage={{
          message: "I can help you to build your agent",
          avatarUrl: 'https://models.readyplayer.me/65496d7c442166eef51d4c20.png',
          autoShowDelay: 2000,
        }}
        theme={{
          placement: 'left',
          button: {
            size: 'large',
            customIconSrc: 'https://models.readyplayer.me/65496d7c442166eef51d4c20.png',
          },
          chatWindow: {
            backgroundColor: 'white',
          }
        }}
        defaultOpen={true}
        agent={'1947aff1-b2b5-4953-a0f0-cd3bb7d9d115'}
        showAvatar
        provider="dashboard"
        apiHost={process.env.NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL}
        onRunStep={handleRunStep}
      />*/}
      {children}
    </>
  )
}