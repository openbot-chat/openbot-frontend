import {
  Container,
  VStack,
  HStack,
  Button,
  Tag,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Text,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Tooltip,
  IconButton,
  chakra,
  Center,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { trpc } from '@/utils/trpc-client';
import { Datasource, Document } from 'models';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon, SearchIcon, ViewIcon } from '@chakra-ui/icons';
import { Table } from '@/components/Table';
import { useMemo, useState } from 'react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useToast } from '@/hooks/useToast'
import { EditDocumentModal } from './EditDocumentModal';
import { DocumentPreview } from './DocumentPreview/DocumentPreview';
// TODO chakra-ui 下有什么好的table控件

type Props = {
  datasource: Datasource;
}

export const DocumentTable: React.FC<Props> = ({
  datasource,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const trpcContext = trpc.useContext();
  const { showToast } = useToast();
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const [activeDocument, setActiveDocument] = useState<Document | undefined>();

  const t = useTranslations();
  const documentListQuery = trpc.datasource.listDocuments.useQuery({
    datasource_id: datasource?.id,
    size: 10,
    ...(searchParams.get('cursor') ? { cursor: searchParams.get('cursor') } : undefined),
  }, {
    enabled: !!datasource?.id,
  })
  const bulkDeleteMutation = trpc.document.bulkDelete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.document.list.invalidate();
    },
  })
  const updateDocumentMutation = trpc.document.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.document.details.invalidate()
    },
  });
  const documentQuery = trpc.document.details.useQuery(activeDocument?.id, {
    enabled: !!activeDocument?.id,
  })

  const columns = useMemo(() => [
    {
      header: '',
      enableSorting: false,
      accessorKey: "preview",
      cell: ({ row }) => (
        <Center w="240px" h="180px" position="relative" overflow="hidden">
          <DocumentPreview document={row.original} />
        </Center>
      )
    },
    {
      header: t('document.url'),
      enableSorting: false,
      accessorKey: "name",
      cell: ({ row }) => (
        <chakra.div w="400px" overflow='hidden' textOverflow="ellipsis">
          <a target="_blank" href={row.original.metadata_?.url} rel="noreferrer">{row.original.metadata_?.url}</a>
        </chakra.div>
      )
    },
    {
      header: t('document.type'),
      enableSorting: false,
      accessorKey: "type",
      cell: ({ row }) => <Tag>{row.original.metadata_?.file_type ?? row.original.metadata_?.source_type}</Tag>,
    },
    {
      header: t('document.size'),
      accessorKey: "size",
      cell: ({ row }) => <>{Math.ceil((row.original.metadata_?.size ?? 0) / 1024)}KB / {row.original.metadata_?.chunks ?? 0} chunks</>
    },
    {
      accessorKey: "actions",
      enableSorting: false,
      cell: ({ row }) => <IconButton aria-label="查看" icon={<SearchIcon />} onClick={() => setActiveDocument(row.original)}/>
    }
  ], [t, setActiveDocument]);

  const handleBulkDelete = async () => {
    const ids = Object.keys(selection).map(i => documentListQuery.data.items[i].id);
    await bulkDeleteMutation.mutateAsync({ ids });
    setSelection({});
  }

  const handleEdit = async (document: Document) => {
    const { created_at, updated_at, ...rest } = document
    const data = {...rest, id: document.id }
    if (document.id) {
      await updateDocumentMutation.mutateAsync(data)
    }
  }


  return (
    <VStack w='full' spacing={4}>
      {selection && Object.keys(selection).length > 0 && (
        <HStack justifyContent="flex-start" w='full'>
          <ConfirmModal 
            isLoading={bulkDeleteMutation.isLoading}
            trigger={
              <Button colorScheme="red" leftIcon={<DeleteIcon />}>删除所选项</Button>
            }
            title={"确认删除选中的文档"}
            message={"确认删除选中的文档?"}
            onConfirm={handleBulkDelete}
          />
        </HStack>
      )}
      <HStack w='full' spacing={4}>
        {/*
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.300'/>
          </InputLeftElement>
          <Input placeholder={t("document.search.placeholder")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </InputGroup>
        */}
      </HStack>
      <Table 
        rowSelection={{
          enabled: (row) => true, // row.original.status !== 'running',
          selection,
          onRowSelectionChange: setSelection,
        }}
        columns={columns}
        data={documentListQuery.data?.items ?? []}
        loading={documentListQuery.isLoading}
      />
      <HStack justifyContent="space-between" w='full'>
        <Button 
          leftIcon={<ChevronLeftIcon />} 
          isDisabled={!documentListQuery.data?.previous_page}
          onClick={() => {
            const query = new URLSearchParams(searchParams?.toString() ?? '');
            query.set('cursor', documentListQuery.data?.previous_page)
            router.replace(`${pathname}?${query.toString()}`);
          }}
        >
          Previous
        </Button>
        <Text>
          Total: {documentListQuery.data?.total ?? 0}
        </Text>
        <Button 
          rightIcon={<ChevronRightIcon />}
          isDisabled={!documentListQuery.data?.next_page}
          onClick={() => {
            const query = new URLSearchParams(searchParams?.toString() ?? '');
            query.set('cursor', documentListQuery.data?.next_page)
            router.replace(`${pathname}?${query.toString()}`);
          }}
        >
          Next
        </Button>
      </HStack>

      <EditDocumentModal isLoading={documentQuery.isLoading || updateDocumentMutation.isLoading} isOpen={!!activeDocument} onClose={() => setActiveDocument(undefined)} document={documentQuery.data} onEdit={handleEdit} />
    </VStack>
  );
}