import { useMemo, useState, useRef, useCallback } from 'react';
import { trpc } from '@/utils/trpc-client';
import {
  Stack,
  VStack,
  Card,
  List,
  ListItem,
  HStack,
  Avatar,
  Text,
  Heading,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Link,
  useDisclosure,
  Box,
  Center,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useColorModeValue,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { ChevronDownIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { useEditCredentials } from '../../hooks/useEditCredentials'
import { EditCredentialsModal } from '../EditCredentialsModal'
import { useTranslations } from 'next-intl'
import { PlusIcon } from '@/components/icons'
import { SelectConnectionModal } from '../SelectConnectionModal'
import { Credentials, Connection } from 'models';
import {
  Virtuoso,
  Components,
} from 'react-virtuoso'
import dayjs from 'dayjs'
import { useConnections } from '../../hooks/useConnections'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { useDebounce } from 'use-debounce'
import { env } from '@openbot/env'
import { ParentModalProvider } from '@/features/graph/providers/ParentModalProvider'


export const CredentialsList = () => {
  const scopedT = useTranslations('credentials')
  const { organization } = useOrganization()
  const [keyword, setKeyword] = useState<string | undefined>(undefined)
  const [debouncedKeyword] = useDebounce(keyword, env.NEXT_PUBLIC_E2E_TEST ? 0 : 1000)

  const query = trpc.credentials.list.useInfiniteQuery({
    org_id: organization?.id as string,
    q: debouncedKeyword,
  }, {
    enabled: !!organization?.id,
  })
  const credentialsList = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data],
  )
  const [selected, setSelected] = useState()
  const [type, setType] = useState<string | undefined>()
  const { isOpen, onClose, onOpen, onEdit, isLoading } = useEditCredentials({ 
    credentials: selected,
    onEdit: async (credentials: Credentials) => {
      console.log('credentials updated: ', credentials)
    },
  })

  const { connectionMap } = useConnections()

  const fetchNextPageRef = useRef(query.fetchNextPage)
  fetchNextPageRef.current = query.fetchNextPage

  const itemStyles = useColorModeValue({ shadow: 'md', bgColor: 'gray.50' }, { bgColor: 'gray.700' })

  const virtuosoComponents: Partial<Components> = useMemo(() => {
    const EmptyPlaceholder: Components['EmptyPlaceholder'] = () => !query.isLoading ? (
      <Center>
        Empty
      </Center>
    ) : <></>

    const Footer: Components['Footer'] = () => query.isLoading ? (
      <>
        {query.isLoading && new Array(20).fill(1).map((it, i) => (
          <ListItem key={i} as={Card} variant="outline" mb="4">
            <Grid 
              templateAreas={`"icon name connections options"`}
              gridTemplateColumns={'64px 1fr 110px 48px'}
              gridTemplateRows={`1fr`}
              w="full"
              gap={'10px'}
              p={4}
            >
              <GridItem area={'icon'}>
                <SkeletonCircle size="12" />
              </GridItem>
              <GridItem as={Stack} area={'name'}>
                <SkeletonText />
              </GridItem>
              <GridItem as={HStack} area={'connections'}>
                <SkeletonText />
              </GridItem>
              <GridItem as={HStack} area={'options'}>
                <Skeleton width="10" height="10" />
              </GridItem>
            </Grid>
          </ListItem>
        ))}
      </>
    ) : <></>

    const Item: Components['Item'] = (props) => (
      <ListItem 
        {...props}
        as={Card} 
        variant='outline' 
        mb={4}
        _hover={itemStyles}
      />
    );

    return {
      EmptyPlaceholder,
      Footer,
      Item,
    };
  }, [itemStyles, query.isLoading]);

  const handleClick = useCallback(async (v: Credentials) => {
    setSelected(v)
    setType(v.type)

    onOpen()
  }, [onOpen])

  const credentialsRenderer = useCallback((credentials: Credentials) => {
    const connection = connectionMap[credentials.type] 

    return <CredentialsItem credentials={credentials} onClick={handleClick} connection={connection} />
  }, [connectionMap, handleClick])

  const endReached = () => {
    if (query.hasNextPage && fetchNextPageRef.current) {
      fetchNextPageRef.current()
    }
  }

  const handleSelectConnection = (connection: Connection) => {
    setSelected(undefined);
    setType(connection.identifier)
    onOpen()
  }

  return (
    <VStack w='full' h='full' maxW='1280px' spacing={8}>
      <HStack w='full' justifyContent="flex-end">
        <CreateCredentialsButton onSelect={handleSelectConnection} />
      </HStack>
      <EditCredentialsModal isLoading={isLoading} type={type} credentials={selected} isOpen={isOpen} onClose={onClose} onEdit={onEdit} />
      <Filter keyword={keyword} onKeywordChanged={setKeyword} />
      <List spacing={4} w='full' h='full' flex={1}>
        <Virtuoso
          style={{ height: "100%" }}
          components={virtuosoComponents}  
          atBottomThreshold={200}
          endReached={endReached}
          data={credentialsList}
          itemContent={(i, item) => credentialsRenderer(item)}
        />
      </List>
    </VStack>
  );
}

