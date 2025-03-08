'use client'

import { Standard } from '@openbot/react'
import { Agent } from 'models'
import { CSSProperties } from 'react'

export type AgentPageProps = {
  agent: Pick<Agent, 'id' | 'name' | 'avatar' | 'voice'>
  style?: CSSProperties
}

export const AgentPage = ({ agent, style }: AgentPageProps) => {
  return (
    <div
      style={{
        height: '100vh',
        // Set background color to avoid SSR flash
        backgroundColor: '#fff',
        ...style,
      }}
    >
      <Standard agent={agent} showAvatar/>
    </div>
  )
}
