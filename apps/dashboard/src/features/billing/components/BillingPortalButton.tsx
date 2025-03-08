import { useToast } from '@/hooks/useToast'
import { trpc } from '@/utils/trpc-client'
import { Button, ButtonProps, Link } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

type Props = {
  orgId: string
} & Pick<ButtonProps, 'colorScheme'>

export const BillingPortalButton = ({ orgId, colorScheme }: Props) => {
  const t = useTranslations()
  const { showToast } = useToast()
  const { data } = trpc.billing.getBillingPortalUrl.useQuery(
    {
      orgId,
    },
    {
      onError: (error) => {
        showToast({
          description: error.message,
        })
      },
    }
  )
  return (
    <Button
      as={Link}
      href={data?.url}
      isLoading={!data}
      colorScheme={colorScheme}
    >
      {t('billing.billingPortalButton.label')}
    </Button>
  )
}
