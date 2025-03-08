import { Flex, Stack, Heading, Box, Text, Button } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import chatAnywhereSrc from 'public/images/homepage/chat-anywhere.png'
import { ArrowRight } from 'assets/icons/ArrowRight'
import Link from 'next/link'

export const ToolIntegration = () => {
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
            {`Openbot's Massive Tool Integration Ability`}
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: 'lg', xl: 'xl' }}
            data-aos="fade"
          >
            {`Openbot Autonomous agents also have the ability to learn and use tools. All kinds of external tools can be seamlessly integrated with the autonomous agent via APIs, thus internalizing them as the agent's tools. In the process of task execution, the autonomous agent will automatically call on these tools, achieving hyper-automation of personalized tasks.`}
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
