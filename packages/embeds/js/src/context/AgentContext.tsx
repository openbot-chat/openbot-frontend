import React, { PropsWithChildren, useContext, useState } from 'react'

export type AgentContextValue = {
  agent?: any
  state?: string
  setState: (v: string) => void
}

const AgentContext = React.createContext<AgentContextValue>({
  agent: undefined,
  state: 'idle',
  setState: (v: string) => {}
})


export const AgentProvider: React.FC<PropsWithChildren<Omit<AgentContextValue, 'setState'>>> = ({
  children,
  agent,
  state: _state = 'idle',
}) => {
  const [state, setState] = useState<string>(_state)

  const value = {
    agent,
    state,
    setState,
  }
  
  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  )
}

export const useAgent = () => {
  return useContext(AgentContext)
}