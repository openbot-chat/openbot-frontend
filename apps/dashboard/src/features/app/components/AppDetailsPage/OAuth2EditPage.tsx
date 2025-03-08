import { useEffect } from 'react'
import { CopyButton } from "@/components/CopyButton"
import { TextInput } from "@/components/inputs"
import { useToast } from "@/hooks/useToast"
import { trpc } from "@/utils/trpc-client"
import { ArrowBackIcon } from "@chakra-ui/icons"
import {
  Box,
  Avatar,
  Accordion, 
  AccordionButton, 
  AccordionIcon, 
  AccordionItem, 
  AccordionPanel, 
  Alert, 
  AlertDescription, 
  AlertTitle, 
  Card, 
  FormControl, 
  Heading, 
  HStack, 
  Input, 
  InputGroup, 
  InputRightElement, 
  RadioGroup, 
  Radio,
  Stack, 
  Tag,
  Text,
  FormLabel,
  FormHelperText,
  Flex,
  ButtonGroup,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabIndicator,
  Divider,
  AlertIcon,
} from "@chakra-ui/react"
import { Connection } from "models"
import { useTranslations } from "next-intl"
import { useMemo, useRef, useState } from "react"
import { AppProvider, useApp } from "../../context/AppProvider"
import { useConnection } from "../../context/ConnectionProvider"
import { HTTPRequestEditor, HTTPRequestEditorRef } from "../HTTPRequestEditor"
import { useOrganization } from '@/features/organization/context/OrganizationProvider'



function formatRequest(state) {
  let req
  if (state.mode === 'form') {
    req = {
      url: state.url,
      method: state.method,
      params: state.params?.filter(it => !!it.key)?.reduce((acc, it) => ({...acc, [it.key]: it.value }), {}),
      headers: state.headers?.filter(it => !!it.key)?.reduce((acc, it) => ({...acc, [it.key]: it.value }), {}),
      body: state.body?.filter(it => !!it.key)?.reduce((acc, it) => ({...acc, [it.key]: it.value }), {}),
    }
  } else {
    req = {
      code: state.code
    }
  }
  return req
}

function transformRequest(request?: Record<string, any>) {
  if (!request) return undefined

  const { params: _params = {} , headers: _headers = {}, body: _body = {}, ...rest } = request
  const params = Object.entries(_params).map(([key, value]) => ({ key, value }))
  const headers = Object.entries(_headers).map(([key, value]) => ({ key, value }))
  const body = Object.entries(_body).map(([key, value]) => ({ key, value }))

  return { params, headers, body, ...rest }
}

