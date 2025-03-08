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
import { Connection } from 'models'
import { parseDefaultPublicId } from '@/features/deploy/helpers/parseDefaultPublicId'
import { isDefined } from '@openbot/lib'
import { useTranslations } from 'next-intl'

export type ConnectionContextProps = {
  connection?: Connection
  save: (data: Omit<Connection, 'id' | 'created' | 'updated'>) => Promise<void>
  isFetchingConnection: boolean
  isSavingLoading: boolean
  refetch: () => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ConnectionContext = createContext<ConnectionContextProps>({})

type Props = {
  connectionId?: string
}

export const ConnectionProvider = ({
  children,
  connectionId,
}: PropsWithChildren<Props>) => {
  const t = useTranslations()
  const [localConnection, setLocalConnection] = useState<Connection | undefined>(undefined)
  const { 
    data: connection, 
    isLoading: isFetchingConnection, 
    refetch: refetchConnection,
  } = trpc.connection.details.useQuery(connectionId, { 
    enabled: !!connectionId,
    refetchOnWindowFocus: false, // TODO
  })

  const { showToast } = useToast()

  useEffect(() => {
    if (!connection && isDefined(localConnection)) setLocalConnection(undefined)
    if (isFetchingConnection || !connection) return

    setLocalConnection(connection)
  }, [
    localConnection,
    isFetchingConnection,
    connection,
  ])

  const updateConnectionMutation = trpc.connection.update.useMutation({
    onError: (error) => showToast({ 
      status: 'error',
      description: error.message,
    }),
    onSuccess: async () => {
      refetchConnection()
      showToast({ 
        status: 'success', 
        description: t('save.success'),
      })
    },
  })

  const save = useCallback(
    async (updates: Omit<Connection, 'id' | 'created' | 'updated'>) => {
      if (!localConnection || !connection) return

      const toSave = { ...updates, id: connection.id }

      const newConnection = await updateConnectionMutation.mutateAsync(toSave)

      setLocalConnection(newConnection)

      return newConnection
    }, 
    [
      connection, 
      localConnection, 
      setLocalConnection,
      updateConnectionMutation,
    ]
  )

  const contextValue = {
    connection: localConnection,
    isFetchingConnection,
    refetch: refetchConnection,
    isSavingLoading: updateConnectionMutation.isLoading,
    save,
  }

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext)
