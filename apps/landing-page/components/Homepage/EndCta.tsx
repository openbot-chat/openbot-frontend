import { Heading, Button, Flex, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BackgroundPolygons } from './Hero/BackgroundPolygons'

export const EndCta = () => {
  return (
    <VStack
      as="section"
      py={20}
      pos="relative"
      bgGradient="linear(to-b, gray.900, gray.800)"
      // height="100vh"
      justifyContent="center"
    >
      {/* <BackgroundPolygons /> */}
      {/* <VStack
        spacing="6"
        maxW="2xl"
        mx="auto"
        px={{ base: '6', lg: '8' }}
        py={{ base: '16', sm: '20' }}
        textAlign="center"
      >
        <Heading
          fontWeight="extrabold"
          letterSpacing="tight"
          data-aos="fade-up"
        >
          Empower your life and work
        </Heading>
        <Flex>
          <Button
            as={Link}
            href="/register"
            size="lg"
            colorScheme="orange"
            height="4rem"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Create an agent
          </Button>
        </Flex>

        <Text color="gray.400" data-aos="fade-up" data-aos-delay="400">
          No trial. Generous, unlimited <strong>free</strong> plan.
        </Text>
      </VStack> */}
    </VStack>
  )
}