export const OAuth2EditPage = () => {
  const { showToast } = useToast()
  const t = useTranslations()
  const scoped = useTranslations('connection.oauth2')

  const { connection, save } = useConnection()
  const redirectUrl = useMemo(() => `${window.location.origin}/api/connection/${connection.id}/callback`, [connection])

  const [clientId, setClientId] = useState()
  const [clientSecret, setClientSecret] = useState()
  const [enablePkce, setEnablePkce] = useState(false)

  const authorizeReqRef = useRef<HTTPRequestEditorRef>()
  const accessTokenReqRef = useRef<HTTPRequestEditorRef>()
  const refreshTokenReqRef = useRef<HTTPRequestEditorRef>()
  const testReqRef = useRef<HTTPRequestEditorRef>()

  const authorizeRequest = useMemo(() => transformRequest(connection?.options?.oauthConfig?.authorize), [connection])
  const tokenRequest = useMemo(() => transformRequest(connection?.options?.oauthConfig?.token), [connection])
  const refreshRequest = useMemo(() => transformRequest(connection?.options?.oauthConfig?.refresh), [connection])

  useEffect(() => {
    if (!connection) return

    const secrets = connection.options?.secrets ?? {}

    setEnablePkce(connection.options?.oauthConfig?.enablePkce ?? false)
    setClientId(secrets.clientId)
    setClientSecret(secrets.clientSecret)
  }, [connection])

  const handleSave = async () => {
    const oauthConfig = {
      enablePkce,
      authorize: formatRequest(authorizeReqRef.current?.state),
      token: formatRequest(accessTokenReqRef.current?.state),
      refresh: formatRequest(refreshTokenReqRef.current?.state),
    }

    const test = formatRequest(testReqRef.current?.state)

    const toSaveConnection = {
      id: connection.id,
      options: {
        ...(connection.options || {}),
        oauthConfig,
        secrets: {
          clientId,
          clientSecret,
        },
        test,
      },
    }

    // 提交 connection
    await save(toSaveConnection)
  }

  return (
    <Stack spacing={4} p={4}>
      <Alert status='info' flexDirection='column' alignItems="flex-start">
        <AlertTitle mb={1}>
          What is OAuth v2?
        </AlertTitle>
        <AlertDescription>
          Oauth v2 authentication redirects users to your API’s site where they can authorize Openbot to access their account which sends a request token to Openbot that is exchanged for an access token. 
          <a href="#">Learn more.</a>
        </AlertDescription>
      </Alert>
      <Accordion defaultIndex={[0]} allowMultiple as={Stack} spacing={4}>
        <AccordionItem as={Card}>
          <AccordionButton as={HStack} spacing={2} cursor="pointer" py={4}>
            <AccordionIcon />
            <Tag variant='solid' rounded="full" colorScheme="twitter">Step 1</Tag>
            <Heading size="md">Configure Your Fields</Heading>
          </AccordionButton>
          <AccordionPanel as={Stack} spacing={4}>
            <Alert status='info' flexDirection='column' alignItems="flex-start">
              <AlertTitle mb={1}>
                Use Authentication Fields to:
              </AlertTitle>
              <AlertDescription>
                If your API’s OAuth Authorization URL does not require details about the user, click Continue to skip this step. Otherwise, add input fields for each item—such as subdomain or team name—that your API requires to show the Authorization page. Learn More.
If your OAuth v2 implementation is standard you don’t need to make any changes here!.
              </AlertDescription>
            </Alert>

            <Flex justifyContent="flex-end">
              <ButtonGroup>
                <Button colorScheme="twitter">Continue</Button>
              </ButtonGroup>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem as={Card}>
          <AccordionButton as={HStack} spacing={2} cursor="pointer" py={4}>
            <AccordionIcon />
            <Tag variant='solid' rounded="full" colorScheme="twitter">Step 2</Tag>
            <Heading size="md">Copy Your OAuth Redirect URL</Heading>
          </AccordionButton>
          <AccordionPanel as={Stack} spacing={4}>
            <Alert status='info' flexDirection='column' alignItems="flex-start">
              <AlertTitle mb={1}>
                Use Authentication Fields to:
              </AlertTitle>
              <AlertDescription>
                Copy the link below, then use it in your app’s API or developer settings to create a new integration or app to use with Openbot. 
                <a href="#">Learn More.</a>
              </AlertDescription>
            </Alert>

            <Text>Copy Openbot OAuth Redirect URL below, and add it to the allowed list in your app’s admin console if needed.</Text>
            <InputGroup size="md">
              <Input readOnly value={redirectUrl} />
              <InputRightElement width="4.5rem">
                <CopyButton h="1.75rem" size="sm" textToCopy={redirectUrl} />
              </InputRightElement>
            </InputGroup>

            <Flex justifyContent="flex-end">
              <ButtonGroup>
                <Button colorScheme="twitter">Continue</Button>
              </ButtonGroup>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem as={Card}>
          <AccordionButton as={HStack} spacing={2} cursor="pointer" py={4}>
            <AccordionIcon />
            <Tag variant='solid' rounded="full" colorScheme="twitter">Step 3</Tag>
            <Heading size="md">Enter Your Application Credentials</Heading>
          </AccordionButton>
          <AccordionPanel as={Stack} spacing={4}>
            <FormControl>
              <RadioGroup defaultValue="0" value={enablePkce ? "1" : "0"} onChange={(e) => setEnablePkce(e === "1")}>
                <Stack border="1px solid #ddd" borderRadius={2} p={4}>
                  <Radio value="0">
                    <Heading size="sm">
                      OAuth v2
                    </Heading>
                  </Radio>
                  <Text>
                    From your app’s API or developer settings, copy the Client ID and Secret from your app and paste them below.
                    <a href="#">Learn More.</a>
                  </Text>

                  <Radio value="1">
                    <Heading size="sm">
                      OAuth v2 with PKCE Extension
                    </Heading>
                  </Radio>
                  <Text>
                    PKCE (Proof Key for Code Exchange) is an extension of OAuth v2. It helps prevent certain types of attacks, such as authorization code interception. 
                    <a href="#">Learn More.</a>
                  </Text>
                </Stack>
              </RadioGroup>
            </FormControl>

            <TextInput 
              isRequired={true} 
              label={"Client ID"} 
              defaultValue={clientId} 
              helperText={'Copy Client ID from your app and enter here; may also be called Consumer Key or API Key. Referenced in Openbot requests as {{bundle.secrets.CLIENT_ID}}.'}
              onChange={(value) => setClientId(value)}
            />
            <TextInput 
              isRequired={!enablePkce}
              label={"Client Secret"} 
              defaultValue={clientSecret} 
              helperText={'Copy Client Secret from your app and enter here; may also be called Consumer Secret or API Secret. Referenced in Openbot requests as {{bundle.secrets.CLIENT_SECRET}}.'}
              onChange={(value) => setClientSecret(value)}
            />

            <Flex justifyContent="flex-end">
              <ButtonGroup>
                <Button colorScheme="twitter" onClick={handleSave}>Save & Continue</Button>
              </ButtonGroup>
            </Flex>
          </AccordionPanel>
        </AccordionItem>


        <AccordionItem as={Card}>
          <AccordionButton as={HStack} spacing={2} cursor="pointer" py={4}>
            <AccordionIcon />
            <Tag variant='solid' rounded="full" colorScheme="twitter">Step 4</Tag>
            <Heading size="md">Add OAuth v2 Endpoint Configuration</Heading>
          </AccordionButton>
          <AccordionPanel as={Stack} spacing={4}>
            <Alert status='info' flexDirection='column' alignItems="flex-start">
              <AlertDescription>
                Add the Authorization URL from your API—no additional settings are typically needed—optionally with comma-separated scopes. Then add your API’s Access Token request and refresh endpoints. Openbot includes the default fields, though click Show options to customize if needed. Finally add a test API call to test your authentication, and a connection label to identify accounts. 
                <a href="#">Learn More</a>.
              </AlertDescription>
            </Alert>

            <FormControl isRequired={true}>
              <FormLabel>Authorization URL</FormLabel>
              <FormHelperText mb={4}>
                Specify where to send users to authenticate with your API.
              </FormHelperText>

              <HTTPRequestEditor
                ref={authorizeReqRef}
                defaultMethod="GET"
                params={[
                  { key: 'client_id', value: '{{bundle.secrets.clientId}}'},
                  { key: 'redirect_uri', value: '{{bundle.inputData.redirect_uri}}' }
                ]}
                {...authorizeRequest}
                codeTemplate={"const url = `{{url}}?client_id=${bundle.secrets.clientId}&state=${bundle.inputData.state}&redirect_uri=${encodeURIComponent(bundle.inputData.redirect_uri)}&response_type=`;\nreturn url;"}
              />
            </FormControl>
          
            <FormControl>
              <FormLabel>Scope</FormLabel>
              <FormHelperText mb={4}>
                If you want to limit Openbot’s access to your app data, define the OAuth scopes with a comma or space separated list of values.
              </FormHelperText>
              <Input />
            </FormControl>

            <FormControl isRequired={true}>
              <FormLabel>Access Token Request</FormLabel>
              <FormHelperText mb={4}>
                Enter the API endpoint URL where Openbot sends the approval code on user redirect, typically via POST, and receives access_token in the response.
              </FormHelperText>

              <HTTPRequestEditor
                ref={accessTokenReqRef}
                defaultMethod="POST"
                headers={Object.entries({
                  'content-type': 'application/x-www-form-urlencoded',
                  'accept': 'application/json'
                }).map(([key, value]) => ({ key, value }))}
                body={Object.entries({
                  code: '{{bundle.inputData.code}}',
                  client_id: '{{bundle.secrets.CLIENT_ID}}',
                  client_secret: '{{bundle.secrets.CLIENT_SECRET}}',
                  grant_type: 'authorization_code',
                  redirect_uri: '{{bundle.inputData.redirect_uri}}',
                  code_verifier: '{{bundle.inputData.code_verifier}}',
                }).map(([key, value]) => ({ key, value }))}
                {...tokenRequest}
            />
            </FormControl>

            <FormControl isRequired={false}>
              <FormLabel>Refresh Token Request</FormLabel>
              <FormHelperText mb={4}>
                Enter the API endpoint URL where Zapier can request a refreshed access token when a RefreshAuthError error is thrown.
              </FormHelperText>

              <HTTPRequestEditor 
                ref={refreshTokenReqRef}
                defaultMethod="POST"
                headers={Object.entries({
                  'content-type': 'application/x-www-form-urlencoded',
                  'accept': 'application/json'
                }).map(([key, value]) => ({ key, value }))}
                body={Object.entries({
                  refresh_token: '{{bundle.authData.refresh_token}}',
                  grant_type: 'refresh_token',
                }).map(([key, value]) => ({ key, value }))}
                {...refreshRequest}
              />
            </FormControl>
          
            <FormControl>
              <FormLabel>Automatically Refresh Token</FormLabel>
              <FormHelperText mb={4}>
                Should Zapier invoke your <code>refreshAccessToken</code> request automatically when we receive a 401 response?
              </FormHelperText>
            </FormControl>

            <FormControl isRequired={true}>
              <FormLabel>Test</FormLabel>
              <FormHelperText mb={4}>
                Enter an API endpoint URL to test authentication credentials, ideally one needing no configuration such as /me.
              </FormHelperText>

              <HTTPRequestEditor 
                ref={testReqRef}
                defaultMethod="GET"
                headers={Object.entries({
                  'Authorization': 'Bearer {{bundle.authData.access_token}}',
                }).map(([key, value]) => ({ key, value }))}                
              />
            </FormControl>

            <Flex justifyContent="flex-end">
              <ButtonGroup>
                <Button colorScheme="twitter" onClick={handleSave}>Save & Continue</Button>
              </ButtonGroup>
            </Flex>
          </AccordionPanel>
        </AccordionItem>


        <AccordionItem as={Card}>
          <AccordionButton as={HStack} spacing={2} cursor="pointer" py={4}>
            <AccordionIcon />
            <Tag variant='solid' rounded="full" colorScheme="twitter">Step 5</Tag>
            <Heading size="md">Test your Authentication</Heading>
          </AccordionButton>
          <AccordionPanel as={Stack} spacing={4}>
            <AuthenticationTest />
            <Flex justifyContent="flex-end">
              <ButtonGroup>
                <Button colorScheme="twitter" onClick={handleSave}>Save & Finish</Button>
              </ButtonGroup>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

      </Accordion>
    </Stack>
  )
}


