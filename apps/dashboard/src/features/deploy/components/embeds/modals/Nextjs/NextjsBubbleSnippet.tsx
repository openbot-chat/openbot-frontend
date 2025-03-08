import { CodeEditor } from '@/components/inputs/CodeEditor'
import { useAgent } from '@/features/agent/providers/AgentProvider'
import { BubbleProps } from '@openbot/js2'
import parserBabel from 'prettier/parser-babel'
import prettier from 'prettier/standalone'
import { parseReactBubbleProps } from '../../snippetParsers'

export const NextjsBubbleSnippet = ({
  theme,
  previewMessage,
}: Pick<BubbleProps, 'theme' | 'previewMessage'>) => {
  const { agent } = useAgent()

  const snippet = prettier.format(
    `import { Bubble } from "@openbot/nextjs";

      const App = () => {
        return <Bubble ${parseReactBubbleProps({
          agent: agent?.identifier ?? '',
          theme,
          previewMessage,
        })}/>
      }`,
    {
      parser: 'babel',
      plugins: [parserBabel],
    }
  )

  return <CodeEditor value={snippet} lang="javascript" isReadOnly />
}