export const Filter = ({
  keyword,
  onKeywordChanged,
}: {
  keyword: string | undefined
  onKeywordChanged: (v: string) => void
}) => {
  const scopedT = useTranslations('credentials')

  return (
    <HStack justifyContent={"space-between"} w='full'>
      <HStack>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.300'/>
          </InputLeftElement>
          <Input placeholder={scopedT('searchInput.placeholder')} value={keyword} onChange={(e) => onKeywordChanged(e.target.value)} />
        </InputGroup>
      </HStack>
      <HStack>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {scopedT('sort.lastUpdated')}
          </MenuButton>
          <MenuList>
            <MenuItem>{scopedT('sort.lastUpdated')}</MenuItem>
            <MenuItem>{scopedT('sort.createDesc')}</MenuItem>
            <MenuItem>{scopedT('sort.nameAsc')}</MenuItem>
            <MenuItem>{scopedT('sort.nameDesc')}</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  )
}


type CreateCredentialsButtonProps = {
  type?: string
  onSelect?: (connection: Connection) => void
}

const CreateCredentialsButton = ({ type, onSelect }: CreateCredentialsButtonProps) => {
  const t = useTranslations()
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure()

  const handleSelect = (connection) => {
    onSelect?.(connection)
    onClose()
  }

  return (
    <ParentModalProvider>
      <SelectConnectionModal value={type} onClose={onClose} isOpen={isOpen} onSelect={handleSelect} />
      <Button colorScheme="twitter" leftIcon={<PlusIcon />} onClick={onOpen}>{t('credentials.create')}</Button>
    </ParentModalProvider>
  )
}


const CredentialsItem = ({
  onClick,
  connection,
  credentials,
}: {
  onClick: (credentials: Credentials) => void
  connection: Connection
  credentials: Credentials
}) => {
  const scopedT = useTranslations('credentials')

  return (
    <Grid
      templateAreas={`"icon name datasources tools channels options"`}
      gridTemplateColumns={'64px 1fr 110px 110px 110px 48px'}
      gridTemplateRows={`1fr`}
      w="full"
      gap={'10px'}
      p={4}
    >
      <GridItem as={HStack} area={'icon'}>
        <Avatar name={connection?.name} src={connection?.icon} />
      </GridItem>
      <GridItem as={HStack} area={'name'}>
        <Stack>
          <Heading size="sm">{credentials.name}</Heading>
          <HStack>
            <Text fontSize="xs">
              {connection?.name}
              | {scopedT('last_updated_at')}{dayjs(credentials.updated_at).fromNow()}
            </Text>
          </HStack>
        </Stack>
      </GridItem>
      <GridItem as={HStack} area={'datasources'}>
        <VStack>
          <Heading size="sm" fontWeight={700}>1</Heading>
          <Text size="sm">{scopedT('stats.datasources')}</Text>
        </VStack>
      </GridItem>
      <GridItem as={HStack} area={'tools'}>
        <VStack>
          <Heading size="sm" fontWeight={700}>1</Heading>
          <Text size="sm">{scopedT('stats.tools')}</Text>
        </VStack>
      </GridItem>
      <GridItem as={HStack} area={'channels'}>
        <VStack>
          <Heading size="sm" fontWeight={700}>1</Heading>
          <Text size="sm">{scopedT('stats.channels')}</Text>
        </VStack>
      </GridItem>
      <GridItem as={HStack} area={'options'}>
        <IconButton icon={<SettingsIcon/>} aria-label="Settings" onClick={() => onClick(credentials)} />
      </GridItem>
    </Grid>
)
}