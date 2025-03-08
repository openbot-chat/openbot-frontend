import { Flex, Stack, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { Flare } from 'assets/illustrations/Flare'
import { PersonalizedLearning } from 'components/Homepage/PersonalizedLearning'
import { ToolIntegration } from 'components/Homepage/ToolIntegration'

export const PersonalizedTasks = () => {
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
            Smartly and automatically fulfill your personalized tasks.
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Openbot autonomous agents can continuously learn from the latest data and external tools and work non-stop, 24/7, to automatically complete tasks for you.
          </Text>
        </Stack>

        <PersonalizedLearning />

        <ToolIntegration />

      </Stack>
    </Flex>
  )
}
