import { Flex, Stack, Heading, Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import OnePlatformForCollaborativeAIWithAutonomySrc from 'public/images/homepage/one-platform-for-collaborative-ai-with-autonomy.png'

export const OnePlatformForCollaborativeAIWithAutonomy = () => {
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
            One Platform for collaborative AI with autonomy
          </Heading>
          {/* <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Openbot AI agents can interact with humans through multiple modalities, including vision, audition, language.
          </Text> */}
        </Stack>

        <Stack
          w="full"
          spacing={20}
          direction='column'
          justifyContent="space-between"
          alignItems="center"
        >

          <VStack
            maxWidth={1200}
            px={20}
            py={20}
            spacing={16}
            // bgGradient="linear(to-b, rgb(55,92,231), rgb(33,40,52))"
            rounded="xl"
            data-aos="fade"
          >

            <Stack
              w='full'
              direction={['column', 'column', 'column', 'row']}
              justifyContent='space-between'
              alignItems='flex-start'
              spacing={16}
            >
              <VStack spacing={0} width={400}>
                <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                  Achieve complex goals Autonomously
                </Text>
                <Text w='full' color="gray.300">
                  AI agents break down complex goals into smaller tasks and then executes them autonomously based on trained data, connected tools and LLMs.
                </Text>
              </VStack>


              <VStack spacing={0} width={400}>
                <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                  Human-AI collaboration
                </Text>
                <Text w='full' color="gray.300">
                  AI agents amplifying Human Potential—empowering the latter to produce A-Plus results. The process is collaborative, with AI tech responding to human guidance and detailed prompts on what to generate.
                </Text>
              </VStack>

            </Stack>

            <Stack
              w='full'
              direction={['column', 'column', 'column', 'row']}
              justifyContent='space-between'
              alignItems='flex-start'
              spacing={16}
            >
              <VStack spacing={0} width={400}>
                <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                  AI agent platform and marketplace
                </Text>
                <Text w='full' color="gray.300">
                  Worldwide users and AI agents cooperate as a new network to communicate, work, trade and have fun together without language barriers.
                </Text>
              </VStack>


              <VStack spacing={0} width={400}>
                <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                  AI safety
                </Text>
                <Text w='full' color="gray.300">
                  Openbot was built from the ground up by an experienced team with security, privacy, and compliance prioritized from day one.
                </Text>
              </VStack>

            </Stack>

          </VStack>

          <Box
            rounded="xl"
            data-aos="fade"
            maxWidth={1000}
          >
            <Image
              src={OnePlatformForCollaborativeAIWithAutonomySrc}
              alt="one platform for collaborative ai with autonomy"
              placeholder="blur"
            />
          </Box>

        </Stack>

      </Stack>

    </Flex>
  )
}