const AuthenticationTest = () => {
  const { app } = useApp()
  const { connection } = useConnection()
  const { organization } = useOrganization()
  const [tabIndex, setTabIndex] = useState(0)

  const { 
    response,
    error,
  } = useMemo(() => ({
    response: {},
    error: {},
  }), []) // useTest

  const handleConnect = async () => {
    if (!organization) return

    /*
    const { url } = await fetch(
    `/api/connection/${connection.id}/authorize`,
    {
      method: 'POST',
      body: JSON.stringify({
        orgId: organization.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())

    console.log('authorize url: ', url)
    */

    // TODO open window
    const params =
				'scrollbars=no,resizable=yes,status=no,titlebar=noe,location=no,toolbar=no,menubar=no,width=500,height=700'
    const title = `${connection.name} Authorization`

    // const splashUrl = `/api/proxy?url=${encodeURIComponent(url)}`
    const url = `/api/connection/${connection.id}/authorize?orgId=${organization.id}`

    const oauthPopup = window.open(url, title, params)

    const receiveMessage = (event: MessageEvent) => {
      // // TODO: Add check that it came from openbot
      // if (event.origin !== 'http://example.org:8080') {
      // 	return;
      // }


      console.log('receiveMessage: ', event.data)

      if (event.data === 'success') {
        window.removeEventListener('message', receiveMessage, false);

        console.log('oauth callback success')

        // TODO 刷新本地数据
        
        // Close the window
        if (oauthPopup) {
          oauthPopup.close()
        }
      }
    }

		window.addEventListener('message', receiveMessage, false)
  }

  return (
    <Tabs border="1px solid #ddd" borderRadius={2} position="relative" variant="unstyled" index={tabIndex} onChange={setTabIndex}>
      <TabList mt={2}>
        <Tab>Test Setup</Tab>
        <Tab>Response</Tab>
        <Tab>Bundle</Tab>
        <Tab>HTTP</Tab>
        <Tab>Console</Tab>
      </TabList>
      <TabIndicator
        mt="-1.5px"
        height="2px"
        bg="blue.500"
        borderRadius="1px"
      />
      <TabPanels>
        <TabPanel as={Stack} spacing={0} p={0}>
          <Stack spacing={2} p={4}>
            <Heading size="lg">Test your Authentication Configuration</Heading>
            <Text>
              Connect to your app using the above settings with a personal or testing account, and Openbot will use this connection to test API calls as you build the integration. <a href="#">Learn more.</a>
            </Text>
            <Button 
              size="lg"
              colorScheme="twitter" 
              leftIcon={<Avatar size="sm" src={app?.icon} name={app?.name} />}
              onClick={handleConnect}
            >
              {`Sign to ${app?.name}(${app?.version})`}
            </Button>
          </Stack>
          <Divider />
          <Stack spacing={2} p={4}>
            <Box>
              <Button colorScheme="blue">Test Authentication</Button>
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel>
          {error ? (
            <ErrorPanel
              onTestAgain={() => setTabIndex(0)}
            />
          ) : (
            response ? (<>stub</>) : (
              <Text>
                No test request made yet. Click &quot;Test Setup&quot; and &quot;Try it!&quot; at the bottom to make a test request and see its response here.
              </Text>
            )
          )}
        </TabPanel>
        <TabPanel>
        {error ? (
            <ErrorPanel
              onTestAgain={() => setTabIndex(0)}
            />
          ) : (
            response ? (<>stub</>) : (
              <Text>
                No test request made yet. Click &quot;Test Setup&quot; and &quot;Try it!&quot; at the bottom to make a test request and see its response here.
              </Text>
            )
          )}
        </TabPanel>
        <TabPanel>
        {error ? (
            <ErrorPanel
              onTestAgain={() => setTabIndex(0)}
            />
          ) : (
            response ? (<>stub</>) : (
              <Text>
                No test request made yet. Click &quot;Test Setup&quot; and &quot;Try it!&quot; at the bottom to make a test request and see its response here.
              </Text>
            )
          )}
        </TabPanel>
        <TabPanel>
        {error ? (
            <ErrorPanel
              onTestAgain={() => setTabIndex(0)}
            />
          ) : (
            response ? (<>stub</>) : (
              <Text>
                No test request made yet. Click &quot;Test Setup&quot; and &quot;Try it!&quot; at the bottom to make a test request and see its response here.
              </Text>
            )
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const ErrorPanel = ({
  onTestAgain,
}: {
  onTestAgain: () => void
}) => {
  return (<Stack spacing={4}>
    <Alert status="error" variant="left-accent" boxShadow="md" borderRadius={4}>
      <AlertIcon />
      <AlertTitle>
        Request Failed!
      </AlertTitle>
    </Alert>
    <Text>
      You need to choose a connected account or send something in the authData property.
    </Text>
    <Box>
      <Button colorScheme="blue" variant="outline" leftIcon={<ArrowBackIcon/>} onClick={() => onTestAgain?.()}>Test Again</Button>
    </Box>
  </Stack>)
}