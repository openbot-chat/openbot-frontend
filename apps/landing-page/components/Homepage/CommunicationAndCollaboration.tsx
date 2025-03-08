import { Flex, Stack, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { Flare } from 'assets/illustrations/Flare'
import { MediasAndLanguages } from 'components/Homepage/MediasAndLanguages'
import { ConnectWorldwide } from 'components/Homepage/ConnectWorldwide'

export const CommunicationAndCollaboration = () => {
  return (
    <Flex as="section"
      direction="column"
      justify="center"
      alignItems="center"
      pos="relative">

      <Flare
        color="orange"
        pos="absolute"
        right="-200px"
        top="100px"
        data-aos="fade"
        data-aos-delay="500"
      />

      <Stack
        style={{ maxWidth: '1200px' }}
        pt={32}
        w="full"
        px="4"
        spacing={24}
        justifyContent="space-between"
        alignItems="center"
      >

        <Stack spacing={6} w="full">
          <Heading
            fontSize={{ base: '3xl', lg: '5xl', xl: '6xl' }}
            textAlign="center"
            data-aos="fade"
          >
            Communicating and collaborating across different media, languages, and platforms.
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Openbot autonomous agent breaks language, media form, and end-to-end limitations, connecting internet users worldwide.
          </Text>
        </Stack>

        <MediasAndLanguages />

        <ConnectWorldwide />

      </Stack>
    </Flex>
  )
}
