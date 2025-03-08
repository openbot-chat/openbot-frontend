import { Flex, Stack, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { Flare } from 'assets/illustrations/Flare'
import { DemoBots } from 'components/Homepage/DemoBots'
import { CollaborativeAblities } from 'components/Homepage/CollaborativeAblities'

export const ProfessionalTasks = () => {
  return (
    <Flex as="section"
      direction="column"
      justify="center"
      alignItems="center"
      pos="relative">

      <Flare
        color="blue"
        pos="absolute"
        left="-200px"
        top="-50px"
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
            Accomplish 80+ professional tasks ranging from daily life to work.
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Openbot autonomous agent, being versatile and adept at completing a variety of tasks as per your specified objectives.
          </Text>
        </Stack>

        <DemoBots />

        <CollaborativeAblities />

      </Stack>

    </Flex>
  )
}
