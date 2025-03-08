import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useAgent } from '@/features/agent/providers/AgentProvider'
import parserBabel from 'prettier/parser-babel'
import prettier from 'prettier/standalone'
import { parseReactBotProps } from '../../snippetParsers'

type ReactStandardSnippetProps = { widthLabel?: string; heightLabel: string }

export const ReactStandardSnippet = ({
  widthLabel,
  heightLabel,
}: ReactStandardSnippetProps) => {
  const { agent } = useAgent()
  const snippet = prettier.format(
    `import { Standard } from "@openbot/react";

      const App = () => {
        return <Standard ${parseReactBotProps({
          agent: agent?.identifier ?? '',
        })} style={{width: "${widthLabel}", height: "${heightLabel}"}} />
      }`,
    {
      parser: 'babel',
      plugins: [parserBabel],
    }
  )
  return <CodeEditor value={snippet} lang="javascript" isReadOnly />
}
