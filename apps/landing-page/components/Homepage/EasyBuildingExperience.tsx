import { Flex, Stack, Heading, Box, Text, Button } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import connectAnywhereSrc from 'public/images/homepage/datasource.png'
import { ArrowRight } from 'assets/icons/ArrowRight'
import { Flare } from 'assets/illustrations/Flare'
import Link from 'next/link'

export const EasyBuildingExperience = () => {
  return (
    <Flex as="section" justify="center" pos="relative">
      <Flare
        color="blue"
        pos="absolute"
        left="-200px"
        top="-50px"
        data-aos="fade"
        data-aos-delay="500"
      />
      <Stack
        style={{ maxWidth: '1000px' }}
        pt={'52'}
        w="full"
        px="4"
        spacing={12}
        direction={['column', 'row-reverse']}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing="6" maxW="300px" minW={[0, '300px']}>
          <Heading as="h1" data-aos="fade">
            Connect your data from anywhere
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: 'lg', xl: 'xl' }}
            data-aos="fade"
          >
            Connect your bot to you existing data and documents so it can give relevant answers to your customers, team, or whoever else might find it useful! we are adding more every day!
          </Text>
          <Flex>
            <Button
              as={Link}
              rightIcon={<ArrowRight />}
              href={`https://dashboard.openbot.chat/auth/signup`}
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
