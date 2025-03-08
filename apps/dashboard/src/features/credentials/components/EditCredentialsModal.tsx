import React, { useMemo, createRef, useState, useEffect } from 'react'
import {
  Text,
  Button,
  IconButton,
  HStack,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Alert,
  AlertIcon,
  Avatar,
  Stack,
  ButtonGroup,
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { EditableInput } from '@/components/EditableInput'
import {
  Credentials,
} from 'models'
import { DeleteIcon } from '@chakra-ui/icons'
import JSONForm from "@/components/JSONForm"
import { trpc } from '@/utils/trpc-client'
import { useToast } from '@/hooks/useToast'
import { Loading } from '@/components/Loading'
import { useTranslations } from 'next-intl'
import { PlusIcon } from '@/components/icons'
import { Logo } from '@/assets/icons/Logo'
import { DefaultAppIcons } from '@/constants'


const widgets = {
}



type Props = {
  isLoading?: boolean
  type?: string
  credentials?: Credentials
  isOpen: boolean
  onClose: () => void
  onEdit: (credentials: Partial<Credentials>) => void
}

export const EditCredentialsModal: React.FC<Props> = ({
  isLoading,
  isOpen,
  onClose,
  onEdit,
  type,
  credentials,
}) => {
  const scopedT = useTranslations('credentials.editCredentialsModal')
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()

  const { data: connection, isFetching } = trpc.connection.byIdentifier.useQuery(type, {
    enabled: !!type,
    refetchOnWindowFocus: false,
  })

  const deleteCredentialsMutation = trpc.credentials.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.datastore.list.invalidate()
      onClose()
    },
  })

  const schema = useMemo(() => connection?.options?.schema, [connection])
  const uiSchema = useMemo(() => connection?.options?.uiSchema, [connection])
  const formRef = createRef<Form>()
  const [name, setName] = useState()

  useEffect(() => {
    setName(credentials ? credentials.name : connection?.name)
  }, [credentials, connection])

  const edit = async (props) => {
    const { formData } = props;
    const data = {
      name,
      type: connection?.identifier,
      data: formData,
    }
    await onEdit?.(data)
  }

  const formData = useMemo(() => credentials?.data, [credentials])
  const Icon = type ? DefaultAppIcons[type] : undefined


  const onConnect = async () => {
    if (!formRef.current.validateForm()) {
      return
    }

    console.warn('connect: ', formRef.current)
    const credentials = await formRef.current.submit()

    if (!credentials) {
      return
    }

    // TODO 1. 去后端请求到 authorize 链接地址
    let url
    try {
      url = 'about:blank'
    } catch(e) {
      showToast({ description: '获取授权URL失败' })
      return
    }

    const params =
				'scrollbars=no,resizable=yes,status=no,titlebar=noe,location=no,toolbar=no,menubar=no,width=500,height=700';
    const title = `${connection.name} Authorization`
    const oauthPopup = window.open(url, title, params)

    const receiveMessage = (event: MessageEvent) => {
      // // TODO: Add check that it came from n8n
      // if (event.origin !== 'http://example.org:8080') {
      // 	return;
      // }
      console.log('oauth callback')

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

  // TODO app from connection
  const app = useMemo(() => ({
    theme: '#0087fd',
  }), [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      isCentered
      autoFocus={false}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent h="800">
        <ModalHeader 
          className={app?.theme ? `gradient theme-${app.theme.substring(1)}` : 'gradient theme-0087fd'}
          borderTopRadius="md"
        >
          <HStack spacing={4}>
            <HStack spacing={2}>
              <Logo boxSize="32px" />
              <PlusIcon />
              {
                app?.icon ? 
                  <Avatar boxSize="32px" rounded="8px" src={app.icon} name={app.name} />
                    :
                  (
                    Icon ? 
                    <Icon boxSize="32px" fill="white" />
                      :
                    <Avatar boxSize="32px" rounded="8px" name={app?.name} />
                  )
              }
            </HStack>
            <EditableInput value={name} onNewValue={setName} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white"/>
        <ModalBody>
          <Loading isLoading={isFetching}>
            <Stack
              h="full"
              py="2"
              w="100%"
              px="4"
              spacing={4}
              alignItems="flex-start"
            >
              {(!isFetching && !connection) && (
                <Text>Credentials Type {type} not exists</Text>
              )}
              {connection?.doc_url && (
                <Alert status="info" size="xs">
                  <AlertIcon />
                  {scopedT.rich('help', {
                    docLink: (chunks) => <Link color="green" target="_blank" href={connection.doc_url}>{chunks}</Link>
                  })}
                </Alert>
              )}
              {schema && (
                <JSONForm
                  ref={formRef}
                  schema={schema}
                  uiSchema={uiSchema}
                  className="w-full"
                  widgets={widgets}
                  formData={formData}
                  onSubmit={edit}
                  showErrorList={false}
                >
                  <Button type="submit" display="none"></Button>
                </JSONForm>
              )}

              {/* TODO 表单数据valid && */connection && (connection.identifier === 'oauth' || connection.identifier === 'twitter' || connection.identifier === 'shopify') && (
                <ButtonGroup isAttached>
                  <IconButton aria-label={connection.name} icon={Icon && <Icon boxSize="24px"/>} />
                  <Button colorScheme={type}  onClick={onConnect}>{scopedT('connectButton.label')}</Button>
                </ButtonGroup>
              )}
            </Stack>
          </Loading>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <IconButton 
              aria-label="Delete"
              icon={<DeleteIcon />} 
              isLoading={deleteCredentialsMutation.isLoading}
              isDisabled={!credentials || isLoading}
              onClick={() => credentials && deleteCredentialsMutation.mutateAsync(credentials.id)}
            />
            <Button 
              type="submit" 
              borderRadius="lg" 
              width="full"
              colorScheme="twitter"
              isLoading={isLoading}
              isDisabled={!connection || deleteCredentialsMutation.isLoading}
              onClick={() => formRef.current.submit()}
            >
              Save
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}