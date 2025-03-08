"use client"
import { AppDetailsPage } from '@/features/app/components/AppDetailsPage'



type Props = {
  params: {
    tab: string
    id: string
  }
}

export default function Page({
  params: {
    tab,
    id,
  }
}: Props) {
  return (
    <AppDetailsPage tab={tab} id={id} />
  )
}