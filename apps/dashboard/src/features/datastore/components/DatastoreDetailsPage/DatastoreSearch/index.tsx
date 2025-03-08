import { useMemo, useState } from 'react';
import {
  Datastore,
  DocumentChunk,
} from 'models';

import { Link } from '@chakra-ui/next-js';

import {
  List,
  ListItem,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  chakra,
  Center,
  Container,
  Stack,
  VStack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  HStack,
  Heading,
  Button,
  Flex,
  Tag,
  Card,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
  Divider,
  useColorModeValue,
  SkeletonText,
  Box,
} from '@chakra-ui/react';
import { ChevronDownIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { DocumentPreview } from '@/features/document/components/DocumentPreview/DocumentPreview';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { trpc } from '@/utils/trpc-client';
import { useDebounce } from 'use-debounce'

type Props = {
  datastore: Datastore;
}

export const DatastoreSearch = ({
  datastore,
}: Props) => {
  const t = useTranslations();
  const [query, setQuery] = useState<string>('');
  const [score_threshold, setScore_threshold] = useState<number>(0.6);
  const [datastoreId, setDatastoreId] = useState<string | undefined>(undefined);
  const [activeDocumentChunk, setActiveDocumentChunk] = useState<DocumentChunk | undefined>();

  const [debouncedQuery] = useDebounce(query, 500);

  const documentSearchQuery = trpc.datastore.query.useQuery({
    datastore_id: datastore.id,
    query: {
      query: debouncedQuery,
      filter: {
        source_id: datastoreId,
      },
      score_threshold,
    },
  });

  return (
    <VStack w='full' spacing={4}>
      <HStack w='full' spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.300'/>
          </InputLeftElement>
          <Input placeholder={t("document.search.placeholder")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </InputGroup>
        <Slider 
            aria-label='Pitch' 
            value={score_threshold} 
            onChange={(value) => setScore_threshold(value)} 
            min={0.0}
            max={1}
            step={0.1}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg='blue.500'
              color='white'
              placement='top'
              label={score_threshold}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
      </HStack>

      <List w="full" spacing="4">
        {documentSearchQuery.data?.results?.map((chunk, i) => (
          <ListItem key={i}>
            <DocumentChunkItem key={i} chunk={chunk}/>
          </ListItem>
        ))}
      </List>

      <HStack justifyContent="space-between" w='full'>
        <Button 
          leftIcon={<ChevronLeftIcon />} 
          isDisabled={!documentSearchQuery.data?.previous_page}
          onClick={() => {
            // const query = new URLSearchParams(searchParams?.toString() ?? '');
            // query.set('cursor', documentListQuery.data?.previous_page)
            // router.replace(`${pathname}?${query.toString()}`);
          }}
        >
          Previous
        </Button>
        <Button 
          rightIcon={<ChevronRightIcon />}
          isDisabled={!documentSearchQuery.data?.next_page}
          onClick={() => {
            // const query = new URLSearchParams(searchParams?.toString() ?? '');
            // query.set('cursor', documentListQuery.data?.next_page)
            // router.replace(`${pathname}?${query.toString()}`);
          }}
        >
          Next
        </Button>
      </HStack>
      {/*
      <EditDocumentModal isLoading={documentQuery.isLoading || updateDocumentMutation.isLoading} isOpen={!!activeDocument} onClose={() => setActiveDocument(undefined)} document={documentQuery.data} onEdit={handleEdit} />
        */}
    </VStack>
  );
}


type DocumentChunkItemProps = {
  chunk: DocumentChunk;
}


const DocumentChunkItem = ({
  chunk,
}: DocumentChunkItemProps) => {
  const t = useTranslations();
  const datasourceQuery = trpc.datasource.details.useQuery(chunk.metadata.source_id, {
    enabled: !!chunk.metadata.source_id,
  });

  const document = {
    metadata_: chunk.metadata,
  }

  return (
    <Card w="full">
      <Stack p={4}>
        <Flex>
          <Center w="240px" h="180px" position="relative" overflow="hidden">
            <DocumentPreview document={document} />
          </Center>
          <Stack spacing={2} flex={1}>
            <HStack spacing={4}>
              <Text>
                {t("document.type")}: <Tag>{chunk.metadata?.file_type ?? chunk.metadata?.source_type}</Tag>
              </Text>
              <Text colorScheme="twitter">
                {t("datasource.title")}: <Link color="twitter.500" href={`/datastores//${datasourceQuery?.data?.datastore_id}/datasources/${datasourceQuery?.data?.id}`}>{datasourceQuery?.data?.name}</Link>
              </Text>
              <Text>
                {t("document.chunk.document_source")}: <Tag>{chunk.metadata?.title ?? chunk.metadata?.source}</Tag>
              </Text>
            </HStack>
            <Text
              textOverflow="ecllipsis"
              overflow="hidden"
              wordBreak="break-word"
            >
              {chunk.text}
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Card>
  );
}