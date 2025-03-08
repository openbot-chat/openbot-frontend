import { hkdf } from "@panva/hkdf"
import { EncryptJWT, jwtDecrypt } from "jose"
import { Awaitable } from "./types.js"
import { parse } from "cookie"

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

const now = () => (Date.now() / 1000) | 0

/** Issues a JWT. By default, the JWT is encrypted using "A256GCM". */
export async function encode<Payload = JWT>(params: JWTEncodeParams<Payload>) {
  const { token = {}, secret, maxAge = DEFAULT_MAX_AGE, salt } = params
  const encryptionSecret = await getDerivedEncryptionKey(secret, salt)
  // @ts-expect-error `jose` allows any object as payload.
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encryptionSecret)
}

/** Decodes a Auth.js issued JWT. */
export async function decode<Payload = JWT>(
  params: JWTDecodeParams
): Promise<Payload | null> {
  const { token, secret, salt } = params
  if (!token) return null
  const encryptionSecret = await getDerivedEncryptionKey(secret, salt)
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  })
  return payload as Payload
}



async function getDerivedEncryptionKey(
  keyMaterial: Parameters<typeof hkdf>[1],
  salt: Parameters<typeof hkdf>[2]
) {
  return await hkdf(
    "sha256",
    keyMaterial,
    salt,
    `Auth.js Generated Encryption Key (${salt})`,
    32
  )
}

export interface DefaultJWT extends Record<string, unknown> {
  name?: string | null
  email?: string | null
  picture?: string | null
  sub?: string
  iat?: number
  exp?: number
  jti?: string
}

/**
 * Returned by the `jwt` callback and `getToken`, when using JWT sessions
 *
 * [`jwt` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback) | [`getToken`](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken)
 */
export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams<Payload = JWT> {
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge?: number
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string
  /** Used in combination with `salt`, to derive the encryption secret for JWTs. */
  secret: string
  /** The JWT payload. */
  token?: Payload
}

export interface JWTDecodeParams {
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string
  /** Used in combination with `salt`, to derive the encryption secret for JWTs. */
  secret: string
  /** The Auth.js issued JWT to be decoded */
  token?: string
}

export interface JWTOptions {
  /**
   * The secret used to encode/decode the Auth.js issued JWT.
   * @internal
   */
  secret: string
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge: number
  /** Override this method to control the Auth.js issued JWT encoding. */
  encode: (params: JWTEncodeParams) => Awaitable<string>
  /** Override this method to control the Auth.js issued JWT decoding. */
  decode: (params: JWTDecodeParams) => Awaitable<JWT | null>
}