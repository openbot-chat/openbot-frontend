import type { CookieSerializeOptions } from "cookie"
import { JWTOptions } from "./jwt"
import type {
  OAuth2TokenEndpointResponse,
  OpenIDTokenEndpointResponse,
} from "oauth4webapi"
import { ProviderType } from "./providers"

export type Awaitable<T> = T | PromiseLike<T>


/** @internal */
export interface RequestInternal {
  url: URL
  method: "GET" | "POST"
  cookies?: Partial<Record<string, string>>
  headers?: Record<string, any>
  query?: Record<string, any>
  body?: Record<string, any>
  // action: AuthAction
  // providerId?: string
  error?: string
}


export interface CookieOption {
  name: string
  options: CookieSerializeOptions
}

export interface CookiesOptions {
  sessionToken: Partial<CookieOption>
  callbackUrl: Partial<CookieOption>
  csrfToken: Partial<CookieOption>
  pkceCodeVerifier: Partial<CookieOption>
  state: Partial<CookieOption>
  nonce: Partial<CookieOption>
}

export interface Cookie extends CookieOption {
  value: string
}

export interface InternalOptions {
  jwt: JWTOptions
  cookies: Record<keyof CookiesOptions, CookieOption>
  oauthConfig: object
}

/**
 * Different tokens returned by OAuth Providers.
 * Some of them are available with different casing,
 * but they refer to the same value.
 */
export type TokenSet = Partial<
  OAuth2TokenEndpointResponse | OpenIDTokenEndpointResponse
> & {
  /**
   * Date of when the `access_token` expires in seconds.
   * This value is calculated from the `expires_in` value.
   *
   * @see https://www.ietf.org/rfc/rfc6749.html#section-4.2.2
   */
  expires_at?: number
}



/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
export interface Account extends Partial<OpenIDTokenEndpointResponse> {
  /** Provider's id for this account. Eg.: "google" */
  provider: string
  /**
   * This value depends on the type of the provider being used to create the account.
   * - oauth/oidc: The OAuth account's id, returned from the `profile()` callback.
   * - email: The user's email address.
   * - credentials: `id` returned from the `authorize()` callback
   */
  providerAccountId: string
  /** Provider's type for this account */
  type: ProviderType
  /**
   * id of the user this account belongs to
   *
   * @see https://authjs.dev/reference/core/adapters#user
   */
  userId?: string
  /**
   * Calculated value based on {@link OAuth2TokenEndpointResponse.expires_in}.
   *
   * It is the absolute timestamp (in seconds) when the {@link OAuth2TokenEndpointResponse.access_token} expires.
   *
   * This value can be used for implementing token rotation together with {@link OAuth2TokenEndpointResponse.refresh_token}.
   *
   * @see https://authjs.dev/guides/basics/refresh-token-rotation#database-strategy
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.1
   */
  expires_at?: number
}

/**
 * The user info returned from your OAuth provider.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 */
export interface Profile {
  sub?: string | null
  name?: string | null
  given_name?: string | null
  family_name?: string | null
  middle_name?: string | null
  nickname?: string | null
  preferred_username?: string | null
  profile?: string | null
  picture?: string | null | any
  website?: string | null
  email?: string | null
  email_verified?: boolean | null
  gender?: string | null
  birthdate?: string | null
  zoneinfo?: string | null
  locale?: string | null
  phone_number?: string | null
  updated_at?: Date | string | number | null
  address?: {
    formatted?: string | null
    street_address?: string | null
    locality?: string | null
    region?: string | null
    postal_code?: string | null
    country?: string | null
  } | null
  [claim: string]: unknown
}