import { RepeatIcon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"
import { Datasource, DatasourceStatus } from "models"
import { useMemo } from "react";
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/utils/trpc-client';



type Props = {
  isLoading?: boolean;
  datasource: Datasource;
  onClick?: () => void;
}

const statusColorMap = {
  [DatasourceStatus.pending]: 'gray',
  [DatasourceStatus.synced]: 'gray',
  [DatasourceStatus.unsynced]: 'gray',
  [DatasourceStatus.running]: 'green',
  [DatasourceStatus.error]: 'red',
}

const statusTextMap = {
  [DatasourceStatus.pending]: 'Pending',
  [DatasourceStatus.synced]: 'Sync',
  [DatasourceStatus.unsynced]: 'Sync',
  [DatasourceStatus.running]: 'Running',
  [DatasourceStatus.error]: 'Sync',
}

export const SyncButtonInner: React.FC<Props> = ({
  isLoading,
  datasource,
  onClick,
}) => {
  const color = useMemo(() => statusColorMap[datasource.status], [datasource.status]);
  const text = useMemo(() => statusTextMap[datasource.status], [datasource.status]);

  return (
    <Button isLoading={isLoading || /*datasource.status === 'pending' ||*/ datasource.status === 'running'} onClick={onClick} colorScheme={color} leftIcon={<RepeatIcon />} loadingText={text ?? datasource.status} borderRadius='20' variant='outline'>
      {text ?? datasource.status}
    </Button>
  )
}


export const SyncButton: React.FC<Props> = ({
  datasource,
}) => {
  const { showToast } = useToast();
  const trpcContext = trpc.useContext();

  const syncMutation = trpc.datasource.sync.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      trpcContext.datasource.list.invalidate();
    },
  });

  const handleSync = async (id: string) => {
    await syncMutation.mutateAsync(id);
  }

  return <SyncButtonInner datasource={datasource} isLoading={syncMutation.isLoading} onClick={() => handleSync(datasource.id)} />
}