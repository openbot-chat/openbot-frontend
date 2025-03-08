import { NextRequest, NextResponse } from "next/server"
import { client } from '@/server/api/openbot-js'
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "@/server/auth/options"
import { cookies } from "next/headers"
import { getAuthorizationUrl, Cookie } from '@openbot/app-runtime'
import * as checks from '@openbot/app-runtime/src/lib/actions/callback/oauth/checks'


export async function GET(
  request: NextRequest,
  { params: { 
    connection_id,
  } }: { 
    params: { 
      connection_id: string
    } },
) {
  const session = await getServerSession(nextAuthOptions)

  // 1. 判断当前是否登录态
  if (!session?.user) {
    return NextResponse.json({}, { status: 401 })
  }

  const orgId = request.nextUrl.searchParams.get('orgId')


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

    const _cookies: Cookie[] = []

    const redirect_uri = `${request.nextUrl.origin}/api/connection/${connection.id}/callback`

  
    console.log('connection: ', oauthConfig.authorize)


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

    // TODO 参考 next-auth 的state如何构造，同时对比下 zapier的格式
    const state = await checks.state.create(options, {
      orgId,
      // TODO cid,
    })
    // TODO 从环境变量 / host 读取 host

    if (state) {
      _cookies.push(state.cookie)
    }

    const bundle = {
      secrets,
      inputData: {
        state: state.value,
        redirect_uri,
      }
    }

    const { url } = await getAuthorizationUrl(bundle, options)

    if (oauthConfig.enablePkce === true) {
      const { value, cookie } = await checks.pkce.create(options)
      url.searchParams.set('code_challenge', value)
      url.searchParams.set('code_challenge_method', 'S256')
  
      _cookies.push(cookie)
    }

    for (const cookie of _cookies) {
      console.log('cookie: ', cookie)
      cookies().set(cookie.name, cookie.value, cookie.options)
    }

    /*
    return NextResponse.json({
      url: url.toString(),
    }, { status: 200 })
    */
    
    return NextResponse.redirect(url)
  }

  return new NextResponse("OK", { status: 200 })
}