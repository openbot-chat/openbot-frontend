import React, { ReactNode } from 'react'

import {
  Box,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react'
import { Logo } from 'assets/icons/Logo'
import { TextLink } from './TextLink'

// const facebookGroupUrl = 'https://www.facebook.com/groups/openbot'
// const openbotLinkedInUrl = 'https://www.linkedin.com/company/openbot'
// const openbotTwitterUrl = 'https://twitter.com/Openbot_chat'
// const baptisteTwitterUrl = 'https://twitter.com/baptisteArno'
export const contactUrl = 'https://bot.openbot.chat/landing-page-bubble-en'
export const roadmapLink = 'https://app.openbot.chat/feedback'
export const documentationLink = 'https://docs.openbot.chat'
export const githubRepoLink = 'https://github.com/botaas'

export const Footer = () => {
  return (
    <Box w="full">
      <Container as={Stack} maxW={'1000px'} py={10}>
        <SimpleGrid columns={[1, 2, 4]} spacing={8} px={2}>
          <Stack spacing={6}>
            <HStack>
              <Logo width={32} height={32} />
              <Heading as="p" fontSize="lg">
                Openbot
              </Heading>
            </HStack>
            {/* <Text>
              Made with ❤️ by{' '}
              <TextLink href={baptisteTwitterUrl}>@baptisteArno</TextLink>
            </Text> */}
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Product</ListHeader>
            {/* <TextLink href={documentationLink} isExternal>
              Documentation
            </TextLink>
            <TextLink href={roadmapLink} isExternal>
              Roadmap
            </TextLink> */}
            <TextLink href={'/pricing'}>Pricing</TextLink>
          </Stack>
          {/* <Stack align={'flex-start'}>
            <ListHeader>Community</ListHeader>
            <TextLink href={githubRepoLink} isExternal>
              GitHub repository
            </TextLink>
            <TextLink href={facebookGroupUrl} isExternal>
              Facebook Group
            </TextLink>
            <TextLink href={openbotTwitterUrl} isExternal>
              Twitter
            </TextLink>
            <TextLink href={openbotLinkedInUrl} isExternal>
              LinkedIn
            </TextLink>
          </Stack> */}
          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            {/* <TextLink href="/about">About</TextLink>
            <TextLink href="mailto:dev@openbot.chat">Contact</TextLink> */}
            <TextLink href={'/terms-of-service'}>Terms of Service</TextLink>
            <TextLink href={'/privacy-policies'}>Privacy Policy</TextLink>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Heading fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Heading>
  )
}
