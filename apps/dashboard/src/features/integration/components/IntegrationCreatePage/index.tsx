"use client"
import { useCallback } from 'react';
import {
  Stack,
  VStack,
} from '@chakra-ui/react';
import { trpc } from "@/utils/trpc-client"
import { useToast } from '@/hooks/useToast'

import { useParams } from 'next/navigation';

import { IntegrationEditForm } from '../IntegrationEditForm';
import { Integration } from 'models';
import { useRouter } from 'next/navigation';


export const IntegrationCreatePage = () => {
  const { catalog } = useParams();
  const router = useRouter();
  const trpcContext = trpc.useContext();
  const { showToast } = useToast();
  
  const integrationCreateMutation = trpc.integration.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      showToast({ status: 'success', description: 'Create Success' });
      trpcContext.integration.list.invalidate();
      router.push('/integrations');
    },
  });

  const handleCreate = useCallback(async (integration: Partial<Integration>) => {
    await integrationCreateMutation.mutateAsync(integration);
  }, [integrationCreateMutation.mutateAsync]);

  return (
    <VStack w="full" spacing={4} px={12} pt={8}>
      <Stack w="full" maxW="1024px">
        <IntegrationEditForm catalog={catalog} onSubmit={handleCreate} />
      </Stack>
    </VStack>
  );
}