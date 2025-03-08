import { BotProps } from '@openbot/js2'
import parserBabel from 'prettier/parser-babel'
import prettier from 'prettier/standalone'
import { isDefined } from '@openbot/lib'
import { Agent } from "models"
import packageJson from '../../../../../../../../packages/embeds/js/package.json'
import { env } from '@openbot/env'



export const parseStringParam = (
  fieldName: string,
  fieldValue?: string,
  defaultValue?: string
) => {
  if (!fieldValue) return ''
  if (isDefined(defaultValue) && fieldValue === defaultValue) return ''
  return `${fieldName}: "${fieldValue}",`
}

export const parseNumberOrBoolParam = (
  fieldName: string,
  fieldValue?: number | boolean
) => (isDefined(fieldValue) ? `${fieldName}: ${fieldValue},` : ``)

export const parseBotProps = ({ agent, apiHost }: BotProps) => {
  const agentLine = parseStringParam('agent', agent as string)
  const apiHostLine = parseStringParam('apiHost', apiHost)
  return `${agentLine}${apiHostLine}`
}

export const parseReactStringParam = (fieldName: string, fieldValue?: string) =>
  fieldValue ? `${fieldName}="${fieldValue}"` : ``

export const parseReactNumberOrBoolParam = (
  fieldName: string,
  fieldValue?: number | boolean
) => (isDefined(fieldValue) ? `${fieldName}={${fieldValue}}` : ``)

export const parseReactBotProps = ({ agent, apiHost }: BotProps) => {
  const agentLine = parseReactStringParam('agent', agent as string)
  const apiHostLine = parseReactStringParam('apiHost', apiHost)
  return `${agentLine} ${apiHostLine}`
}

export const openbotImportCode = `import Openbot from 'https://cdn.jsdelivr.net/npm/@openbot/js2@${packageJson.version}/dist/web.js'`

export const parseInlineScript = (script: string) =>
  prettier.format(
    `const openbotInitScript = document.createElement("script");
  openbotInitScript.type = "module";
  openbotInitScript.innerHTML = \`${script}\`;
  document.body.append(openbotInitScript);`,
    { parser: 'babel', plugins: [parserBabel] }
  )

export const parseApiHost = (
  customDomain: Agent['customDomain'] | undefined
) => {
  if (customDomain) return new URL(`https://${customDomain}`).origin  
  return env.NEXT_PUBLIC_VIEWER_URL.at(1) ?? env.NEXT_PUBLIC_VIEWER_URL[0]
}

export const parseApiHostValue = (
  customDomain: Agent['customDomain'] | undefined
) => {
  return parseApiHost(customDomain)
}
