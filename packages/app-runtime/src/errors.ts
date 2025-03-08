type ErrorOptions = Error | Record<string, unknown>

type ErrorType =
  | "AdapterError"
  | "AuthorizedCallbackError"
  | "CallbackRouteError"
  | "ErrorPageLoop"
  | "EventError"
  | "InvalidCallbackUrl"
  | "CredentialsSignin"
  | "InvalidEndpoints"
  | "InvalidCheck"
  | "JWTSessionError"
  | "MissingAdapter"
  | "MissingAdapterMethods"
  | "MissingAuthorize"
  | "MissingSecret"
  | "OAuthAccountNotLinked"
  | "OAuthCallbackError"
  | "OAuthProfileParseError"
  | "SessionTokenError"
  | "OAuthSignInError"
  | "EmailSignInError"
  | "SignOutError"
  | "UnknownAction"
  | "UnsupportedStrategy"
  | "InvalidProvider"
  | "UntrustedHost"
  | "Verification"
  | "MissingCSRF"

/**
 * Base error class for all Auth.js errors.
 * It's optimized to be printed in the server logs in a nicely formatted way
 * via the [`logger.error`](https://authjs.dev/reference/core#logger) option.
 */
export class AuthError extends Error {
  /** The error type. Used to identify the error in the logs. */
  type: ErrorType
  /**
   * Determines on which page an error should be handled. Typically `signIn` errors can be handled in-page.
   * Default is `"error"`.
   * @internal
   */
  kind?: "signIn" | "error"
  cause?: Record<string, unknown> & { err?: Error }
  constructor(
    message?: string | Error | ErrorOptions,
    errorOptions?: ErrorOptions
  ) {
    if (message instanceof Error) {
      super(undefined, {
        cause: { err: message, ...(message.cause as any), ...errorOptions },
      })
    } else if (typeof message === "string") {
      if (errorOptions instanceof Error) {
        errorOptions = { err: errorOptions, ...(errorOptions.cause as any) }
      }
      super(message, errorOptions)
    } else {
      super(undefined, message)
    }
    this.name = this.constructor.name
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/3841
    this.type = this.constructor.type ?? "AuthError"
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/3841
    this.kind = this.constructor.kind ?? "error"

    Error.captureStackTrace?.(this, this.constructor)
    const url = `https://errors.authjs.dev#${this.type.toLowerCase()}`
    this.message += `${this.message ? " ." : ""}Read more at ${url}`
  }
}

export class InvalidCheck extends AuthError {
  static type = "InvalidCheck"
}

export class SignInError extends AuthError {
  static kind = "signIn"
}

export class OAuthCallbackError extends SignInError {
  static type = "OAuthCallbackError"
}