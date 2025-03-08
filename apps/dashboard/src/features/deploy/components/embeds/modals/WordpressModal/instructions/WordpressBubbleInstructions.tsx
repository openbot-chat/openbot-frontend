import { CodeEditor } from '@/components/inputs/CodeEditor'
import { ExternalLinkIcon } from '@/components/icons'
import {
  OrderedList,
  ListItem,
  useColorModeValue,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { BubbleProps } from '@openbot/js2'
import { useState } from 'react'
import { BubbleSettings } from '../../../settings/BubbleSettings/BubbleSettings'
import { parseApiHostValue, parseInitBubbleCode } from '../../../snippetParsers'
import { parseDefaultBubbleTheme } from '../../Javascript/instructions/JavascriptBubbleInstructions'
import { useAgent } from '@/features/agent/providers/AgentProvider'

type Props = {
  publicId: string
}
export const WordpressBubbleInstructions = ({ publicId }: Props) => {
  const { agent } = useAgent()

  const [theme, setTheme] = useState<BubbleProps['theme']>(
    parseDefaultBubbleTheme(agent)
  )
  const [previewMessage, setPreviewMessage] =
    useState<BubbleProps['previewMessage']>()

  const initCode = parseInitBubbleCode({
    agent: identifier,
    apiHost: parseApiHostValue(agent?.customDomain),
    theme: {
      ...theme,
      chatWindow: {
        backgroundColor: /*agent?.theme.general.background.content ?? */'#fff',
      },
    },
    previewMessage,
  })

  return (
    <OrderedList spacing={4} pl={5}>
      <ListItem>
        Install{' '}
        <Link
          href="https://wordpress.org/plugins/agent/"
          isExternal
          color={useColorModeValue('blue.500', 'blue.300')}
        >
          the official Agent WordPress plugin
          <ExternalLinkIcon mx="2px" />
        </Link>
      </ListItem>
      <ListItem>
        <Stack spacing={4}>
          <BubbleSettings
            previewMessage={previewMessage}
            defaultPreviewMessageAvatar={
              /*agent?.theme.chat.hostAvatar?.url ??*/''
            }
            theme={theme}
            onPreviewMessageChange={setPreviewMessage}
            onThemeChange={setTheme}
          />
          <Text>
            You can now place the following code snippet in the Agent panel in
            your WordPress admin:
          </Text>
          <CodeEditor value={initCode} lang="javascript" isReadOnly />
        </Stack>
      </ListItem>
    </OrderedList>
  )
}
