import {
  createContext,
  PropsWithChildren,
  useEffect,
  useCallback,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from 'react'
import { useToast } from '@/hooks/useToast'
import { trpc } from "@/utils/trpc-client"
import { App } from 'models'
import { parseDefaultPublicId } from '@/features/deploy/helpers/parseDefaultPublicId'
import { isDefined } from '@openbot/lib'
import { useTranslations } from 'next-intl'

export type AppContextProps = {
  app?: App
  save: (data: Omit<App, 'id' | 'created' | 'updated'>) => Promise<void>
  isFetchingApp: boolean
  isSavingLoading: boolean
  refetch: () => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AppContext = createContext<AppContextProps>({})

type Props = {
  appId?: string
}

export const AppProvider = ({
  children,
  appId,
}: PropsWithChildren<Props>) => {
  const t = useTranslations()
  const [localApp, setLocalApp] = useState<App | undefined>(undefined)
  const { 
    data: app, 
    isLoading: isFetchingApp, 
    refetch: refetchApp,
  } = trpc.app.details.useQuery(appId, { 
    enabled: !!appId,
    refetchOnWindowFocus: false, // TODO
  })

  const { showToast } = useToast()

  useEffect(() => {
    if (!app && isDefined(localApp)) setLocalApp(undefined)
    if (isFetchingApp || !app) return

    setLocalApp(app)
  }, [
    localApp,
    isFetchingApp,
    app,
  ])

  const updateAppMutation = trpc.app.update.useMutation({
    onError: (error) => showToast({ 
      status: 'error',
      description: error.message,
    }),
    onSuccess: async () => {
      refetchApp()
      showToast({ 
        status: 'success', 
        description: t('save.success'),
      })
    },
  })

  const save = useCallback(
    async (updates: Omit<App, 'id' | 'created' | 'updated'>) => {
      if (!localApp || !app) return

      const toSave = { ...updates, id: app.id }

      const newApp = await updateAppMutation.mutateAsync(toSave)

      setLocalApp(newApp)

      return newApp
    }, 
    [
      app, 
      localApp, 
      setLocalApp,
      updateAppMutation,
    ]
  )

  const contextValue = {
    app: localApp,
    isFetchingApp,
    refetch: refetchApp,
    isSavingLoading: updateAppMutation.isLoading,
    save,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext)
