import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useAgent } from '@/features/agent/providers/AgentProvider'
import { Stack, Text } from '@chakra-ui/react'
import { BubbleProps } from '@openbot/js2'
import { Agent } from 'models'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import {
  parseInlineScript,
  parseInitBubbleCode,
  openbotImportCode,
  parseApiHostValue,
} from '../../../snippetParsers'

export const parseDefaultBubbleTheme = (agent?: Agent) => ({
  button: {
    backgroundColor: agent?.theme.chat.buttons.backgroundColor,
    iconColor: agent?.theme.chat.buttons.color,
  },
  previewMessage: {
    backgroundColor: agent?.theme.general.background.content ?? 'white',
    textColor: 'black',
  },
})

export const ScriptBubbleInstructions = () => {
  const { agent } = useAgent()
  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(agent)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  const scriptSnippet = parseInlineScript(
    `${openbotImportCode}

${parseInitBubbleCode({
  agent: agent?.identifier ?? '',
  apiHost: parseApiHostValue(agent?.customDomain),
  theme,
  previewMessage,
})}`
  )

  return (
    <Stack spacing={4}>
      <BubbleSettings
        theme={theme}
        previewMessage={previewMessage}
        defaultPreviewMessageAvatar={/*agent?.theme.chat.hostAvatar?.url ?? */''}
        onThemeChange={setTheme}
        onPreviewMessageChange={setPreviewMessage}
      />
      <Text>Run this script to initialize the agent:</Text>
      <CodeEditor isReadOnly value={scriptSnippet} lang="javascript" />
    </Stack>
  )
}
