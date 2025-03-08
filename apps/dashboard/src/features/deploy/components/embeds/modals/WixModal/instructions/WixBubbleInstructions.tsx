import { useAgent } from '@/features/agent/providers/AgentProvider'
import { OrderedList, ListItem, Code, Stack, Text } from '@chakra-ui/react'
import { BubbleProps } from '@openbot/js2'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import { parseDefaultBubbleTheme } from '../../Javascript/instructions/JavascriptBubbleInstructions'
import { JavascriptBubbleSnippet } from '../../Javascript/JavascriptBubbleSnippet'

export const WixBubbleInstructions = () => {
  const { agent } = useAgent()

  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(agent)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  return (
    <OrderedList spacing={4} pl={5}>
      <ListItem>
        Go to <Code>Settings</Code> in your dashboard on Wix
      </ListItem>
      <ListItem>
        Click on <Code>Custom Code</Code> under <Code>Advanced</Code>
      </ListItem>
      <ListItem>
        Click <Code>+ Add Custom Code</Code> at the top right.
      </ListItem>
      <ListItem>
        <Stack spacing={4}>
          <BubbleSettings
            previewMessage={previewMessage}
            defaultPreviewMessageAvatar={
              /*agent?.theme.chat.hostAvatar?.url ?? */''
            }
            theme={theme}
            onPreviewMessageChange={setPreviewMessage}
            onThemeChange={setTheme}
          />
          <Text> Paste this snippet in the code box:</Text>
          <JavascriptBubbleSnippet
            theme={theme}
            previewMessage={previewMessage}
          />
        </Stack>
      </ListItem>
      <ListItem>
        Select &quot;Body - start&quot; under <Code>Place Code in</Code>
      </ListItem>
      <ListItem>Click Apply</ListItem>
    </OrderedList>
  )
}
