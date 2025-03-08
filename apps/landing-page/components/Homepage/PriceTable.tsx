import { Flex, Stack, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { PlanComparisonTables } from 'components/PricingPage/PlanComparisonTables'

export const PriceTable = () => {
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
            Price Plan
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            We offer a variety of plans to fit from personal use to Enterprise use.
          </Text>
        </Stack>

        <VStack maxW="1200px" w="full" spacing={[12, 20]} px="4">
          <Stack w="full" spacing={10} display={['none', 'flex']}>
            {/* <Heading>Compare plans & features</Heading> */}
            <PlanComparisonTables />
          </Stack>
        </VStack>

      </Stack>

    </Flex>
  )
}
