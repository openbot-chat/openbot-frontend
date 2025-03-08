import { NextRequest, NextResponse } from "next/server"
import { client } from '@/server/api/openbot-js'
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "@/server/auth/options"
import { cookies } from "next/headers"
import { Cookie, Profile, makeRequest } from '@openbot/app-runtime'
import * as checks from '@openbot/app-runtime/src/lib/actions/callback/oauth/checks'
import { Account, TokenSet } from '@openbot/app-runtime'
import { parse as parseCookie } from "cookie"
import * as o from "oauth4webapi"
import { OAuthCallbackError } from "@openbot/app-runtime/src/errors"
import { 
  client as openbotClient,
} from '@/server/api/openbot-js';
import { Credentials } from "models"


const render = (credentials: Credentials) => `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <style type="text/css" media="screen">
      html {
        line-height: 1;
      }
      
      ol, ul {
        list-style: none;
      }
      
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      
      caption, th, td {
        text-align: left;
        font-weight: normal;
        vertical-align: middle;
      }
      
      q, blockquote {
        quotes: none;
      }
      
      q:before, q:after, blockquote:before, blockquote:after {
        content: "";
        content: none;
      }
      
      a img {
        border: none;
      }
      
      article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section, summary {
        display: block;
      }
    
      html, body {
        background-color: #F0F0F0;
        text-align: center;
        font-family: 'Open Sans', Helvetica, arial, sans-serif;
        color: #333;
      }
  
      h1 {
          font-size: 30px;
          font-weight: 300;
          color: #666;
          margin: 0 0 20px;
          -webkit-font-smoothing: antialiased;
      }
  
      p {
        font-size: 18px;
        font-weight: 300;
        margin: 20px 0;
      }
  
      .logo {
        margin: 40px;
      }
  
      .logo img {
        width: 50px;
        height: 50px;
      }
  
      a.orange {
        background-color: rgb(255, 92, 26);
        border-bottom-color: rgb(255, 92, 26);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-image-outset: 0px;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-left-color: rgb(255, 92, 26);
        border-left-style: solid;
        border-left-width: 1px;
        border-right-color: rgb(255, 92, 26);
        border-right-style: solid;
        border-right-width: 1px;
        border-top-color: rgb(255, 92, 26);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-top-style: solid;
        border-top-width: 1px;
        box-sizing: border-box;
        color: rgb(255, 255, 255);
        cursor: pointer;
        display: inline-block;
        font-family: 'Open Sans', Helvetica, arial, sans-serif;
        font-size: 14px;
        height: 40px;
        line-height: 14px;
        margin-bottom: 0px;
        margin-left: 0px;
        margin-right: 0px;
        margin-top: 0px;
        padding-bottom: 12px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 12px;
        text-decoration: none solid rgb(255, 255, 255);
        text-shadow: rgb(230, 67, 0) 0px -1px 0px;
        vertical-align: baseline;
        white-space: nowrap;
      }
  
      a.white {
        background-color: rgb(245, 245, 245);
        background-image: -webkit-linear-gradient(top, rgb(255, 255, 255), rgb(245, 245, 245));
        border-bottom-color: rgb(214, 214, 214);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-image-outset: 0px;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-left-color: rgb(214, 214, 214);
        border-left-style: solid;
        border-left-width: 1px;
        border-right-color: rgb(214, 214, 214);
        border-right-style: solid;
        border-right-width: 1px;
        border-top-color: rgb(214, 214, 214);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-top-style: solid;
        border-top-width: 1px;
        box-sizing: border-box;
        color: rgb(85, 85, 85);
        cursor: pointer;
        display: inline-block;
        font-family: 'Open Sans', Helvetica, arial, sans-serif;
        font-size: 14px;
        height: 40px;
        line-height: 14px;
        margin-bottom: 0px;
        margin-left: 0px;
        margin-right: 0px;
        margin-top: 0px;
        padding-bottom: 12px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 12px;
        text-align: left;
        text-decoration: none solid rgb(85, 85, 85);
        text-shadow: rgb(255, 255, 255) 0px 1px 0px;
        vertical-align: baseline;
        white-space: nowrap;
      }
  
      .message{
        padding: 0 0 20px;
      }
    </style>
  </head>
  <body>
    <div class="logo">
      <img src="" title="Openbot logo"></img>
    </div>
  
    <div class="message">
      <h1>Success!</h1>
      <p>Your account has been successfully connected to Openbot. Please go to <a href="https://dashboard.openbot.chat/credentials">Credentials</a> to get started.</p>
    </div>
  
    <script type="text/javascript">
      // Make sure this code works even if no authentication context is provided,
      // because for google 1-click auth, it's not applicable.
      try {
        window.opener.postMessage(
          {
            type: 'success',
            credentialsId: '${credentials.id}',
          },
          '*'
        );
      } catch (err) {
        console.log(err);
      }
      window.close();
    </script>  
  </body>
</html>
`



