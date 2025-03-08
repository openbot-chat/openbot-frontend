import { FlexProps } from '@chakra-ui/react'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import prettier from 'prettier/standalone'
import parserHtml from 'prettier/parser-html'
import { useAgent } from '@/features/agent/providers/AgentProvider'
import { env } from '@openbot/env'



type Props = {
  widthLabel: string
  heightLabel: string
  onCopied?: () => void
} & FlexProps

export const IframeSnippet = ({ widthLabel, heightLabel }: Props) => {
  const { agent } = useAgent()
  const src = `${env.NEXT_PUBLIC_VIEWER_URL[0]}/${agent?.identifier}`
  console.warn('src: ', agent)
  const code = prettier.format(
    `<iframe src="${src}" style="border: none; width='${widthLabel}'; height='${heightLabel}'"></iframe>`,
    { parser: 'html', plugins: [parserHtml] }
  )

  return <CodeEditor value={code} lang="html" isReadOnly />
}
