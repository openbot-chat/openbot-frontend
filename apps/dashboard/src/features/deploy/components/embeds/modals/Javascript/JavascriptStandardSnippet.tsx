import parserHtml from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import {
  parseApiHostValue,
  parseInitStandardCode,
  openbotImportCode,
} from '../../snippetParsers'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useAgent } from '@/features/agent/providers/AgentProvider'

type Props = {
  widthLabel?: string
  heightLabel?: string
}

export const JavascriptStandardSnippet = ({
  widthLabel,
  heightLabel,
}: Props) => {
  const { agent } = useAgent()

  const snippet = prettier.format(
    `${parseStandardHeadCode(agent?.identifier, agent?.customDomain)}
      ${parseStandardElementCode(widthLabel, heightLabel)}`,
    {
      parser: 'html',
      plugins: [parserHtml],
    }
  )

  return <CodeEditor value={snippet} lang="html" isReadOnly />
}

export const parseStandardHeadCode = (
  identifier?: string | null,
  customDomain?: string | null
) =>
  prettier.format(
    `<script type="module">${openbotImportCode};

${parseInitStandardCode({
  agent: identifier ?? '',
  apiHost: parseApiHostValue(customDomain),
})}</script>`,
    { parser: 'html', plugins: [parserHtml] }
  )

export const parseStandardElementCode = (width?: string, height?: string) => {
  if (!width && !height) return '<openbot-standard></openbot-standard>'
  return prettier.format(
    `<openbot-standard style="${width ? `width: ${width}; ` : ''}${
      height ? `height: ${height}; ` : ''
    }"></openbot-standard>`,
    { parser: 'html', plugins: [parserHtml] }
  )
}