export async function GET(
  request: NextRequest,
  { params: { connection_id } }: { params: { connection_id: string } },
) {
  const session = await getServerSession(nextAuthOptions)

  // 1. 判断当前是否登录态
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const connection = await client.connections().get(connection_id)
  if (!connection) notFound() // TODO 看 nextjs-auth 里头是抛出的什么异常
  
  const app = await client.apps().get(connection.app_id)
  if (!app) notFound() // TODO 看 nextjs-auth 里头是抛出的什么异常

  // 2. 判断 app 是否为当前用户的租户
  const member = await client.orgs().getMember(app.org_id, session.user.id)

  if (!member) {
    return NextResponse.json({}, { status: 401 })
  }
  
  // 3. 根据 app 的 connection 构造 url

  if (connection.type === 'oauth2') {
    const { oauthConfig, secrets } = connection.options ?? {}

    const redirect_uri = `${request.nextUrl.origin}/api/connection/${connection.id}/callback`


    console.warn('request: ', request.nextUrl.searchParams)
  
    console.log('connection: ', oauthConfig)

    const cookies = parseCookie(request.headers.get("cookie") ?? "") ?? {}
    const query = Object.fromEntries(request.nextUrl.searchParams)

    const options = {
      jwt: {
        secret: process.env.ENCRYPTION_SECRET,
      },
      oauthConfig,
      cookies: {
        state: {
          name: 'state',
          options: {},
        },
        pkceCodeVerifier: {
          name: 'pkceCodeVerifier',
          options: {}
        }
      }
    }

    const { proxyRedirect, randomState } = checks.handleState(query)


    const bundle = {
      secrets,
      inputData: {
        state: randomState,
        redirect_uri,
      }
    }


    const client: o.Client = {
      client_id: bundle.secrets.clientId,
      client_secret: bundle.secrets.clientSecret,
    }

    const resCookies: Cookie[] = []

    const state = await checks.state.use(
      cookies,
      resCookies,
      options,
      randomState,
    )

    console.log('decoded state: ', state)

    const as = {
      issuer: "https://authjs.dev",
      token_endpoint: oauthConfig.token?.url,
      userinfo_endpoint: oauthConfig.user?.url,
    }

    const codeGrantParams = o.validateAuthResponse(
      as,
      client,
      request.nextUrl.searchParams,
      state
    ) 

     /** https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1 */
    if (o.isOAuth2Error(codeGrantParams)) {
      const cause = { providerId: provider.id, ...codeGrantParams }
      // logger.debug("OAuthCallbackError", cause)
      throw new OAuthCallbackError("OAuth Provider returned an error", cause)
    }

    const codeVerifier = await checks.pkce.use(cookies, resCookies, options)


    const html1 = render({ id: 'c1' })

    return new NextResponse(html1, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      }
    })


    const codeGrantResponse = await o.authorizationCodeGrantRequest(
      as,
      client,
      codeGrantParams,
      redirect_uri,
      codeVerifier ?? "auth" // TODO: review fallback code verifier
    )

    console.warn("codeGrantResponse: ", codeGrantResponse)


    let challenges: o.WWWAuthenticateChallenge[] | undefined
    if ((challenges = o.parseWwwAuthenticateChallenges(codeGrantResponse))) {
      for (const challenge of challenges) {
        console.log("challenge", challenge)
      }
      throw new Error("TODO: Handle www-authenticate challenges as needed")
    }


    let profile: Profile = {}
    const tokens: TokenSet & Pick<Account, "expires_at"> = await o.processAuthorizationCodeOAuth2Response(
      as,
      client,
      codeGrantResponse
    )
    if (o.isOAuth2Error(tokens as any)) {
      console.log("error", tokens)
      throw new Error("TODO: Handle OAuth 2.0 response body error")
    }

    
    if (oauthConfig.userinfo && oauthConfig.userinfo.url) {
      const _profile = await makeRequest(oauthConfig.userinfo)
      if (_profile instanceof Object) profile = _profile
    } 
    /*else {
      const userinfoResponse = await o.userInfoRequest(
        as,
        client,
        (tokens as any).access_token
      )
      profile = await userinfoResponse.json()
    } else {
      throw new TypeError("No userinfo endpoint configured")
    }
    */
    
    if (tokens.expires_in) {
      tokens.expires_at =
        Math.floor(Date.now() / 1000) + Number(tokens.expires_in)
    }

    // create credentials
    const credentials = await openbotClient.credentials().create({
      name: profile.name ? `${connection.name}-${profile.name}` : connection.name,
      type: connection.identifier,
      data: tokens,
      org_id: app.org_id, // TODO 这里要为当前 org_id
    })

    const html = render(credentials)

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      }
    })
  }

  return new NextResponse("OK", { status: 200 })
}