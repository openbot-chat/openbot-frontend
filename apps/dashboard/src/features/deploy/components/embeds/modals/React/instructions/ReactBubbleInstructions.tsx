import { ListItem, OrderedList, Stack, Text } from '@chakra-ui/react'
import { BubbleProps } from '@openbot/js2'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import { InstallReactPackageSnippet } from '../InstallReactPackageSnippet'
import { ReactBubbleSnippet } from '../ReactBubbleSnippet'
import { parseDefaultBubbleTheme } from '../../Javascript/instructions/JavascriptBubbleInstructions'
import { useAgent } from '@/features/agent/providers/AgentProvider'

export const ReactBubbleInstructions = () => {
  const { agent } = useAgent()
  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(agent)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  return (
    <OrderedList spacing={4} pl={5}>
      <ListItem>
        <Stack spacing={4}>
          <Text>Install the packages</Text>
          <InstallReactPackageSnippet />
        </Stack>
      </ListItem>
      <ListItem>
        <Stack spacing={4}>
          <BubbleSettings
            theme={theme}
            previewMessage={previewMessage}
            defaultPreviewMessageAvatar={
              /*agent?.theme.chat.hostAvatar?.url ?? */''
            }
            onThemeChange={setTheme}
            onPreviewMessageChange={setPreviewMessage}
          />
          <ReactBubbleSnippet theme={theme} previewMessage={previewMessage} />
        </Stack>
      </ListItem>
    </OrderedList>
  )
}
