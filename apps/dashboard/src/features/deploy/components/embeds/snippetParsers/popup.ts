import { PopupProps } from '@openbot/js2'
import parserBabel from 'prettier/parser-babel'
import prettier from 'prettier/standalone'
import {
  parseBotProps,
  parseNumberOrBoolParam,
  parseReactBotProps,
  parseReactNumberOrBoolParam,
  parseReactStringParam,
  parseStringParam,
} from './shared'

const parsePopupTheme = (theme: PopupProps['theme']): string => {
  if (!theme) return ''
  const { width } = theme
  const widthLine = parseStringParam('width', width)
  const line = `theme: {${widthLine}},`
  if (line === 'theme: {}') return ''
  return line
}

const parsePopupProps = ({
  autoShowDelay,
  theme,
}: Pick<PopupProps, 'theme' | 'autoShowDelay'>) => {
  const autoShowDelayLine = parseNumberOrBoolParam(
    'autoShowDelay',
    autoShowDelay
  )
  const themeLine = parsePopupTheme(theme)
  return `${autoShowDelayLine}${themeLine}`
}

export const parseInitPopupCode = ({
  agent,
  apiHost,
  theme,
  autoShowDelay,
}: PopupProps) => {
  const botProps = parseBotProps({ agent, apiHost })
  const bubbleProps = parsePopupProps({ theme, autoShowDelay })

  return prettier.format(`Openbot.initPopup({${botProps}${bubbleProps}});`, {
    parser: 'babel',
    plugins: [parserBabel],
  })
}

const parseReactThemeProp = (theme: PopupProps['theme']): string => {
  if (!theme) return ''
  const { width } = theme
  const widthProp = parseReactStringParam('width', width)
  if (widthProp === 'theme={{}}') return ''
  return widthProp
}

export const parseReactPopupProps = ({
  agent,
  apiHost,
  theme,
  autoShowDelay,
}: PopupProps) => {
  const botProps = parseReactBotProps({ agent, apiHost })
  const autoShowDelayProp = parseReactNumberOrBoolParam(
    'autoShowDelay',
    autoShowDelay
  )
  const themeProp = parseReactThemeProp(theme)

  return `${botProps} ${autoShowDelayProp} ${themeProp}`
}
