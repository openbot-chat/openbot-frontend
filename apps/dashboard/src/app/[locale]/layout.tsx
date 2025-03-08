import '../../../styles/main.css'
import React from 'react'

import { getServerSession } from 'next-auth'
import { nextAuthOptions } from "@/server/auth/options"
import SessionProvider from '@/components/SessionProvider'
import { ClientProvider } from '@/context/ClientProvider'
import { UIContainer } from '@/components/UIContainer'
import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'


import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { UserProvider } from '@/features/user/UserProvider'
import Script from 'next/script'


dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)



/*
https://github.com/homanp/superagent/blob/def0652210cbea9b2d3d8343698f758f3756afa1/ui/app/_components/providers.js

这里有关于 vercel analytics 上报用户身份的逻辑
另外 superagent 基于 saas-ui. 这个可以挖一挖
*/

/*
export function generateStaticParams() {
  return [
    { locale: 'en-US' }, 
    { locale: 'zh-CN' }
  ];
}
*/

type Props = {
  children: React.ReactNode
  params: { locale: string; }
  searchParams: { callbackUrl: string; }
}

// export const dynamic='force-dynamic'

export default async function RootLayout({
  children,
  params: {
    locale,
  },
}: Props) {
  let messages
  try {
    messages = (await import(`../../lib/i18n/locales/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  const session = await getServerSession(nextAuthOptions)

  /*const providers = nextAuthOptions.providers.map(it => ({
    id: it.options?.id ?? it.id,
    name: it.options?.name ?? it.name,
  }))*/

  return (
    <html lang={locale} translate="no" suppressHydrationWarning>
      <head>
        <title>Openbot</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/*<Script strategy="beforeInteractive" type="text/javascript" src="/__ENV.js" />*/}
        <script type="text/javascript" src="/__ENV.js" />
      </head>
      <body>
        <SessionProvider 
          session={session}
          // Re-fetches session when window is focused
        >
          <ClientProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <UIContainer locale={locale}>
                <UserProvider>
                  {children}
                  {/*!session ? (
                  <SignInPage providers={providers} />
                  ) : children*/}
                </UserProvider>
              </UIContainer>
            </NextIntlClientProvider>
          </ClientProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
};