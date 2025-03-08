import { Flex, Stack, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import eCommerceAgentSrc from 'public/images/homepage/e-commerce-agent.png'
import developerAgentSrc from 'public/images/homepage/developer-agent.png'
import educationAgentSrc from 'public/images/homepage/education-agent.png'
import financeAgentSrc from 'public/images/homepage/finance-agent.png'
import healthcareAgentSrc from 'public/images/homepage/healthcare-agent.png'
import marketingAgentSrc from 'public/images/homepage/marketing-agent.png'
import salesAgentSrc from 'public/images/homepage/sales-agent.png'

export const IntegrateAllToolsSeamlessly = () => {
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
            Integrate all tools Seamlessly
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Every tool can connect to your AI Agents via API in real-time to solve industry problems.
          </Text>
        </Stack>

        <Stack
          maxWidth={1200}
          spacing={12}
          direction={['column', 'column', 'column', 'row']}
          justifyContent="space-between"
          alignItems="center"
        >

          <Stack
            spacing={12}
            maxWidth="400px"
            minWidth="300px"
            data-aos="fade"
            direction="column"
          >

            <Stack
              px="6"
              py="10"
              spacing={6}
              bgGradient="linear(to-tr, rgb(55,92,231), rgb(33,40,52))"
              rounded="xl"
              data-aos="fade"
            >
              <VStack spacing={6} alignItems="flex-start">
                <Image
                  src={eCommerceAgentSrc}
                  alt="e-commerce agent"
                  placeholder="blur"
                />
                <VStack spacing={2}>
                  <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                    E-commerce Agent
                  </Text>
                  <Text w='full' color="gray.300">
                    Boost online sales and inventory management, using Shopify, WooCommerce, Amazon MWS APIs.
                  </Text>
                </VStack>
              </VStack>
            </Stack>

            <Stack
              px="6"
              py="10"
              spacing={6}
              bgColor="#1C1D21"
              borderColor="#646971"
              borderWidth={1}
              // bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
              rounded="xl"
              data-aos="fade"
            >
              <VStack spacing={6} alignItems="flex-start">
                <Image
                  src={marketingAgentSrc}
                  alt="marketing agent"
                  placeholder="blur"
                />
                <VStack spacing={2}>
                  <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                    Marketing Agent
                  </Text>
                  <Text w='full' color="gray.300">
                    Brand marketing and campaign analysis, using HubSpot, Mailchimp, Google Ads APIs.
                  </Text>
                </VStack>
              </VStack>
            </Stack>

          </Stack>

          <Stack
            spacing={12}
            maxWidth="400px"
            minWidth="300px"
            data-aos="fade"
            direction="column"
          >

            <Stack
              px="6"
              py="10"
              spacing={6}
              borderColor="#646971"
              borderWidth={1}
              // bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
              rounded="xl"
              data-aos="fade"
            >
              <VStack spacing={6} alignItems="flex-start">
                <Image
                  src={salesAgentSrc}
                  alt="sales agent"
                  placeholder="blur"
                />
                <VStack spacing={2}>
                  <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                    Sales Agent
                  </Text>
                  <Text w='full' color="gray.300">
                    AI generates sales proposals, quotes, follow-ups to boost sales, using Salesforce, Zoho CRM APIs.
                  </Text>
                </VStack>
              </VStack>
            </Stack>

            <Stack
              px="6"
              py="10"
              spacing={6}
              borderColor="#646971"
              borderWidth={1}
              // bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
              rounded="xl"
              data-aos="fade"
            >
              <VStack spacing={6} alignItems="flex-start">
                <Image
                  src={educationAgentSrc}
                  alt="education agent"
                  placeholder="blur"
                />
                <VStack spacing={2}>
                  <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                    Education Agent
                  </Text>
                  <Text w='full' color="gray.300">
                    Personalized course design for each student, using Canvas, Blackboard, Google Classroom APIs.
                  </Text>
                </VStack>
              </VStack>
            </Stack>

            <Stack
              px="6"
              py="10"
              spacing={6}
              borderColor="#646971"
              borderWidth={1}
              // bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
              rounded="xl"
              data-aos="fade"
            >
              <VStack spacing={6} alignItems="flex-start">
                <Image
                  src={financeAgentSrc}
                  alt="finance agent"
                  placeholder="blur"
                />
                <VStack spacing={2}>
                  <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                    Finance Agent
                  </Text>
                  <Text w='full' color="gray.300">
                    Plaid, Alpha Vantage, QuickFS APIs for financial data analysis and transactions.
                  </Text>
                </VStack>
              </VStack>
            </Stack>

          </Stack>

          <Stack
            spacing={12}
            maxWidth="400px"
            minWidth="300px"
            data-aos="fade"
            direction="column"
          >

            <Stack
              px="6"
              py="10"
              spacing={6}
              borderColor="#646971"
              borderWidth={1}
              // bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
              rounded="xl"
              data-aos="fade"
            >
              <VStack spacing={6} alignItems="flex-start">
                <Image
                  src={developerAgentSrc}
                  alt="developer agent"
                  placeholder="blur"
                />
                <VStack spacing={2}>
                  <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                    Developer Agent
                  </Text>
                  <Text w='full' color="gray.300">
                    Code management and project management, using GitHub, Stack Overflow, Jira APIs.
                  </Text>
                </VStack>
              </VStack>
            </Stack>

            <Stack
              px="6"
              py="10"
              spacing={6}
              borderColor="#646971"
              borderWidth={1}
              // bgGradient="linear(to-br, rgb(55,92,231), rgb(33,40,52))"
              rounded="xl"
              data-aos="fade"
            >
              <VStack spacing={6} alignItems="flex-start">
                <Image
                  src={healthcareAgentSrc}
                  alt="healthcare agent"
                  placeholder="blur"
                />
                <VStack spacing={2}>
                  <Text w='full' fontSize={{ base: 'lg', xl: 'xl' }} fontWeight="bold">
                    Healthcare Agent
                  </Text>
                  <Text w='full' color="gray.300">
                    Effortless Healthcare patient Data Management, using HL7 FHIR and Google Cloud Healthcare APIs
                  </Text>
                </VStack>
              </VStack>
            </Stack>

          </Stack>

        </Stack>

      </Stack>
    </Flex>
  )
}
