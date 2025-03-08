import { BotProps } from '@openbot/js2'
import parserBabel from 'prettier/parser-babel'
import prettier from 'prettier/standalone'
import { parseBotProps } from './shared'

export const parseInitStandardCode = ({
  agent,
  apiHost,
}: Pick<BotProps, 'agent' | 'apiHost'>) => {
  const botProps = parseBotProps({ agent, apiHost })

  return prettier.format(`Openbot.initStandard({${botProps}});`, {
    parser: 'babel',
    plugins: [parserBabel],
  })
}
