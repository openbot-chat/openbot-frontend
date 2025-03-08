import { useCallback, useMemo } from 'react'
import { RunStep, RunStepType } from 'models'
import { useAgent } from '../providers/AgentProvider'



export const useAgentBuilder = () => {
  const { save } = useAgent()

  const handleUpdateAvatar = useCallback(async (thumbnail: string) => {
    await save({
      avatar: {
        type: 'image',
        thumbnail,
        provider: 'dalle',
      },
    })
  }, [save])

  const handleUpdateInstructions = useCallback(async (instructions: string) => {
    await save({
      instructions,
    })
  }, [save])

  const handlers = useMemo(() => ({
    "4c9f1555-09f3-4490-a318-5420e1b38033": handleUpdateAvatar,
    "6d50d3f5-0498-4bd4-9121-b19ccc523f5f": handleUpdateInstructions,
  }), [
    handleUpdateAvatar,
    handleUpdateInstructions,
  ])

  const handleRunStep = useCallback(async (event: RunStep) => {
    if (event.type === RunStepType.tool_calls) {
      if (event.step_details.type === "function") {
        const toolId = event.step_details.function.id
        const handler = handlers[toolId]
        if (handler) {
          await handler(event.step_details.function.output)
        }
      }

    }
  }, [
    handlers,
  ])

  return {
    handleRunStep,
  }
}