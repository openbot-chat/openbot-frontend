import { useOrganization } from "@/features/organization/context/OrganizationProvider"
import { trpc } from "@/utils/trpc-client"
import { useMemo } from "react"





export const usePlan = () => {
  const { organization } = useOrganization()
  
  const { data: plans } = trpc.plan.list.useQuery(undefined, {
    staleTime: 300*1000,
  })

  const plan = useMemo(() => plans?.find(it => it.name === organization?.plan), [plans, organization])

  return {
    plan,
  }
}