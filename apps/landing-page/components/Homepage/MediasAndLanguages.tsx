import { Flex, Stack, Heading, Box, Text, Button } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import connectAnywhereSrc from 'public/images/homepage/datasource.png'
import { ArrowRight } from 'assets/icons/ArrowRight'
import Link from 'next/link'

export const MediasAndLanguages = () => {
  return (
    <Flex as="section" justify="center">
      <Stack
        style={{ maxWidth: '1000px' }}
        w="full"
        px="4"
        spacing={12}
        direction={['column', 'row-reverse']}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing="6" maxW="300px" minW={[0, '300px']}>
          <Heading as="h1" data-aos="fade">
            Openbot Breaks the Limits of Media Forms and Languages
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: 'lg', xl: 'xl' }}
            data-aos="fade"
          >
            Utilizing the capabilities of AI models, Openbot overcomes sensory and language limitations. It can understand and synthesize any form and any language media for communication with users. You can also customize your own digital avatar on Openbot, completely cloning your voice, manner of speaking, and external appearance. Of course, you can also create imaginative 3D digital humans and participate in any game or metaverse world with a single click.
          </Text>
          <Flex>
            <Button
              as={Link}
              rightIcon={<ArrowRight />}
              href={`/register`}
              variant="ghost"
              data-aos="fade"
            >
              Try it now
            </Button>
          </Flex>
        </Stack>
        <Box rounded="md" data-aos="fade">
          <Image
            src={connectAnywhereSrc}
            alt="incomplete results illustration"
            placeholder="blur"
          />
        </Box>
      </Stack>
    </Flex>
  )
}
