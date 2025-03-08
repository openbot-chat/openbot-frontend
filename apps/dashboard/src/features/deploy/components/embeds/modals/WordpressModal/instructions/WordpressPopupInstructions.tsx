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
import { useState } from 'react'
import { PopupSettings } from '../../../settings/PopupSettings'
import { parseInitPopupCode } from '../../../snippetParsers/popup'
import { parseApiHostValue } from '../../../snippetParsers'

type Props = {
  identifier: string
  customDomain?: string
}
export const WordpressPopupInstructions = ({
  identifier,
  customDomain,
}: Props) => {
  const [autoShowDelay, setAutoShowDelay] = useState<number>()

  const initCode = parseInitPopupCode({
    agent: identifier,
    apiHost: parseApiHostValue(customDomain),
    autoShowDelay,
  })

  return (
    <OrderedList spacing={4} pl={5}>
      <ListItem>
        Install{' '}
        <Link
          href="https://wordpress.org/plugins/openbot/"
          isExternal
          color={useColorModeValue('blue.500', 'blue.300')}
        >
          the official Openbot WordPress plugin
          <ExternalLinkIcon mx="2px" />
        </Link>
      </ListItem>
      <ListItem>
        <Stack spacing={4}>
          <PopupSettings
            onUpdateSettings={(settings) =>
              setAutoShowDelay(settings.autoShowDelay)
            }
          />
          <Text>
            You can now place the following code snippet in the Openbot panel in
            your WordPress admin:
          </Text>
          <CodeEditor value={initCode} lang="javascript" isReadOnly />
        </Stack>
      </ListItem>
    </OrderedList>
  )
}
