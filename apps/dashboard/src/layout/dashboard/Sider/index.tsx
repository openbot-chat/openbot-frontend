import React from 'react'
import {
  VStack,
  useColorModeValue,
  StackProps,
  FlexProps,
  useDisclosure,
  Drawer,
  DrawerContent,
  IconButton,
  Flex,
  Divider,
  Icon,
} from '@chakra-ui/react'
import { AppIcon, DatastoreIcon, MarketplaceIcon, PlusIcon } from '@/components/icons'
import { useTranslations } from 'next-intl'
import { LogoWithRipple } from '@/components/LogoWithRipple'
import { HelpMenu } from './HelpMenu'
import { NavItem } from './NavItem'
import { AgentNavItem } from './AgentNavItem'
import { FaKey } from 'react-icons/fa'
import { AiFillTool } from 'react-icons/ai'
import { Link } from '@chakra-ui/next-js'
import { UserProfile } from '@/components/UserProfile'


type SiderbarProps = {
  onClose?: () => void
} & StackProps

export function Sidebar({ 
  ...rest
}: SiderbarProps) {
  const scopedT = useTranslations('nav')

  return (
    <VStack 
      justifyContent="space-between"
      spacing={4}
      h='full'
      {...rest}
    >
      <VStack pt={4}>
        <VStack py={4}>
          <Link 
            href="/"
          >
            <LogoWithRipple />
          </Link>
        </VStack>
        <Divider />

        <VStack color="twitter.500" py={4} spacing={4} w='full'>
          <NavItem icon={<MarketplaceIcon boxSize="24px" />} title={scopedT('marketplace')} href='/marketplace' />
          <AgentNavItem />
          {/*<NavItem icon={<ChatIcon fontSize={20} />} title={scopedT('chat')} href='/chats' />*/}
          <NavItem icon={<DatastoreIcon boxSize="24px" />} title={scopedT('datastores')} href='/datastores' />
          <NavItem icon={<Icon as={AiFillTool} boxSize="24px" />} title={scopedT('tools')} href='/tools' />
          <NavItem icon={<Icon as={FaKey} boxSize="24px" />} title={scopedT('credentials')} href='/credentials' />
        </VStack>
        <Divider />
        <NavItem icon={<Icon as={AppIcon} boxSize="24px" />} title={scopedT('apps')} href='/apps' />
      </VStack>
      {/*
      <Box flexGrow={1} pos="relative">
        <Link href="/subscriptions">
          <Button 
            width="140px"
            transform="rotate(90deg)"
            pos="absolute"
            top={50}
            left={-92}
            _hover={{
              left: '-86px'
            }}
            borderRadius={16}
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
            colorScheme="yellow"
          >
            {t('nav.subscriptions')}
          </Button>
        </Link>
      </Box>
      */}
      <VStack color="twitter.500" p='4' spacing='4' w='full'>
        <HelpMenu />
        <UserProfile />
      </VStack>
    </VStack>
  )
}

type MobileProps = {
  onOpen: () => void
} & FlexProps

export function MobileNav({ onOpen, ...rest }: MobileProps) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      alignItems="center"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<PlusIcon />} />
    </Flex>
  )
}


export function Sider() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex h='full'>
      <Sidebar />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/*<MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />*/}
    </Flex>
  )
}