import { Liquid } from 'liquidjs'
import { InternalOptions } from "../../../types"



export async function getAuthorizationUrl(
  bundle: object,
  options: InternalOptions
) {
  const engine = new Liquid()

  const { oauthConfig } = options  

  const url = new URL(oauthConfig.authorize.url)
  // "https://uim.cn.authok.cn/authorize?client_id=ywLYFm4cfOZ2UQDMtqgHxNQA65JojWDL&state=&redirect_uri=https%3A%2F%2Fzapier.com%2Fdashboard%2Fauth%2Foauth%2Freturn%2FApp194922CLIAPI%2F&response_type=code&scope=openid"

  await Promise.all(Object.entries(oauthConfig.authorize.params ?? {}).map(async ([k ,v]) => {
    // variables
    const value = await engine.parseAndRender(v, { bundle })
    url.searchParams.set(k, value)
    console.warn('param: ', k, value)
  }))

  url.searchParams.set('response_type', 'code')

  return { url }
}