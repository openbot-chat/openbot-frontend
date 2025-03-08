"use client"
import { useCallback, useMemo } from 'react';
import { IntegrationList } from './IntegrationList';
import {
  Stack,
  Box,
  VStack,
  HStack,
  Input,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { trpc } from "@/utils/trpc-client"
import { useToast } from '@/hooks/useToast'

import { useParams } from 'next/navigation';

import { IntegrationEditForm } from '../IntegrationEditForm';
import { Integration } from 'models';
import { useRouter } from 'next/navigation';


export const IntegrationEditPage = () => {
  const { id, catalog } = useParams();
  const router = useRouter();
  const trpcContext = trpc.useContext();
  const { showToast } = useToast();

  const query = trpc.integration.details.useQuery(id);
  const formData = useMemo(() => {
    if (query.data && query.data.options) {
      const options = JSON.stringify(query.data.options, '\t', 4);
      return {...query.data, options }
    }
    return query.data;
  }, [query.data]);

  const integrationUpdateMutation = trpc.integration.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      showToast({ status: 'success', description: 'Save Success' });
      trpcContext.integration.list.invalidate();
      router.push('/integrations');
    },
  });

  const handleEdit = useCallback(async (integration: Partial<Integration>) => {
    const data = { ...integration, id };
    await integrationUpdateMutation.mutateAsync(data);
  }, [integrationUpdateMutation.mutateAsync, id]);

  return (
    <VStack w="full" spacing={4} px={12} pt={8}>
      <Stack w="full" maxW="1024px">
        {formData && <IntegrationEditForm formData={formData} catalog={catalog} onSubmit={handleEdit} />}
      </Stack>
    </VStack>
  );
}