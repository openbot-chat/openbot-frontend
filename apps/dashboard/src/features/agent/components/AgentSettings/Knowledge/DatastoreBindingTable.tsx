import React, { useMemo } from 'react';
import {
  Switch,
  Tag,
  HStack,
  Button,
  Text,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { Link } from '@chakra-ui/next-js'
import { CellContext } from '@tanstack/react-table'
import $keyby from 'lodash.keyby'
import { Table } from '@/components/Table'
import {
  Datastore, DatastoreBinding,
} from 'models';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

export type Props = {
  isFetching?: boolean;
  isLoading?: boolean;
  bindings?: DatastoreBinding[];
  items: Datastore[];
  onBindingChange?: (datasource: Datastore, enabled: boolean) => void;
}

export const DatastoreBindingTable: React.FC<Props> = ({
  bindings,
  items,
  onBindingChange,
  isFetching,
  isLoading,
}) => {
  const t = useTranslations();
  const id2binding = useMemo(() => $keyby(bindings ?? [], 'datastore.id'), [bindings]);

  const columns = useMemo(() => [
    {
      header: t('datastore.name'),
      accessorKey: "name",
      cell: ({ row }: CellContext<Datastore, string>) => (
        <Link fontWeight="bold" color="twitter.500" href={`/datastores/${row.original.id}`}>
          {row.original.name_for_model}
        </Link>
      )
    },
    {
      header: t('datastore.visibility'),
      accessorKey: "visibility",
      cell: (props: CellContext<Datastore, string>) => <Tag colorScheme="gray">{props.getValue() ?? 'public'}</Tag>,
    },
    {
      header: t('datastore.provider'),
      accessorKey: "provider",
      cell: (props: CellContext<Datastore, Date>) => <Tag colorScheme="whatsapp">{props.getValue()}</Tag>
    },
    {
      header: t('datastore.datasource_count'),
      accessorKey: "datasource_count",
      cell: (props: CellContext<Datastore, string>) => <>{props.getValue()}</>,
    },
    {
      header: t('datastore.enabled'),
      enableSorting: false,
      accessorKey: '',
      cell: ({ row }: CellContext<Datastore, string>) => <Switch isDisabled={isLoading} colorScheme="twitter" isChecked={!!id2binding[row.original.id]} onChange={(e) => onBindingChange?.(row.original, e.target.checked)} />,
    }
  ], [t, isLoading, id2binding, onBindingChange]);



  return (
    <Table 
      columns={columns}
      data={items ?? []}
      loading={isFetching}
    />
  );
}