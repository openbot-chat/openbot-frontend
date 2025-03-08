import { UrlInput } from "@/components/UrlInput"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { 
  Box,
  Button,
  CloseButton, 
  Flex, 
  Grid, 
  GridItem,
  HStack,
  Input, 
  Stack, 
  Switch, 
  Tab, 
  TabList, 
  TabPanel, 
  TabPanels, 
  Tabs,
  Text,
} from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { useEffect, useState, useMemo } from "react"
import { useHTTPRequestEditor } from "./context"




export const HTTPRequestFormEditor = () => {
  const {
    url,
    method,
    setUrl,
    setMethod,
  } = useHTTPRequestEditor()

  return (
    <>
      <UrlInput 
        method={method}
        url={url}
        onChangeMethod={setMethod}
        onChangeUrl={setUrl}      
      />
      <ClosableCard 
        showTitle="Show Options"
        hideTitle="Hide Options"
      >
        <HttpRequestForm />
      </ClosableCard>
    </>
  )
}



type ClosableCardProps = {
  showTitle: string
  hideTitle: string
  isShow?: boolean
  children: React.ReactNode
}

const ClosableCard = ({
  showTitle,
  hideTitle,
  isShow: _isShow = false,
  children,
}: ClosableCardProps) => {
  const [isShow, setIsShow] = useState(false)
  useEffect(() => setIsShow(_isShow),[_isShow])

  return (
    <Stack>
      <Flex justifyContent="flex-end">
        <Button 
          onClick={() => setIsShow(!isShow)} 
          size="sm" 
          leftIcon={!isShow ? <ChevronDownIcon/> : <ChevronUpIcon/>} 
          colorScheme="twitter" 
          variant="outline"
        >
          {!isShow ? showTitle : hideTitle}
        </Button>
      </Flex>
      {isShow && (
        <Box>
          {children}
        </Box>
      )}
    </Stack>
  )
}


export const HttpRequestForm = () => {
  const {
    params, 
    addParam,
    setParam,
    deleteParam,
  } = useHTTPRequestEditor()

  const {
    headers,
    addHeader,
    setHeader,
    deleteHeader,
  } = useHTTPRequestEditor()

  const {
    body,
    addBodyItem,
    setBodyItem,
    deleteBodyItem,
  } = useHTTPRequestEditor()

  const {
    method,
  } = useHTTPRequestEditor()

  const isDisabled = useMemo(() => ['GET', 'HEAD'].indexOf(method) !== -1, [method])

  return (
    <Tabs>
      <TabList>
        <Tab>URL Params</Tab>
        <Tab>HTTP Headers</Tab>
        <Tab isDisabled={isDisabled}>Request Body</Tab>
        <Tab>Options</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <Stack spacing={2} p={2}>
            {params?.map((it, i) => (
              <KeyValueItem 
                key={i} 
                item={it}
                onDelete={() => deleteParam(i)}
                onChange={(item) => setParam(item, i)}
              />
            ))}
            <Flex>
              <Button variant="outline" colorScheme="twitter" onClick={() => addParam({ key: '', value: ''})}>Add</Button>
            </Flex>
          </Stack>
        </TabPanel>
        <TabPanel p={0}>
          <Stack spacing={2} p={2}>
            {headers?.map((it, i) => (
              <KeyValueItem 
                key={i} 
                item={it}
                onDelete={() => deleteHeader(i)}
                onChange={(item) => setHeader(item, i)}
              />
            ))}
            <Flex>
              <Button variant="outline" colorScheme="twitter" onClick={() => addHeader({ key: '', value: ''})}>Add</Button>
            </Flex>
          </Stack>
        </TabPanel>
        <TabPanel p={0}>
          <Stack spacing={2} p={2}>
            {body?.map((it, i) => (
              <KeyValueItem 
                key={i} 
                isDisabled={isDisabled}
                item={it}
                onDelete={() => deleteBodyItem(i)}
                onChange={(item) => setBodyItem(item, i)}
              />
            ))}
            <Flex>
              <Button variant="outline" colorScheme="twitter" onClick={() => addBodyItem({ key: '', value: ''})}>Add</Button>
            </Flex>
          </Stack>
        </TabPanel>
        <TabPanel>
          <Stack spacing={2}>
            <HStack spacing={2}>
              <Switch size="lg" />
              <Text>Automatically omit parameters that are empty</Text>
            </HStack>
            <HStack spacing={2}>
              <Switch size="lg" />
              <Text>Automatically omit fields in the request body that are empty</Text>
            </HStack>
          </Stack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}


type KeyValueItemProps = {
  item: { 
    key: string
    value: string
  }
  isDisabled?: boolean
  onDelete: () => void
  onChange: (item: {
    key: string
    value: string  
  }) => void
}

const KeyValueItem = ({
  item,
  isDisabled = false,
  onDelete,
  onChange,
}: KeyValueItemProps) => {
  const scopedT = useTranslations('requestEditor')
  
  return (
    <Grid templateColumns='repeat(2, 1fr) 32px' gap={2} alignItems="center">
      <GridItem>
        <Input isDisabled={isDisabled} placeholder={scopedT('keyInput.placeholder')} value={item?.key} onChange={(e) => onChange({ key: e.target.value, value: item.value })} />
      </GridItem>
      <GridItem>
        <Input isDisabled={isDisabled} placeholder={scopedT('valueInput.placeholder')} value={item?.value} onChange={(e) => onChange({ key: item.key, value: e.target.value })} />
      </GridItem>
      <GridItem>
        <CloseButton isDisabled={isDisabled} onClick={onDelete} />
      </GridItem>
    </Grid>
  )
}