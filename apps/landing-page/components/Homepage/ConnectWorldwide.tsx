import { Flex, Stack, Heading, Box, Text, Button } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import chatAnywhereSrc from 'public/images/homepage/chat-anywhere.png'
import { ArrowRight } from 'assets/icons/ArrowRight'
import Link from 'next/link'

export const ConnectWorldwide = () => {
  return (
    <Flex as="section" justify="center">
      <Stack
        style={{ maxWidth: '1000px' }}
        w="full"
        px="4"
        spacing={12}
        direction={['column', 'row']}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing="6" maxW="300px" minW={[0, '300px']}>
          <Heading as="h1" data-aos="fade">
            Openbot Connects Internet Users Worldwide
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: 'lg', xl: 'xl' }}
            data-aos="fade"
          >
            Every Openbot autonomous agent can carry out cross-language and cross-media information gathering and communication collaboration through global social networks and instant messaging tools. Openbot autonomous agents will bring a brand new way of human-machine collaboration, creating a new value network.
          </Text>
          <Flex data-aos="fade">
            <Button
              as={Link}
              rightIcon={<ArrowRight />}
              href={`/register`}
              variant="ghost"
              colorScheme="orange"
            >
              Try it now
            </Button>
          </Flex>
        </Stack>
        <Box rounded="md" data-aos="fade">
          <Image
            src={chatAnywhereSrc}
            alt="incomplete results illustration"
            placeholder="blur"
          />
        </Box>
      </Stack>
    </Flex>
  )
}
