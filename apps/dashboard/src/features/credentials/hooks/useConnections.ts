import { trpc } from "@/utils/trpc-client"
import { useMemo } from "react"
import $keyby from 'lodash.keyby'


export function useConnections() {
  const { data } = trpc.connection.list.useQuery({
    size: 1000,
  }, {
    refetchOnWindowFocus: false,
  })
  
  const connectionMap = useMemo(() => $keyby(data?.items ?? [], 'identifier'), [data])

  return {
    connections: data?.items ?? [],
    connectionMap,
  }
}