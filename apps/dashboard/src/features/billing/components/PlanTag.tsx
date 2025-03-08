import { Tag, TagProps, ThemeTypings } from '@chakra-ui/react'
import { PlanEnum } from 'models'
import { useTranslations } from 'next-intl'

export const planColorSchemes: Record<PlanEnum, ThemeTypings['colorSchemes']> = {
	[PlanEnum.LIFETIME]: 'purple',
	[PlanEnum.ENTERPRISE]: 'purple',
	[PlanEnum.PRO]: 'blue',
	[PlanEnum.OFFERED]: 'orange',
	[PlanEnum.STARTER]: 'orange',
	[PlanEnum.FREE]: 'gray',
	[PlanEnum.CUSTOM]: 'yellow',
	[PlanEnum.UNLIMITED]: 'yellow',
}

export const PlanTag = ({
	plan,
	...props
}: { plan: PlanEnum } & TagProps): JSX.Element => {
	const t = useTranslations()
	switch (plan) {
		case PlanEnum.ENTERPRISE:
		case PlanEnum.PRO:
		case PlanEnum.STARTER:
		case PlanEnum.FREE: {
			return (
				<Tag
					colorScheme={planColorSchemes[plan]}
					data-testid={`${plan.toLowerCase()}-plan-tag`}
					{...props}
				>
					{t(`billing.pricingCard.${plan}.name`)}
				</Tag>
			)
		}
		case PlanEnum.OFFERED:
		case PlanEnum.LIFETIME: {
			return (
				<Tag
					colorScheme={planColorSchemes[plan]}
					data-testid="lifetime-plan-tag"
					{...props}
				>
					Lifetime
				</Tag>
			)
		}
		case PlanEnum.CUSTOM: {
			return (
				<Tag
					colorScheme={planColorSchemes[PlanEnum.CUSTOM]}
					data-testid="custom-plan-tag"
					{...props}
				>
					Custom
				</Tag>
			)
		}
		case PlanEnum.UNLIMITED: {
			return (
				<Tag
					colorScheme={planColorSchemes[PlanEnum.UNLIMITED]}
					data-testid="custom-unlimite-tag"
					{...props}
				>
					Unlimited
				</Tag>
			)
		}
	}
	return <></>
}
