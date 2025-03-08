"use client"
import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
import { useRouter, usePathname } from '@/navigation'
import { useContext, createContext, ReactNode, useEffect, useState } from 'react'
import { isDefined, isNotDefined } from '@openbot/lib'
import { User } from 'models'
import { setUser as setSentryUser } from '@sentry/nextjs'
import { useToast } from '@/hooks/useToast'
import { useDebouncedCallback } from 'use-debounce'
import { env } from '@openbot/env'
import { identifyUser } from '../telemetry/posthog'
import { useColorMode } from '@chakra-ui/react'
import { trpc } from '@/utils/trpc-client'

export const userContext = createContext<{
  user?: User
  isLoading: boolean
  currentOrganizationId?: string
  updateUser: (newUser: Partial<User>) => void
}>({
  isLoading: false,
  updateUser: () => {
    console.log('updateUser not implemented')
  },
})

const debounceTimeout = 1000

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | undefined>()
  const { showToast } = useToast()
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string>()
  const { setColorMode } = useColorMode()
  const updateUserMutation = trpc.user.update.useMutation()

  useEffect(() => {
    if (
      !user?.options?.preferredAppAppearance ||
      user.options?.preferredAppAppearance === 'system'
    )
      return
    const currentColorScheme = localStorage.getItem('chakra-ui-color-mode') as
      | 'light'
      | 'dark'
      | null
    if (currentColorScheme === user.options?.preferredAppAppearance) return
    setColorMode(user.options.preferredAppAppearance)
  }, [setColorMode, user?.options?.preferredAppAppearance])

  useEffect(() => {
    if (isDefined(user) || isNotDefined(session)) return
    setCurrentOrganizationId(
      localStorage.getItem('currentOrganizationId') ?? undefined
    )
    const parsedUser = session.user as User
    setUser(parsedUser)

    if (parsedUser?.id) {
      setSentryUser({ id: parsedUser.id })
      identifyUser(parsedUser.id)
    }
  }, [session, user])

  useEffect(() => {
    // if (!router.isReady) return
    if (status === 'loading') return
    const isSigningIn = () => ['/auth/signin', '/auth/signup'].includes(pathname)
    if (!user && status === 'unauthenticated' && !isSigningIn())
      router.replace(`/auth/signin?callbackUrl=${pathname}`)
  }, [router, pathname, status, user])

  const updateUser = (updates: Partial<User>) => {
    if (isNotDefined(user)) return
    const newUser = { ...user, ...updates }
    setUser(newUser)
    saveUser(newUser)
  }

  const saveUser = useDebouncedCallback(
    async (newUser?: Partial<User>) => {
      if (isNotDefined(user)) return
      const { error } = await updateUserMutation.mutateAsync({ ...user, ...newUser })
      if (error) showToast({ title: error.name, description: error.message })
      await refreshUser()
    },
    env.NEXT_PUBLIC_E2E_TEST ? 0 : debounceTimeout
  )

  useEffect(() => {
    return () => {
      saveUser.flush()
    }
  }, [saveUser])

  return (
    <userContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        currentOrganizationId,
        updateUser,
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export const refreshUser = async () => {
  await fetch('/api/auth/session?update')
  reloadSession()
}

const reloadSession = () => {
  const event = new Event('visibilitychange')
  document.dispatchEvent(event)
}



export const useUser = () => useContext(userContext)
