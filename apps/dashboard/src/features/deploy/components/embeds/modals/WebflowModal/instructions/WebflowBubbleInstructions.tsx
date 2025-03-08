import { useAgent } from '@/features/agent/providers/AgentProvider'
import { OrderedList, ListItem, Code, Stack, Text } from '@chakra-ui/react'
import { BubbleProps } from '@openbot/js2'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import { parseDefaultBubbleTheme } from '../../Javascript/instructions/JavascriptBubbleInstructions'
import { JavascriptBubbleSnippet } from '../../Javascript/JavascriptBubbleSnippet'

export const WebflowBubbleInstructions = () => {
  const { agent } = useAgent()

  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(agent)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  return (
    <OrderedList spacing={4} pl={5}>
      <ListItem>
        Press <Code>A</Code> to open the <Code>Add elements</Code> panel
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
          <Text>
            Add an <Code>Embed</Code> element from the <Code>components</Code>{' '}
            section and paste this code:
          </Text>
          <JavascriptBubbleSnippet
            theme={theme}
            previewMessage={previewMessage}
          />
        </Stack>
      </ListItem>
    </OrderedList>
  )
}
