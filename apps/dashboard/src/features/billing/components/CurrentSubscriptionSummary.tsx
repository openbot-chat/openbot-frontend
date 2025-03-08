import {
	Text,
	HStack,
	Stack,
	Heading,
	Alert,
	AlertIcon,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { PlanTag } from './PlanTag'
import { BillingPortalButton } from './BillingPortalButton'
import { trpc } from '@/utils/trpc-client'
import { Organization, PlanEnum } from 'models';
import { useTranslations } from 'next-intl'

type Props = {
	organization: Pick<Organization, 'id' | 'plan'>
}

export const CurrentSubscriptionSummary = ({ organization }: Props) => {
	const t = useTranslations()

	const { data: subscription } = trpc.billing.getSubscription.useQuery({ organizationId: organization.id })

	const alert = useMemo(() => {
		if (subscription?.status === 'past_due') {
			// 续费扣款失败
			return t('billing.currentSubscription.pastDueAlert')
		}
		if (subscription?.cancel_at) {
			// 到期就自动取消
			return t('billing.currentSubscription.cancelAlert', {
				cancelDate: new Date(subscription.cancel_at).toDateString()
			})
		}
		return ''
	}, [subscription])

	return (
		<Stack spacing="4">
			<Heading fontSize="3xl">{t('billing.currentSubscription.heading')}</Heading>
			<HStack data-testid="current-subscription">
				<Text>{t('billing.currentSubscription.subheading')} </Text>
				<PlanTag plan={subscription?.plan ?? PlanEnum.FREE} />
				{subscription?.end_at && (
					<Text fontSize="sm">
						({t('billing.currentSubscription.endDate')}{' '}
						{new Date(subscription?.end_at).toDateString()})
					</Text>
				)}
			</HStack>
			{
				alert && (
					<Alert fontSize="sm" status="error">
						<AlertIcon />
						{alert}
						<BillingPortalButton
							orgId={organization.id}
							colorScheme={
								subscription?.status === 'past_due' ? 'blue' : undefined
							}
						/>
					</Alert>
				)
			}
		</Stack>
	)
}
