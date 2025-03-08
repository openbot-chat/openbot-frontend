import { trpc } from "@/utils/trpc-client"
import { Datasource } from "models"
import cuid from 'cuid';
import mime from 'mime-types';
import axios from 'axios';
import { useState } from "react";
import { useToast } from '@/hooks/useToast'
import { Datasource } from 'models';
import { useOrganization } from "@/features/organization/context/OrganizationProvider";

type Props = {
  datastoreId: string;
  onSuccess?: (datasource: Datasource) => void;
}

export function useSaveDatasource({ 
  datastoreId, 
  onSuccess, 
}: Props) {
  const trpcContext = trpc.useContext()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { organization } = useOrganization()
  const generateUploadLinkMutation = trpc.datastore.generateUploadLink.useMutation({
    onError: (error: Error) => showToast({ description: error.message }),
  })

  const createDatasourceMutation = trpc.datasource.create.useMutation({
    onError: (error: Error) => showToast({ description: error.message }),
    onSuccess,
  })
  const updateDatasourceMutation = trpc.datasource.update.useMutation({
    onError: (error: Error) => showToast({ description: error.message }),
    onSuccess,
  })

  const saveDatasource = async (provider: string, values: Partial<Datasource>) => {
    if (!organization) return

    try {
      setIsLoading(true)
      const { text, ...options } = values.options ?? {}

      const payload = {
        ...values,
        options: options ?? {},
        org_id: organization.id,
      }

      if (provider === 'text' || text) {
        const fileId = cuid();

        const type = 'text/plain';
        const filename = `${fileId}.txt`;
        const file = new File([text], filename, { type });

        payload.options.type = type;
        payload.options.filename = filename;
        payload.options.fileSize = file.size;

        const uploadLinkRes = await generateUploadLinkMutation.mutateAsync({
          datastoreId,
          type,
          filename,
        });

        const r = await axios.put(uploadLinkRes.url, file, {
          headers: {
            'Content-Type': type,
          },
        });

        console.log('upload result: ', uploadLinkRes.url, r)
      }

      if (payload.id) {
        await updateDatasourceMutation.mutateAsync(payload)
      } else {
        await createDatasourceMutation.mutateAsync(payload)
      }
    } catch(e) {
      console.error('error: ', e);
    } finally {
      setIsLoading(false);
    }
  }
  
  return {
    isLoading,
    saveDatasource,
    error: createDatasourceMutation.error || updateDatasourceMutation.error,
  }
}