"use client"
import { trpc } from "@/utils/trpc-client";
import { Organization } from "models"
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useSession } from 'next-auth/react';
import { parseNewName } from "../utils";
import { useToast } from "@/hooks/useToast";
import { byId, isNotDefined } from '@openbot/lib'
import { setOrganizationIdInLocalStorage } from "../utils/setOrganizationIdInLocalStorage";
import { useRouter } from '@/navigation'



const organizationContext = createContext<{
  organizations: Pick<Organization, 'id' | 'name' | 'icon' | 'plan'>[]
  organization?: Organization
  currentRole?: string
  switchOrganization: (orgId: string) => void
  createOrganization: (name?: string) => Promise<void>
  updateOrganization: (updates: { icon?: string; name?: string }) => void
  deleteCurrentOrganization: () => Promise<void>
  isDeleting: boolean
  refreshOrganization: () => void
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
}>({})

type OrganizationContextProps = {
  children: ReactNode
}



export const OrganizationProvider = ({
  children,
}: OrganizationContextProps) => {
  const { data: session, status } = useSession()
  const trpcContext = trpc.useContext()
  const router = useRouter()

  const [organizationId, setOrganizationId] = useState<string | undefined | null>()

  const { data: organizations } = trpc.org.list.useQuery(
    undefined,
    {
      enabled: !!session?.user,
      staleTime: 300*1000,
    }
  )

  const { data: organization } = trpc.org.details.useQuery(
    organizationId,
    { enabled: !!organizationId }
  )

  const { data: memberData } = trpc.org.getMember.useQuery(
    { orgId: organizationId },
    { enabled: !!organizationId }
  )

  const currentRole = useMemo(() => memberData?.role, [memberData]);

  const { showToast } = useToast()

  const createOrganizationMutation = trpc.org.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.org.list.invalidate()
    },
  })

  const updateOrganizationMutation = trpc.org.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.org.details.invalidate()
    },
  })

  const deleteOrganizationMutation = trpc.org.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.org.list.invalidate()
      setOrganizationId(undefined)
    },
  })

  useEffect(() => {
    if (
      !organizations ||
      organizations.length === 0 ||
      organizationId
    )
      return

    const lastOrgId = localStorage.getItem('orgId')

    const defaultOrgId = lastOrgId
      ? organizations.find(byId(lastOrgId))?.id
      : undefined;
      //members?.find((member) => member.role === OrganizationRole.ADMIN)?.org_id    

    const newOrgId = defaultOrgId ?? organizations[0].id

    setOrganizationIdInLocalStorage(newOrgId)
    setOrganizationId(newOrgId)
  }, [
    organizationId,
    organizations,
  ]);


  const switchOrganization = useCallback(async (orgId: string) => {
    setOrganizationIdInLocalStorage(orgId)
    setOrganizationId(orgId)
    router.push('/marketplace/agents')
  }, [router])

  const createOrganization = useCallback(async (organizationName?: string) => {
    if (!organizations) return
    const name = parseNewName(organizationName, organizations)
    const organization = await createOrganizationMutation.mutateAsync({ name })

    setOrganizationIdInLocalStorage(organization.id)
    setOrganizationId(organization.id);
  }, [createOrganizationMutation, organizations])

  const updateOrganization = useCallback((updates: { icon?: string; name?: string }) => {
    if (!organizationId) return

    updateOrganizationMutation.mutate({
      id: organizationId,
      ...updates,
    })
  }, [organizationId, updateOrganizationMutation]);

  const deleteCurrentOrganization = useCallback(async () => {
    if (!organizationId || !organizations || organizations.length < 2) return
    await deleteOrganizationMutation.mutateAsync(organizationId)
  }, [organizationId, organizations, deleteOrganizationMutation]);

  const refreshOrganization = useCallback(() => {
    trpcContext.org.details.invalidate()
  }, [trpcContext]);

  const value = useMemo(() => ({
    organizations,
    organization,
    currentRole,
    switchOrganization,
    createOrganization,
    updateOrganization,
    deleteCurrentOrganization,
    isDeleting: deleteOrganizationMutation.isLoading,
    refreshOrganization,
  }), [
    organizations,
    organization,
    currentRole,
    switchOrganization,
    createOrganization,
    updateOrganization,
    deleteCurrentOrganization,
    deleteOrganizationMutation.isLoading,
    refreshOrganization,
  ]);

  return (
    <organizationContext.Provider value={value}>
      {children}
    </organizationContext.Provider>
  );
}

export const useOrganization = () => useContext(organizationContext)
