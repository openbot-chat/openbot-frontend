import { useAgent } from '@/features/agent/providers/AgentProvider'
import { OrderedList, ListItem, Stack, Text, Code } from '@chakra-ui/react'
import { BubbleProps } from '@openbot/js2'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import { parseDefaultBubbleTheme } from '../../Javascript/instructions/JavascriptBubbleInstructions'
import { JavascriptBubbleSnippet } from '../../Javascript/JavascriptBubbleSnippet'

export const ShopifyBubbleInstructions = () => {
  const { agent } = useAgent()

  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(agent)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  return (
    <OrderedList spacing={4} pl={5}>
      <ListItem>
        On your shop dashboard in the <Code>Themes</Code> page, click on{' '}
        <Code>Actions {'>'} Edit code</Code>
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
            In <Code>Layout {'>'} theme.liquid</Code> file, paste this code just
            before the closing <Code>{'<head>'}</Code> tag:
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
