import { trpc } from '@/utils/trpc-client';
import { DeleteIcon, ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Stack,
  Divider,
  Button,
  VStack,
  Text,
  Flex,
  Heading,
  Box,
  Alert,
  AlertIcon,
  Link,
} from '@chakra-ui/react';
import { Datastore } from 'models';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/useToast'
import { BaseForm } from './BaseForm';



type Props = {
  datastore: Datastore;
}

export const DatastoreSettings: React.FC<Props> = ({
  datastore,
}) => {
  const t = useTranslations();
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const { showToast } = useToast();

  const deleteDatastoreMutation = trpc.datastore.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.datastore.list.invalidate();
      router.push(`/datastores`)
    },
  });

  const handleDelete = async (id: string) => {
    return await deleteDatastoreMutation.mutateAsync(id);
  }

  
  return (
    <VStack w="full">
      <Stack w="full" maxW="1024px" spacing={8}>
        <BaseForm datastore={datastore} />
        <Divider />
        <Stack spacing={4}>
          <Heading size="md">ChatGPT Plugin</Heading>
          <Alert status='info'>
            <AlertIcon as={QuestionOutlineIcon} />
              <Flex w="full" justifyContent="space-between">
                <Text>Learn more about the ChatGPT plugin installation</Text>
                <Link color="twitter.500" fontWeight={600} isExternal href="https://docs.openbot.chat/integrations/chatgpt-plugin">Documentation <ExternalLinkIcon mx='2px' /></Link>
              </Flex>
          </Alert>
        </Stack>
        <Divider />
        <Stack spacing={4}>
          <Heading size="md">Delete Datastore</Heading>
          <Text fontSize="sm">It will delete the datastore and all its datasources</Text>
          <Box>
            <ConfirmModal 
              isLoading={deleteDatastoreMutation.isLoading}
              trigger={
                <Button colorScheme="red" leftIcon={<DeleteIcon />}>Delete</Button>
              }
              confirmText={t('datastore.delete')}
              title={t('datastore.confirmModal.title')}
              message={t('datastore.confirmModal.description', { confirmText: t('datastore.delete') })}
              onConfirm={() => handleDelete(datastore?.id)}
            />
          </Box>
        </Stack>
      </Stack>
    </VStack>
  );
}