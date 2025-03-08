"use client"

import { CatalogPage } from "@/features/marketplace/components/CatalogPage"


type Props = {
  params: { catalog: string }
}

export default function Page({
  params: {
    catalog,
  }
}: Props) {
  return <CatalogPage catalog={catalog} />
}