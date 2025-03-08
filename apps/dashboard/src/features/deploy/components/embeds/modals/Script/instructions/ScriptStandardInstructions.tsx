import { CodeEditor } from '@/components/inputs/CodeEditor'
import { Stack, Code, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { StandardSettings } from '../../../settings/StandardSettings'
import { parseInitStandardCode } from '../../../snippetParsers/standard'
import { parseStandardElementCode } from '../../Javascript/JavascriptStandardSnippet'
import {
  parseApiHostValue,
  parseInlineScript,
  openbotImportCode,
} from '../../../snippetParsers/shared'
import { useAgent } from '@/features/agent/providers/AgentProvider'

export const ScriptStandardInstructions = () => {
  const { agent } = useAgent()
  const [inputValues, setInputValues] = useState<{
    heightLabel: string
    widthLabel?: string
  }>({
    heightLabel: '100%',
    widthLabel: '100%',
  })

  const standardElementSnippet = parseStandardElementCode(
    inputValues.widthLabel,
    inputValues.heightLabel
  )

  const scriptSnippet = parseInlineScript(`${openbotImportCode}
  
${parseInitStandardCode({
  agent: agent?.identifier ?? '',
  apiHost: parseApiHostValue(agent?.customDomain),
})}`)

  return (
    <Stack spacing={4}>
      <StandardSettings
        onUpdateWindowSettings={(settings) => setInputValues({ ...settings })}
      />
      <Text>
        Make sure you have this <Code>openbot-standard</Code> element in your{' '}
        <Code>{'<body>'}</Code>:
      </Text>
      <CodeEditor isReadOnly value={standardElementSnippet} lang="html" />
      <Text>Then, run this script to initialize the agent:</Text>
      <CodeEditor isReadOnly value={scriptSnippet} lang="javascript" />
    </Stack>
  )
}
