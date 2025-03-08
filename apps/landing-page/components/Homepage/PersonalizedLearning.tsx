import { Flex, Stack, Heading, Box, Text, Button } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import connectAnywhereSrc from 'public/images/homepage/datasource.png'
import { ArrowRight } from 'assets/icons/ArrowRight'
import Link from 'next/link'

export const PersonalizedLearning = () => {
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
            {`Openbot's Personalized Learning Ability`}
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: 'lg', xl: 'xl' }}
            data-aos="fade"
          >
            Openbot autonomous agents can learn from exclusive data of individuals and enterprises. You can upload text, voice, images, videos, files, or web page links to create a knowledge base for the autonomous agent to learn from.
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
