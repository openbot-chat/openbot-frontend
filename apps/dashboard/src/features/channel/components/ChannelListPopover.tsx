import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Heading, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Stack, Text, useDisclosure } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { ChannelList } from './ChannelList'
import { ChannelAccountList } from './ChannelAccountList'
import { TbPlug } from 'react-icons/tb'
import { CredentialsConnectForm } from './ConnectForms/CredentialsConnectForm'
import { DefaultAppIcons } from '@/constants'



type ViewRouterContextValue = {
  push: (path: string, params?: any) => void
  path: string
  params: any
}

const ViewRouterContext = createContext<ViewRouterContextValue>({})


const useViewRouter = () => useContext(ViewRouterContext)


const viewComponents = {
  'channels': {
    Header: () => {
      const scopedT = useTranslations('ChannelAccountPopover')
      return (
        <HStack w="full" p={4}>
          <Heading size="md">{scopedT('title')}</Heading>
        </HStack>
      )
    },
    Body: () => {
      const viewRouter = useViewRouter()
      
      return <ChannelList onSelect={(channel) => viewRouter.push('connect', { channel })}/>
    },
    Footer: () => {
      const scopedT = useTranslations('ChannelAccountPopover')
      const viewRouter = useViewRouter()
      return <Button w="full" variant="outline" onClick={() => viewRouter.push('accounts')}>{scopedT('gobackButton.label')}</Button>
    },
  },
  'connect': {
    Header: () => {
      const t = useTranslations()
      const viewRouter = useViewRouter()
      const { channel } = viewRouter.params
      const Icon = useMemo(() => DefaultAppIcons[channel.identifier], [channel.identifier])

      return (
        <HStack 
          spacing={2} 
          p={4}
          w="full"
          color="white"
          backgroundClip="padding-box"
          borderTopRadius="md"
          className={channel?.theme && `gradient theme-${channel.theme.substring(1)}`}
        >
          {channel.icon ? <Avatar boxSize="24px" name={channel.name} src={channel.icon} /> : Icon && <Icon boxSize="24px" fill="white" />}
          <Heading size="md">{channel.name}</Heading>
          {/*<Heading size="md">{t(`channels.${channel.identifier}.title`)}</Heading>*/}
        </HStack>
      )
    },
    Body: () => {
      const viewRouter = useViewRouter()
      const { channel } = viewRouter.params

      return <CredentialsConnectForm channel={channel} />
    },
    Footer: () => {
      const t = useTranslations()
      const viewRouter = useViewRouter()
      return <Button w="full" variant="outline" onClick={() => viewRouter.push('channels')}>{t('cancelButton.label')}</Button>
    },
  },
  'accounts': {
    Header: () => {
      const scopedT = useTranslations('ChannelAccountList')

      return (
        <HStack 
          w="full" 
          p={4}
        >
          <Heading size="md">{scopedT('title')}</Heading>
        </HStack>
      )
    },
    Body: () => {
      const scopedT = useTranslations('ChannelAccountPopover')
      const viewRouter = useViewRouter()

      return (
        <Stack spacing={2}>
          <Button variant="outline" colorScheme="twitter" onClick={() => viewRouter.push('channels')} leftIcon={<TbPlug/>}>{scopedT('connectButton.label')}</Button>
          <ChannelAccountList onSelect={(item) => viewRouter.push('account_details', { channelAccount: item })}/>
        </Stack>
      )
    },
  },
  'account_details': {
    Header: () => {
      const t = useTranslations()
      const viewRouter = useViewRouter()
      const { channelAccount } = viewRouter.params
      const Icon = useMemo(() => DefaultAppIcons[channelAccount.provider], [channelAccount.provider])
      const channel = {
        theme: '#96bf48'
      }

      return (
        <HStack 
          p={4}
          w="full"
          color="white"
          backgroundClip="padding-box"
          borderTopRadius="md"
          className={channel?.theme && `gradient theme-${channel.theme.substring(1)}`}
        >
          {channelAccount.icon ? <Avatar name={channelAccount.name} src={channelAccount.icon} /> : Icon && <Icon boxSize="24px" fill="white" />}
          <Heading size="md">{channelAccount.provider}</Heading>
        </HStack>
      )
    },
    Body: () => {
      const scopedT = useTranslations('ChannelAccountPopover')
      const viewRouter = useViewRouter()

      const { channelAccount } = viewRouter.params

      return (
        <Stack spacing={2}>
          <Text>{channelAccount.name}</Text>
        </Stack>
      )
    },
    Footer: () => {
      const t = useTranslations()
      const viewRouter = useViewRouter()

      return (
        <HStack spacing={2}>
          <Button variant="outline" onClick={() => viewRouter.push('accounts')}>{t('cancelButton.label')}</Button>
          <Button colorScheme="twitter" onClick={() => viewRouter.push('accounts')}>{t('saveButton.label')}</Button>
        </HStack>
      )
    }
  },
}

type Props = {
  trigger: React.ReactNode
  onClose?: () => void
}

export const ChannelListPopover: React.FC<Props> = ({
  trigger,
  onClose: onClose_,
}) => {  
  const { onOpen, onClose, isOpen } = useDisclosure()

  const onFinish = () => {
    onClose()

    onClose_?.()
  }

  return (
    <Popover 
      closeOnBlur={false} 
      isLazy={true} 
      onClose={onClose} 
      isOpen={isOpen} 
      onOpen={onOpen}
      lazyBehavior='unmount'
    >
      <PopoverTrigger>
        {trigger}
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="440px" maxH="80vh">
          <PopoverArrow />
          <ChannelListPopoverInner onFinish={onFinish} />
        </PopoverContent>
      </Portal>
    </Popover>
  )
}


type Props2 = {
  onFinish: () => void
}

export const ChannelListPopoverInner: React.FC<Props2> = ({
  onFinish,
}) => {
  const [view, setView] = useState<{ path: string; params?: any }>({ path: 'channels', params: {} })
  const channelAccounts = useMemo(() => [
    {
      id: '1',
      provider: 'wechat',
      name: 'hahah',
      avatar: '',
    },
    {
      id: '2',
      provider: 'wechat',
      name: 'hahah',
      avatar: '',
    }
  ], [])

  useEffect(() => {
    if (channelAccounts.length > 0) {
      setView({ path: 'accounts' })
    }
  }, [channelAccounts])

  const push = useCallback((path: string, params?: any) => {
    setView({ path, params })
  }, [])

  const viewComps = useMemo(() => viewComponents[view.path], [view.path])
  const { Header, Body, Footer } = viewComps ?? {}

  return (
    <ViewRouterContext.Provider value={{
      push,
      path: view.path,
      params: view.params,
    }}>
      <PopoverHeader 
        as={HStack} 
        p={0}
        backgroundImage={`-webkit-linear-gradient(-25deg, gray.500 0%, gray.700 100%)`}
        backgroundClip="padding-box"
        borderTopRadius="md"
        color="white"
      >
        <Header />
      </PopoverHeader>
      <PopoverCloseButton size="lg" color="white"/>
      <PopoverBody p={4} overflowY="auto" h="full">
        {Body && <Body />}
      </PopoverBody>
      {
        Footer && (
          <PopoverFooter p={4}>
            <Footer />
          </PopoverFooter>
        )
      }
    </ViewRouterContext.Provider>
  )
}