import parserHtml from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import {
  parseApiHostValue,
  parseInitPopupCode,
  openbotImportCode,
} from '../../snippetParsers'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { PopupProps } from '@openbot/js2'
import { useAgent } from '@/features/agent/providers/AgentProvider'

type Props = Pick<PopupProps, 'autoShowDelay'>

export const JavascriptPopupSnippet = ({ autoShowDelay }: Props) => {
  const { agent } = useAgent()
  const snippet = prettier.format(
    createSnippet({
      agent: agent?.identifier ?? '',
      apiHost: parseApiHostValue(agent?.customDomain),
      autoShowDelay,
    }),
    {
      parser: 'html',
      plugins: [parserHtml],
    }
  )
  return <CodeEditor value={snippet} lang="html" isReadOnly />
}

const createSnippet = (params: PopupProps): string => {
  const jsCode = parseInitPopupCode(params)
  return `<script type="module">${openbotImportCode}

${jsCode}</script>`
}
