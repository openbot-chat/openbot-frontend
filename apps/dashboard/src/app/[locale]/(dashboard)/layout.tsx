"use client"
import { OrganizationProvider } from '@/features/organization/context/OrganizationProvider'
import { Layout } from '@/layout/dashboard'
import { useToast } from '@/hooks/useToast'
import { PlanEnum } from 'models'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'



type Props = {
  children: React.ReactNode
}

export default function DashboardLayout({
  children,
}: Props) {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  useEffect(() => {
    const plan = searchParams?.get('plan')
    if (!plan) return

    const success = searchParams?.get('success') === 'true'
    const title = success
      ? t(`billing.upgradeSuccessToast.title`)
      : t(`billing.upgradeFailToast.title`)
    const description = success
      ? t(`billing.upgradeSuccessToast.description`, { plan: t(`billing.pricingCard.${plan}.name`) })
      : t(`billing.upgradeFailToast.description`, { plan: t(`billing.pricingCard.${plan}.name`) })
    if (plan === PlanEnum.STARTER || plan === PlanEnum.PRO || plan === PlanEnum.ENTERPRISE) {
      showToast({
        status: success ? 'success' : 'error',
        title,
        description,
      })
    }
  }, [searchParams, showToast, t])

  return (
    <OrganizationProvider>
      <Layout>
        {children}
      </Layout>
    </OrganizationProvider>
  )
}