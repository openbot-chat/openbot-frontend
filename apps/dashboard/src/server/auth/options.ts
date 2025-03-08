import { NextAuthOptions } from 'next-auth'
// import Auth0Provider from 'next-auth/providers/auth0'
import { Provider } from 'next-auth/providers'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'
import FacebookProvider from 'next-auth/providers/facebook'
import DiscordProvider from 'next-auth/providers/discord'
import telegramProvider from '@/features/auth/providers/telegram'

// import SmsProvider from '@/lib/auth/providers/sms';
import { customAdapter } from '@/features/auth/api/customAdapter'
import { client } from '@/server/api/openbot-js'



const providers: Provider[] = []

if (
  !!process.env.GITHUB_CLIENT_ID &&
  !!process.env.GITHUB_CLIENT_SECRET
)
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      httpOptions: {
        timeout: 50000,
      }
    })
  )

if (
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET
)
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )

if (
  !!process.env.FACEBOOK_CLIENT_ID &&
  !!process.env.FACEBOOK_CLIENT_SECRET
)
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      httpOptions: {
        timeout: 30000,
      },
    })
  )

if (
  !!process.env.TWITTER_CLIENT_ID &&
  !!process.env.TWITTER_CLIENT_SECRET
)
  providers.push(
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      httpOptions: {
        timeout: 30000,
      },
      version: "2.0",
    })
  )

if (
  !!process.env.DISCORD_CLIENT_ID &&
  !!process.env.DISCORD_CLIENT_SECRET
)
  providers.push(
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      httpOptions: {
        timeout: 30000,
      },
    })
  )

// providers.push(
//   Auth0Provider({
//     id: 'wechat:pc',
//     name: 'Wechat',
//     clientId: process.env.AUTHOK_CLIENT_ID as string,
//     clientSecret: process.env.AUTHOK_CLIENT_SECRET as string,
//     issuer: process.env.AUTHOK_ISSUER,
//     authorization: {
//       params: {
//         // prompt: 'login',
//         scope: "openid email profile offline_access",
//         connection: 'wechat:pc',
//         audience: process.env.AUTHOK_AUDIENCE,
//       }
//     },
//     profile: (profile) => {
//       return {
//         ...profile,
//         id: profile.sub,
//         orgId: profile.orgId,
//         name: profile.nickname,
//         email: profile.email,
//         image: profile.picture,
//       }
//     },
//   }),
// );

/*
providers.push(
  SmsProvider({})
)
*/

/*
if (!!process.env.SMTP_FROM && process.env.SMTP_AUTH_DISABLED !== 'true') {
  console.log('email provider');
  providers.push(
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 25,
        secure: process.env.SMTP_SECURE
          ? process.env.SMTP_SECURE === 'true'
          : false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
    })
  )
}
*/


providers.push(telegramProvider)


export const nextAuthOptions: NextAuthOptions = {
  adapter: customAdapter(client),
  secret: process.env.ENCRYPTION_SECRET || 'secret', // 这里必须提供，不然貌似会生成随机默认值
  pages: {//自定义界面 ，可配置signIn，signOut，error，verifyRequest，newUser
    error: "/auth/signin",
    signIn: '/auth/signin',
  },
  providers,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: async ({ session, token }) => {
      // 默认 session 端点返回的用户信息只包含 name, email, image, 需要在这里自行扩充
      // 参考自这里: https://github.com/nextauthjs/next-auth/blob/b3f544664b05329f0fa78a2da4ae455069b86647/packages/core/src/lib/routes/session.ts
      // console.log('token: ', token);
  
      // console.log('callback session: ', session);
      // console.log('callback token: ', token);
      session.user.id = token.sub as string;
      session.accessToken = token.accessToken as string; // 如果从 Auth0 / Authok 登录, 这里拿到的 access token 可以直接访问 API
      session.orgId = token.org_id as string;
      if (!session.user.email) delete session.user.email; // authok 返回的 email = undefined

      // console.log('callbacks session: ', session)
 
      return session;
    },
    jwt: async ({
      token,
      user,
      account,
      // profile,
      trigger,
      // session,
    }) => {
      if (account) {
        console.log('jwt: ', user);
        token.accessToken = account.access_token as string
      }

      if (trigger === "update") {
        // const userId = token.sub
      }

      return token;
    },
    signIn: async ({ account, user }) => {
      console.log('signIn: ', account)
      
      const userExists = !!user
      if (!account || (process.env.DISABLE_SIGNUP === 'true' && !userExists))
        return false

      return true
    },
    /*
    redirect: ({ url, baseUrl }) => {
      return url;
    },*/
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // 登录成功后回调
    },
    async signOut(message) {
      // TODO authok 注销时，没有注销掉 authok 登录的账号

      console.log('EVENT signOut', message);
    }
  },
  debug: process.env.NODE_ENV !== 'production',
  
  /*
  logger: {
    debug(code, metadata) {
      // 适配日志
      console.log('next-auth debug: ', code, metadata);
    }
  }
  */
};