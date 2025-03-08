import React, { useMemo } from 'react'
import {
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { Select } from '@/components/inputs'
import { Datastore } from 'models'
import { trpc } from "@/utils/trpc-client"
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { TbRefresh } from 'react-icons/tb'



type Props = {
  value?: string;
  onSelect?: (value: string | undefined, item?: Datastore) => void;
}

export const DatastoreSelect: React.FC<Props> = ({
  value,
  onSelect,
}) => {
  const { organization } = useOrganization()
  const datastoreQuery = trpc.datastore.details.useQuery(value, {
    enabled: !!value,
  })
  const datastoreListQuery = trpc.datastore.list.useQuery({
    org_id: organization?.id as string,
    size: 100,
  }, {
    enabled: !!organization?.id,
  })

  const items = useMemo(() => datastoreListQuery.data?.items?.map(it => ({
    label: it.name_for_model,
    value: it.id,
  })), [datastoreListQuery]);

  return (
    <>
      <HStack spacing={2}>
        <Select selectedItem={value} placeholder="Select Datastore" items={items} onSelect={onSelect} />
        {datastoreQuery.data && (
          <IconButton
            isLoading={datastoreListQuery.isLoading}
            onClick={datastoreListQuery.refetch}
            fontSize="16px"
            fontWeight="normal"
            rounded="none"
            colorScheme="gray"
            transition="none"
            icon={<TbRefresh />}
          />
        )}
      </HStack>
    </>
  )
};