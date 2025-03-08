"use client"
import { CacheProvider } from '@chakra-ui/next-js'
import { ColorModeScript, ChakraProvider, createStandaloneToast, localStorageManager } from '@chakra-ui/react'
import { customTheme } from '@/lib/theme'
import { useDayjsLocale } from '@/hooks/useDayjsLocale'

type Props = {
  locale: string
  children: React.ReactNode
}

const { ToastContainer } = createStandaloneToast(customTheme)

export const UIContainer = ({
  locale,
  children,
}: Props) => {
  useDayjsLocale(locale)

  return (
    <>
      <ColorModeScript type="localStorage" initialColorMode={customTheme.config.initialColorMode} />
      <CacheProvider>
        <ChakraProvider theme={customTheme} colorModeManager={localStorageManager}>
          <ToastContainer />
          {children}
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}