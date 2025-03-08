"use client"
import { ConnectionDetailsPage } from '@/features/app/components/ConnectionDetailsPage'
import { AppProvider } from '@/features/app/context/AppProvider'



type Props = {
  params: {
    id: string
    connection_id: string
  }
}

export default function Page({
  params: {
    id,
    connection_id,
  }
}: Props) {
  return (
    <AppProvider appId={id}>
      <ConnectionDetailsPage id={connection_id} />
    </AppProvider>
  )
}