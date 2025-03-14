import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  useColorModeValue as mode,
  useDisclosure,
  Box,
  Link,
} from '@chakra-ui/react'
import { HamburgerIcon } from 'assets/icons'
// import { ChevronDownIcon } from 'assets/icons/ChevronDownIcon'
import { CloseIcon } from 'assets/icons/CloseIcon'
import { Logo } from 'assets/icons/Logo'
import * as React from 'react'
import { MobileMenu } from './MobileMenu'
// import { ResourcesMenu } from './ResourcesMenu'
// import Image from 'next/image'
// import logoSrc from 'public/images/logo.png'

export const Header = () => {
  // const { isOpen, onToggle } = useDisclosure()
  const { isOpen: isMobileMenuOpen, onToggle: onMobileMenuToggle } =
    useDisclosure()

  return (
    <Flex pos="relative" zIndex={10} w="full">
      <HStack
        as="header"
        aria-label="Main navigation"
        maxW="7xl"
        w="full"
        mx="auto"
        px={{ base: '6', md: '8' }}
        py="4"
        justify="space-between"
      >
        <Flex
          align="center"
          justify="space-between"
          className="nav-content__mobile"
          color={mode('white', 'white')}
        >
          <HStack as={Link} href="/" rel="home" ml="2">
            <Logo width={36} height={36} />
            {/* <Image
              src={logoSrc}
              alt="Openbot"
              placeholder="blur"
              style={{ width: '35px', height: '35px' }}
            /> */}
            <Heading as="p" fontSize="lg">
              Openbot
            </Heading>
          </HStack>
        </Flex>
        <Box display={['block', 'block', 'none']}>
          <IconButton
            aria-label={'Open menu'}
            icon={
              isMobileMenuOpen ? (
                <CloseIcon boxSize="20px" />
              ) : (
                <HamburgerIcon boxSize="20px" />
              )
            }
            variant="ghost"
            colorScheme="gray"
            onClick={onMobileMenuToggle}
          />
          <MobileMenu isOpen={isMobileMenuOpen} />
        </Box>
        <HStack as="nav" spacing={4} display={['none', 'none', 'flex']}>
          {/* <Flex>
            <Button
              rightIcon={<ChevronDownIcon />}
              onClick={onToggle}
              variant="ghost"
              colorScheme="gray"
              fontWeight={700}
            >
              Resources
            </Button>
            <ResourcesMenu isOpen={isOpen} />
          </Flex> */}
          <Button
            as={Link}
            href="/pricing"
            variant="ghost"
            colorScheme="gray"
            fontWeight={700}
          >
            Pricing
          </Button>
          <Button
            as={Link}
            href="https://dashboard.openbot.chat"
            colorScheme="twitter"
            variant="outline"
            fontWeight={700}
          >
            Sign in
          </Button>
          <Button
            as={Link}
            href="https://dashboard.openbot.chat"
            colorScheme="twitter"
            fontWeight={700}
          >
            Create an agent
          </Button>
        </HStack>
      </HStack>
    </Flex>
  )
}
