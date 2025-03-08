import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useAgent } from '@/features/agent/providers/AgentProvider'
import { PopupProps } from '@openbot/js2'
import parserBabel from 'prettier/parser-babel'
import prettier from 'prettier/standalone'
import { parseReactPopupProps } from '../../snippetParsers'

export const ReactPopupSnippet = ({
  autoShowDelay,
}: Pick<PopupProps, 'autoShowDelay'>) => {
  const { agent } = useAgent()

  const snippet = prettier.format(
    `import { Popup } from "@openbot/react";

      const App = () => {
        return <Popup ${parseReactPopupProps({
          agent: agent?.identifier ?? '',
          autoShowDelay,
        })}/>;
      }`,
    {
      parser: 'babel',
      plugins: [parserBabel],
    }
  )

  return <CodeEditor value={snippet} lang="javascript" isReadOnly />
}
