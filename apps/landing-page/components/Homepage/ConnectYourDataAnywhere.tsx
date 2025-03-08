import { Flex, Stack, Heading, Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import connectYourDataAnywhereSrc from 'public/images/homepage/connect-your-data-anywhere.png'

export const ConnectYourDataAnywhere = () => {
  return (
    <Flex as="section" justify="center">

      <Stack
        style={{ maxWidth: '1200px' }}
        pt={20}
        w="full"
        px="4"
        spacing={24}
        justifyContent="space-between"
        alignItems="center"
      >

        <Stack spacing={6} w="full">
          <Heading as="h1" textAlign="center" data-aos="fade">
            Connect your data anywhere
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Training AI agents from all data sources to build long-term memory and personalities.
          </Text>
        </Stack>

        <Stack
          w="full"
          spacing={12}
          direction={['column', 'column', 'row']}
          justifyContent="space-between"
          alignItems="center"
        >

          <Stack
            px="6"
            py="10"
            spacing={6}
            maxWidth="400px"
            minWidth="320px"
            bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
            rounded="xl"
            data-aos="fade"
          >
            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Documents
              </Text>
              <Text w='full' color="gray.300">
                PDFs, CSV, txt, Markdown, word, excel, ppt, etc.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Media
              </Text>
              <Text w='full' color="gray.300">
                Image, Audio, Video, etc.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Websites
              </Text>
              <Text w='full' color="gray.300">
                Automatically scrape and sync the content of websites.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                Cloud data sources
              </Text>
              <Text w='full' color="gray.300">
                Google Docs, Notion, Lark, Google Drive, OneDrive, Dropbox, iCloud, AWS, Azure, Google Cloud, Alibaba Cloud, etc.
              </Text>
            </VStack>

            <VStack spacing={0}>
              <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                IOT data sources
              </Text>
              <Text w='full' color="gray.300">
                Smart Home Devices like digital cameras, Wearable devices like Apple Vision Pro, sensor data, etc.
              </Text>
            </VStack>

          </Stack>

          <Box
            minWidth="320px"
            rounded="xl"
            data-aos="fade"
          >
            <Image
              src={connectYourDataAnywhereSrc}
              alt="connect your data anywhere"
              placeholder="blur"
            />
          </Box>
        </Stack>

      </Stack>
    </Flex>
  )
}
