import React, { useEffect } from 'react'
import 'assets/style.css'
import { ChakraProvider } from '@chakra-ui/react'
import 'focus-visible/dist/focus-visible'
import { theme } from '../lib/chakraTheme'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { appWithTranslation } from "next-i18next";

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    AOS.init({
      easing: 'ease',
      duration: 1000,
      once: true,
    })
  }, [])

  // TODO 临时处理 Type error: 'Component' cannot be used as a JSX component.
  const Comp = Component as any

  return (
    <ChakraProvider theme={theme}>
      <Comp {...pageProps} />
      <Analytics />
    </ChakraProvider>
  )
}

export default appWithTranslation(App)
