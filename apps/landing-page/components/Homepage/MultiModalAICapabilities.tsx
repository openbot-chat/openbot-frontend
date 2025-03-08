import { Flex, Stack, Heading, Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import multiModalAICapabilitiesSrc from 'public/images/homepage/multi-modal-ai-capabilities.png'

export const MultiModalAICapabilities = () => {
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
            Multi-Modal AI capabilities
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Openbot AI agents can interact with humans through multiple modalities, including vision, audition, language.
          </Text>
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
            bgGradient="linear(to-b, rgb(55,92,231), rgb(33,40,52))"
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
                  Understanding multimodal inputs
                </Text>
                <Text w='full' color="gray.300">
                  Understand text dialogue, voice commands, visual information from images and videos.
                </Text>
              </VStack>


              <VStack spacing={0} width={400}>
                <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                  Generating multimodal output
                </Text>
                <Text w='full' color="gray.300">
                  Able to produce text, images, 3D models and also clone your voice to make speech.
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
                  Multimodal reasoning
                </Text>
                <Text w='full' color="gray.300">
                  Integrate multimodal inputs for reasoning and decision making so that AI agents can plan and take actions considering complex environmental information.
                </Text>
              </VStack>


              <VStack spacing={0} width={400}>
                <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                  Natural interaction
                </Text>
                <Text w='full' color="gray.300">
                  Combining multiple modalities can achieve a natural human-machine interaction experience. For example, everyone can clone their own digital human, which is highly realistic and be able to interact with other humans naturally.
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
              src={multiModalAICapabilitiesSrc}
              alt="multi-modal ai capabilities"
              placeholder="blur"
            />
          </Box>

        </Stack>

      </Stack>
    </Flex>
  )
}
