import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useAgent } from '@/features/agent/providers/AgentProvider'
import { Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { PopupSettings } from '../../../settings/PopupSettings'
import { parseInitPopupCode } from '../../../snippetParsers'
import {
  parseApiHostValue,
  parseInlineScript,
  openbotImportCode,
} from '../../../snippetParsers/shared'

export const ScriptPopupInstructions = () => {
  const { agent } = useAgent()
  const [inputValue, setInputValue] = useState<number>()

  const scriptSnippet = parseInlineScript(
    `${openbotImportCode}

${parseInitPopupCode({
  agent: agent?.identifier ?? '',
  apiHost: parseApiHostValue(agent?.customDomain),
  autoShowDelay: inputValue,
})}`
  )

  return (
    <Stack spacing={4}>
      <PopupSettings
        onUpdateSettings={(settings) => setInputValue(settings.autoShowDelay)}
      />
      <Text>Run this script to initialize the agent:</Text>
      <CodeEditor isReadOnly value={scriptSnippet} lang="javascript" />
    </Stack>
  )
}
