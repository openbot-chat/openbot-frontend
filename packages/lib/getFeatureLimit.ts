import { PlanEnum, Plan } from 'models'


export const getFeatureLimit = (
  plan: Plan,
  feature: string,
  customFeatureLimit?: number,
) => {
  if (!plan) return -1

  if (plan.slug === PlanEnum.UNLIMITED) return 'inf'
  if (plan.slug === PlanEnum.CUSTOM) return customFeatureLimit ? customFeatureLimit : 'inf'

  return plan?.features?.find(it => it.slug === feature)?.quantity ?? -1
}
