import {
  Box,
  // Flex,
  Heading,
  // SimpleGrid,
  Stack,
  Text,
  VStack,
  // chakra
} from '@chakra-ui/react'
import * as React from 'react'
import { Header } from '../../common/Header/Header'
// import { BackgroundPolygons } from './BackgroundPolygons'
// import * as Logos from './Brands'
// import builderScreenshotSrc from 'public/images/homepage/builder.png'
// import backgroundSrc from 'public/images/homepage/hero-background-blue.png'
// import backgroundSrc from 'public/images/homepage/hero-background-red.png'
import { TryAgent } from '../TryAgent'

export const Hero = () => {
  return (
    <Box as="section" overflow="hidden" pos="relative">
      {/* <chakra.div
        pos="absolute"
        left="50%"
        top="72px"
        transform="translateX(-50%)"
        width="100%"
      >
        <Image
          src={backgroundSrc}
          alt="Openbot"
          placeholder="blur"
          // style={{ margin: "0 auto" }}
          style={{ width: "100%" }}
        />
      </chakra.div> */}
      <Header />
      <Stack mx="auto" py={10} pos="relative" px={[4, 0]}>
        {/* <BackgroundPolygons /> */}
        <VStack spacing={40} mb={0} alignItems="center">

          <VStack pt={['10', '20']} spacing="12" w="full">
            <Heading
              as="h1"
              fontSize={['4xl', '4xl', '5xl', '7xl']}
              textAlign="center"
              maxW="1000px"
              bgColor="#fff"
              // bgGradient="linear(to-r, blue.300, pink.300)"
              bgClip="text"
              data-aos="fade-up"
            >
              Build your multi-modal agent in a minute
            </Heading>
            <Text
              fontSize={['lg', 'xl']}
              maxW="800px"
              textAlign="center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {`One platform for creating collaborative goal-driven AI agents that are trained on custom data, using tools and accessed anywhere.`}
            </Text>
            {/* <Stack
              direction={['column-reverse', 'row']}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Button
                as={Link}
                href="https://dashboard.openbot.chat"
                size="lg"
              // height="3.375rem"
              // px="2rem"
              >
                Create your agent
              </Button>
            </Stack> */}

            <TryAgent />

          </VStack>

        </VStack>
        {/* <Flex justify="center" bgGradient="linear(to-b, gray.900, gray.800)">
          <VStack spacing="12" pb="32" maxW="7xl" px={4}>
            <Heading fontSize="25px" fontWeight="semibold" data-aos="fade">
              Loved by teams and creators from all around the world
            </Heading>
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              color="gray.400"
              alignItems="center"
              spacing={12}
              fontSize="4xl"
              data-aos="fade"
            >
              <Logos.IbanFirst />
              <Logos.Lemlist />
              <Logos.MakerLead />
              <Logos.Webisharp />
              <Logos.SocialHackrs />
              <Logos.PinpointInteractive />
              <Logos.Obole />
              <Logos.Awwwsome />
            </SimpleGrid>
          </VStack>
        </Flex> */}
      </Stack>
    </Box>
  )
}
