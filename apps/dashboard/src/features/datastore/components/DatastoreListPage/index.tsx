import React, { useMemo } from 'react';

import {
  Text,
  Container,
  Stack,
  VStack,
  Box,
  Heading,
  HStack,
  Button,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { useToast } from '@/hooks/useToast'
import Link from 'next/link';
import { HomeIcon, PlusIcon } from '@/components/icons';
import { DatastoreTable } from './DatastoreTable';
import { CreateDatastoreModal } from '../CreateDatastoreModal';

import { trpc } from "@/utils/trpc-client"
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@/features/organization/context/OrganizationProvider';
import { ParentModalProvider } from '@/features/graph/providers/ParentModalProvider';



export const DatastoreListPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const t = useTranslations()
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const { organization } = useOrganization()
  const query = trpc.datastore.list.useQuery({
    size: 10,
    org_id: organization?.id,
    ...(searchParams.get('cursor') ? { cursor: searchParams.get('cursor') } : undefined),
  }, {
    enabled: !!organization?.id,
  })
  const createDatastoreMutation = trpc.datastore.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async (datastore) => {
      onCreateClose();
      trpcContext.datastore.list.invalidate();
      // router.push(`/datastores/${datastore.id}`)
    },
  });

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const handleCreate = async (data) => {
    console.log('data: ', data)
    await createDatastoreMutation.mutateAsync({ ...data, org_id: organization?.id });
  };

  return (
    <Container maxW="1280px">
      <VStack w="full" h="full" spacing={8} py={8}>
        <Stack w='full'>
          <Breadcrumb color={useColorModeValue('gray.500', 'white')} fontWeight='medium' fontSize="sm" spacing='8px' separator={<ChevronRightIcon color={useColorModeValue('gray.500', 'white')} />}>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'><HomeIcon /></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='/datastores'>{t('datastores')}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Stack>

        <ParentModalProvider>
          <CreateDatastoreModal isSubmitting={createDatastoreMutation.isLoading} onClose={onCreateClose} isOpen={isCreateOpen} onCreate={handleCreate} />
        </ParentModalProvider>

        <HStack w='full'>
          <Heading>Datastore</Heading>
          <Box flexGrow={1} />
          <Box>
            <Button colorScheme="orange" leftIcon={<PlusIcon />} onClick={onCreateOpen}>Create Datastore</Button>
          </Box>
        </HStack>
        <DatastoreTable isLoading={query.status === 'loading'} datastores={query.data?.items} />
        <Pagination
          total={query.data?.total}
          hasPrevious={query.data?.previous_page}
          hasNext={query.data?.next_page}
          onPrevious={() => {
            const q = new URLSearchParams(searchParams?.toString() ?? '');
            q.set('cursor', query.data?.previous_page)
            router.replace(`${pathname}?${q.toString()}`);
          }}
          onNext={() => {
            const q = new URLSearchParams(searchParams?.toString() ?? '');
            q.set('cursor', query.data?.next_page)
            router.replace(`${pathname}?${q.toString()}`);
          }}
        />
      </VStack>
    </Container>
  );
}

type PaginationProps = {
  total?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

const Pagination = ({
  total,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: PaginationProps) => {
  return (
    <HStack justifyContent="space-between" w='full'>
      <Button
        leftIcon={<ChevronLeftIcon />}
        isDisabled={!hasPrevious}
        onClick={onPrevious}
      >
        Previous
      </Button>
      <Text>
        Total: {total ?? 0}
      </Text>
      <Button
        rightIcon={<ChevronRightIcon />}
        isDisabled={!hasNext}
        onClick={onNext}
      >
        Next
      </Button>
    </HStack>
  )
}