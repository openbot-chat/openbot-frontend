import { Stack } from '@chakra-ui/react'
import React from 'react'
// import { InvoicesList } from './InvoicesList'
import { ChangePlanForm } from './ChangePlanForm'
// import { UsageProgressBars } from './UsageProgressBars'
import { CurrentSubscriptionSummary } from './CurrentSubscriptionSummary'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { PlanEnum } from 'models'

export const BillingSettingsLayout = () => {
	const { organization } = useOrganization()

	if (!organization) return null

	return (
		<Stack spacing="10" w="full">
			{/* <UsageProgressBars workspace={workspace} /> */}
			<Stack spacing="4">
				<CurrentSubscriptionSummary organization={organization} />
				{organization.plan !== PlanEnum.CUSTOM &&
					organization.plan !== PlanEnum.LIFETIME &&
					organization.plan !== PlanEnum.UNLIMITED &&
					organization.plan !== PlanEnum.OFFERED && (
						<ChangePlanForm organization={organization} />
					)}
			</Stack>

			{/* {workspace.stripeId && <InvoicesList workspaceId={workspace.id} />} */}
		</Stack>
	)
}
