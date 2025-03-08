import { useMemo, useState, useEffect } from 'react'
import { Select } from '@/components/inputs'
import { Connection } from 'models'
import { trpc } from "@/utils/trpc-client"



type Props = {
  connectionId?: string
  types?: string[]
  onSelect?: (value: string | undefined, item?: Connection) => void
}

export const ConnectionSelect: React.FC<Props> = ({
  connectionId,
  types,
  onSelect,
}) => {
  const connectionListQuery = trpc.connection.list.useQuery({
    types,
  })

  const items = useMemo(() => connectionListQuery.data?.items?.map(it => ({
    label: it.name,
    value: it.id,
  })), [connectionListQuery.data])

  return <Select selectedItem={connectionId} placeholder={'Select Connection'} items={items} onSelect={onSelect} />
}