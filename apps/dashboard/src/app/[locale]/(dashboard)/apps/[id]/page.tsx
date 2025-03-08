"use client"
import { redirect } from 'next/navigation'

type Props = {
  params: {
    id: string
  }
}

export default function Page({
  params: {
    id,
  }
}: Props) {
  return redirect(`/apps/${id}/connections`)
}