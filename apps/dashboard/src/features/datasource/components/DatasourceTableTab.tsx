import {
  useDisclosure,
  VStack,
  HStack,
  Button,
  Tag,
  InputGroup,
  InputLeftElement,
  Input,
  Skeleton,
  Text,
  IconButton,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { trpc } from '@/utils/trpc-client';
import { Datastore, DatasourceStatus, Datasource } from 'models';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EditIcon, ChevronLeftIcon, ChevronRightIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs'
import { SyncButton } from './SyncButton';
import { Table } from '@/components/Table';
import { useMemo, useState } from 'react';
import { Link } from '@chakra-ui/next-js';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/hooks/useToast'
import { CellContext } from '@tanstack/react-table';
import { DatasourceStatusSelect } from './DatasourceStatusSelect';
import { useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { useCallback } from 'react';



const statusColorMap = {
  [DatasourceStatus.synced]: 'twitter',
  [DatasourceStatus.unsynced]: 'gray',
  [DatasourceStatus.running]: 'green',
  [DatasourceStatus.error]: 'red',
}


type Props = {
  datastore: Datastore;
  onEdit?: (datastore: Datastore) => void;
}

export const DatasourceTableTab: React.FC<Props> = ({
  datastore,
  onEdit,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()

  const [status, setStatus] = useState(undefined)
  const [inited, setInited] = useState(false)
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure()

  const scopedT = useTranslations('datasource')
  const datasourceListQuery = trpc.datasource.list.useQuery({
    datastore_id: datastore?.id,
    status,
    size: 10,
    ...(searchParams.get('cursor') ? { cursor: searchParams.get('cursor')} : undefined),
  }, {
    refetchInterval: 5000,
    enabled: !!datastore?.id,
  })
  useEffect(() => {
    if (datasourceListQuery.data) {
      setInited(true);
    }
  }, [datasourceListQuery.data])

  const bulkDeleteMutation = trpc.datasource.bulkDelete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.datasource.list.invalidate()
    },
  })

  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const [toDelete, setToDelete] = useState<Datasource | undefined>(undefined);

  const handleOpenDelete = useCallback(async (datasource: Datasource) => {
    setToDelete(datasource);
    onOpenDelete();
  }, [onOpenDelete]);

  const handleDelete = async () => {
    await bulkDeleteMutation.mutateAsync({ ids: [toDelete.id] });
  }

  const columns = useMemo(() => [
    {
      header: scopedT('name'),
      accessorKey: "name",
      cell: ({ row }: CellContext<Datasource, string>) => (
        <Link href={`/datastores/${row.original.datastore_id}/datasources/${row.original.id}`}>
          <Text maxW="400px" overflow='hidden' textOverflow="ellipsis">{row.original.name}</Text>
        </Link>
      )
    },
    {
      header: scopedT('type'),
      accessorKey: "type",
      cell: (props: CellContext<Datasource, string>) => <Tag>{props.getValue()}</Tag>,
    },
    {
      header: scopedT('last_sync'),
      accessorKey: "last_sync",
      cell: (props: CellContext<Datasource, Date>) => <>{props.getValue() && dayjs(props.getValue()).fromNow()}</>
    },
    {
      header: scopedT('status'),
      accessorKey: "status",
      cell: (props: CellContext<Datasource, string>) => <Tag colorScheme={statusColorMap[props.getValue()]}>{props.getValue()}</Tag>,
    },
    {
      header: '',
      enableSorting: false,
      accessorKey: 'sync_status',
      cell: ({ row }: CellContext<Datasource, string>) => <SyncButton datasource={row.original} />,
    },
    {
      header: '',
      enableSorting: false,
      accessorKey: 'actions',
      cell: ({ row }: CellContext<Datasource, string>) => {
        return (
          <Menu isLazy placement="bottom-end">
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<FiMoreVertical />}
              variant='outline'
            />
            <Portal>
              <MenuList>
                <MenuItem onClick={() => onEdit?.(row.original)} icon={<EditIcon />}>
                  Edit
                </MenuItem>
                <MenuItem color="red" icon={<DeleteIcon />} onClick={() => handleOpenDelete(row.original)}>
                  Delete
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        );
      }
    }
  ], [scopedT, onEdit, handleOpenDelete]);

  const handleBulkDelete = async () => {
    const ids = Object.keys(selection).map(i => datasourceListQuery.data.items[i].id);
    await bulkDeleteMutation.mutateAsync({ ids });
    setSelection({});
  }

  

  return (
    <VStack w='full' spacing={4}>
      <ConfirmModal
        isLoading={bulkDeleteMutation.isLoading}
        isOpen={toDelete && isOpenDelete}
        onClose={onCloseDelete}
        title={scopedT('confirmModal.title')}
        message={scopedT('confirmModal.message')}
        onConfirm={handleDelete}
      />
      {selection && Object.keys(selection).length > 0 && (
        <HStack justifyContent="flex-start" w='full'>
          <ConfirmModal 
            isLoading={bulkDeleteMutation.isLoading}
            trigger={
              <Button colorScheme="red" leftIcon={<DeleteIcon />}>删除所选项</Button>
            }
            title={"确认删除选中的数据源"}
            message={"确认删除选中的数据源?"}
            onConfirm={handleBulkDelete}
          />
        </HStack>
      )}
      <HStack w='full' spacing={4}>
        <Skeleton isLoaded={inited || !!datasourceListQuery.data || !datasourceListQuery.isLoading} flex={1}>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300'/>
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>
        </Skeleton>
        <Skeleton isLoaded={inited || !!datasourceListQuery.data || !datasourceListQuery.isLoading}>
          <DatasourceStatusSelect value={status} onChange={(v) => setStatus(v)} />
        </Skeleton>
      </HStack>
      <Table 
        rowSelection={{
          enabled: () => true, // row.original.status !== 'running',
          selection,
          onRowSelectionChange: setSelection,
        }}
        columns={columns}
        data={datasourceListQuery.data?.items ?? []}
        loading={datasourceListQuery.isLoading}
      />
      <HStack justifyContent="space-between" w='full'>
        <Button 
          leftIcon={<ChevronLeftIcon />}
          isDisabled={!datasourceListQuery.data?.previous_page}
          onClick={() => {
            const query = new URLSearchParams(searchParams?.toString() ?? '');
            query.set('cursor', datasourceListQuery.data?.previous_page)
            router.replace(`${pathname}?${query.toString()}`);
          }}
        >
          Previous
        </Button>
        <Text>
          Total: {datasourceListQuery.data?.total ?? 0}
        </Text>
        <Button 
          rightIcon={<ChevronRightIcon />}
          isDisabled={!datasourceListQuery.data?.next_page}
          onClick={() => {
            const query = new URLSearchParams(searchParams?.toString() ?? '');
            query.set('cursor', datasourceListQuery.data?.next_page)
            router.replace(`${pathname}?${query.toString()}`);
          }}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
}