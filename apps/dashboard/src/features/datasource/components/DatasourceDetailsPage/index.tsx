
import { DocumentTable } from '@/features/document/components/DocumentTable';
import { trpc } from '@/utils/trpc-client';
import { useParams } from 'next/navigation';
import {
  Container,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { HomeIcon } from '@/components/icons';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';


export const DatasourceDetailsPage = () => {
  const params = useParams();
  const t = useTranslations();
  const { data: datastore } = trpc.datastore.details.useQuery(params.id);
  const { data: datasource } = trpc.datasource.details.useQuery(params.datasource_id);

  return (
    <Container maxW="1280px">
      <Stack w="full" spacing={6} pt={4} alignItems="left">
        <Breadcrumb color="gray.500" fontWeight='medium' fontSize="sm" spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'><HomeIcon /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='/datastores'>{t('datastores')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/datastores/${datasource?.datastore_id}`}>{datastore?.name_for_model}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#'>{datasource?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <DocumentTable datasource={datasource} />
      </Stack>
    </Container>
  );
}