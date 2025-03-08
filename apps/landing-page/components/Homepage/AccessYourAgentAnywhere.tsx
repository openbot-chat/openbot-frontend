import { Flex, Stack, Heading, Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import accessYourDAgentAnywhereSrc from 'public/images/homepage/access-your-agent-anywhere.png'

export const AccessYourAgentAnywhere = () => {
  return (
    <Flex as="section" justify="center">

      <Stack
        style={{ maxWidth: '1200px' }}
        pt={40}
        w="full"
        px="4"
        spacing={24}
        justifyContent="space-between"
        alignItems="center"
      >

        <Stack spacing={6} w="full">
          <Heading as="h1" textAlign="center" data-aos="fade">
            Access your agent anywhere
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            AI agents can be accessed from any place and play different roles to help you.
          </Text>
        </Stack>

        <Stack
          w="full"
          spacing={12}
          direction={['column', 'column', 'row']}
          justifyContent="space-between"
          alignItems="center"
        >

          <Box
            minWidth="320px"
            rounded="xl"
            data-aos="fade"
          >
            <Image
              src={accessYourDAgentAnywhereSrc}
              alt="access your agent anywhere"
              placeholder="blur"
            />
          </Box>

          <Stack
            px="6"
            py="10"
            spacing={6}
            minWidth="320px"
            // bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
            rounded="xl"
            data-aos="fade"
          >
            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Embedding on websites
              </Text>
              <Text w='full' color="gray.300">
                WordPress, Shopify, etc.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Chatbot on channels
              </Text>
              <Text w='full' color="gray.300">
                Telegram, WhatsApp, Slack, Wechat, Facebook Messenger, QQ, SMS, Emails, Telephone calls, etc.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Copilot in software
              </Text>
              <Text w='full' color="gray.300">
                CRM, OA, etc.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Assistant in IOT devices
              </Text>
              <Text w='full' color="gray.300">
                iPhone, Apple Vision Pro , Electric vehicle, etc.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Player/NPC in Metaverse
              </Text>
              <Text w='full' color="gray.300">
                Roblox, Minecraft, etc.
              </Text>
            </VStack>

          </Stack>

        </Stack>

      </Stack>
    </Flex>
  )
}
