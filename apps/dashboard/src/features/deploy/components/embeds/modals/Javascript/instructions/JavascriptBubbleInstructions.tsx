import { useAgent } from '@/features/agent/providers/AgentProvider'
import { Stack, Code, Text } from '@chakra-ui/react'
import { BubbleProps } from '@openbot/js2'
import { Agent } from 'models'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import { JavascriptBubbleSnippet } from '../JavascriptBubbleSnippet'

export const parseDefaultBubbleTheme = (agent?: Agent) => ({
  button: {
    backgroundColor: '#fff' // agent?.theme.chat.buttons.backgroundColor,
  },
})

export const JavascriptBubbleInstructions = () => {
  const { agent } = useAgent()
  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(agent)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  return (
    <Stack spacing={4}>
      <BubbleSettings
        theme={theme}
        previewMessage={previewMessage}
        defaultPreviewMessageAvatar={/*agent?.theme.chat.hostAvatar?.url ?? */''}
        onThemeChange={setTheme}
        onPreviewMessageChange={setPreviewMessage}
      />
      <Text>
        Paste this anywhere in the <Code>{'<body>'}</Code>:
      </Text>
      <JavascriptBubbleSnippet theme={theme} previewMessage={previewMessage} />
    </Stack>
  )
}
