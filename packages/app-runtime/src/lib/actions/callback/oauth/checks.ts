import * as jose from "jose"
import * as o from "oauth4webapi"
import { decode, encode } from "../../../../jwt"
import { Cookie, CookiesOptions, InternalOptions, RequestInternal } from "../../../../types"
import { InvalidCheck } from "../../../../errors"



interface CheckPayload {
  value: string
}



/** Returns a signed cookie. */
export async function signCookie(
  type: keyof CookiesOptions,
  value: string,
  maxAge: number,
  options: InternalOptions,
  data?: any
): Promise<Cookie> {
  const { cookies } = options

  // logger.debug(`CREATE_${type.toUpperCase()}`, { value, maxAge })

  const expires = new Date()
  expires.setTime(expires.getTime() + maxAge * 1000)
  const token: any = { value }
  if (type === "state" && data) token.data = data
  const name = cookies[type].name

  return {
    name,
    value: await encode({ ...options.jwt, maxAge, token, salt: name }),
    options: { ...cookies[type].options, expires },
  }
}

const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const pkce = {
  async create(options: InternalOptions) {
    const code_verifier = o.generateRandomCodeVerifier()
      const value = await o.calculatePKCECodeChallenge(code_verifier)
      const maxAge = PKCE_MAX_AGE
      const cookie = await signCookie(
        "pkceCodeVerifier",
        code_verifier,
        maxAge,
        options
      )
      return { cookie, value }
  },
  /**
   * Returns code_verifier if the provider is configured to use PKCE,
   * and clears the container cookie afterwards.
   * An error is thrown if the code_verifier is missing or invalid.
   * @see https://www.rfc-editor.org/rfc/rfc7636
   * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#pkce
   */
  async use(
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[],
    options: InternalOptions
  ): Promise<string | undefined> {
    const { oauthConfig } = options
  
    if (!oauthConfig?.enablePkce) return
    
    const codeVerifier = cookies?.[options.cookies.pkceCodeVerifier.name]
  
    if (!codeVerifier)
      throw new InvalidCheck("PKCE code_verifier cookie was missing.")
  
    const value = await decode<CheckPayload>({
      ...options.jwt,
      token: codeVerifier,
      salt: options.cookies.pkceCodeVerifier.name,
    })
  
    if (!value?.value)
      throw new InvalidCheck("PKCE code_verifier value could not be parsed.")
  
    // Clear the pkce code verifier cookie after use
    resCookies.push({
      name: options.cookies.pkceCodeVerifier.name,
      value: "",
      options: { ...options.cookies.pkceCodeVerifier.options, maxAge: 0 },
    })
  
    return value.value
  },
}

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export function decodeState(value: string):
  | {
      /** If defined, a redirect proxy is being used to support multiple OAuth apps with a single callback URL */
      origin?: string
      /** Random value for CSRF protection */
      random: string
    }
  | undefined {
  try {
    const decoder = new TextDecoder()
    return JSON.parse(decoder.decode(jose.base64url.decode(value)))
  } catch {}
}

export const state = {
  async create(options: InternalOptions, data?: object) {
    const encodedState = jose.base64url.encode(
      JSON.stringify({ ...data, random: o.generateRandomState() })
    )

    const maxAge = STATE_MAX_AGE
    const cookie = await signCookie(
      "state",
      encodedState,
      maxAge,
      options,
      data
    )
    return { cookie, value: encodedState }
  },
  /**
   * Returns state if the provider is configured to use state,
   * and clears the container cookie afterwards.
   * An error is thrown if the state is missing or invalid.
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-10.12
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1
   */
  async use(
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[],
    options: InternalOptions,
    paramRandom?: string
  ): Promise<string | undefined> {
    const state = cookies?.[options.cookies.state.name]

    if (!state) throw new InvalidCheck("State cookie was missing.")

    // IDEA: Let the user do something with the returned state
    const encodedState = await decode<CheckPayload>({
      ...options.jwt,
      token: state,
      salt: options.cookies.state.name,
    })

    if (!encodedState?.value)
      throw new InvalidCheck("State (cookie) value could not be parsed.")

    const decodedState = decodeState(encodedState.value)

    if (!decodedState)
      throw new InvalidCheck("State (encoded) value could not be parsed.")

    if (decodedState.random !== paramRandom)
      throw new InvalidCheck(
        `Random state values did not match. Expected: ${decodedState.random}. Got: ${paramRandom}`
      )

    // Clear the state cookie after use
    resCookies.push({
      name: options.cookies.state.name,
      value: "",
      options: { ...options.cookies.state.options, maxAge: 0 },
    })

    return encodedState.value
  },
}




export function handleState(
  query: RequestInternal["query"],
  // isOnRedirectProxy: InternalOptions["isOnRedirectProxy"]
) {
  let randomState: string | undefined
  let proxyRedirect: string | undefined

  if (/*provider.redirectProxyUrl && */!query?.state) {
    throw new InvalidCheck(
      "Missing state in query, but required for redirect proxy"
    )
  }

  const state = decodeState(query?.state)
  randomState = state?.random

  /*if (isOnRedirectProxy) {
    if (!state?.origin) return { randomState }
    proxyRedirect = `${state.origin}?${new URLSearchParams(query)}`
  }*/

  return { randomState, proxyRedirect }
}