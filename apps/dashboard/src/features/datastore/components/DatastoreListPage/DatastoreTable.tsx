import { useMemo } from 'react'
import {
  Tag,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import {
  SettingsIcon,
} from '@chakra-ui/icons'
import { Datastore } from 'models'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { CellContext } from '@tanstack/react-table'
import { Table } from '@/components/Table'

export type Props = {
  isLoading?: boolean;
  datastores: Datastore[];
}

export const DatastoreTable: React.FC<Props> = ({
  isLoading,
  datastores,
}) => {
  const t = useTranslations();
  const router = useRouter();

  const columns = useMemo(() => [
    {
      header: t('datastore.name'),
      accessorKey: "name",
      cell: ({ row }: CellContext<Datastore, string>) => <Link href={`/datastores/${row.original.id}`}>{row.original.name_for_model}</Link>
    },
    {
      header: t('datastore.visibility'),
      accessorKey: "visibility",
      cell: (props: CellContext<Datastore, string>) => <Tag>{props.getValue() ?? 'private'}</Tag>,
    },
    {
      header: t('datastore.provider'),
      accessorKey: "provider",
      cell: (props: CellContext<Datastore, Date>) => <Tag colorScheme="whatsapp">{props.getValue()}</Tag>,
    },
    {
      header: t('datastore.datasource_count'),
      accessorKey: "datasource_count",
      cell: (props: CellContext<Datastore, string>) => <>{props.getValue()}</>,
    },
    {
      header: t('datastore.agent_count'),
      accessorKey: 'agent_count',
      cell: (props: CellContext<Datastore, string>) => <>{props.getValue()}</>,
    },
    {
      header: '',
      accessorKey: 'actions',
      enableSorting: false,
      cell: ({ row }) => (
        <HStack justifyContent="center">
          <IconButton aria-label="Settings" icon={<SettingsIcon />} onClick={() => router.push(`/datastores/${row.original.id}`)}/>
        </HStack>
      ),
    }
  ], [t, router]);

  return (
    <Table columns={columns} data={datastores} loading={isLoading} />
  );
}