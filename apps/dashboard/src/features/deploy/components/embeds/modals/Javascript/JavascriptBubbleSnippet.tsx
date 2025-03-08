import prettier from 'prettier/standalone'
import parserHtml from 'prettier/parser-html'
import {
  parseApiHostValue,
  parseInitBubbleCode,
  openbotImportCode,
} from '../../snippetParsers'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { BubbleProps } from '@openbot/js2'
import { useAgent } from '@/features/agent/providers/AgentProvider'

type Props = Pick<BubbleProps, 'theme' | 'previewMessage'>

export const JavascriptBubbleSnippet = ({ theme, previewMessage }: Props) => {
  const { agent } = useAgent()

  const snippet = prettier.format(
    `<script type="module">${openbotImportCode}
    
${parseInitBubbleCode({
  agent: agent?.identifier ?? '',
  apiHost: parseApiHostValue(agent?.customDomain),
  theme: {
    ...theme,
    chatWindow: {
      backgroundColor: /*agent?.theme.general.background.content ??*/ '#fff',
    },
  },
  previewMessage,
})}</script>`,
    {
      parser: 'html',
      plugins: [parserHtml],
    }
  )

  return <CodeEditor value={snippet} lang="html" isReadOnly />
}
