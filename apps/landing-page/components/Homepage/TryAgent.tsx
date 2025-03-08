import {
  Box,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import heroSplashScr from 'public/images/homepage/hero-splash.png'
import { HandDrawnArrow } from 'assets/illustrations/HandDrawnArrow'
import { Standard } from '@openbot/react'

export const TryAgent = () => {
  return (
    <VStack
      w='full'
      spacing={20}
    >
      <Box
        as="figure"
        shadow="lg"
        data-aos="zoom-out-up"
        data-aos-delay="800"
      >
        <Image
          src={heroSplashScr}
          alt="Builder screenshot"
          placeholder="blur"
          style={{ borderRadius: '10px' }}
        />
      </Box>

      <Box
        w='full'
        pos="relative"
        data-aos="fade-up"
      >
        <Box
          w='600px'
          h='582px'
          // bgGradient="linear(to-b, whiteAlpha.800, white)"
          bg='white'
          borderRadius='lg'
          overflow='hidden'
          mx='auto'
        >
          <Standard
            agent='4f5bf82b-ed6b-4879-8b68-afd3a8894c93'
            showAvatar
          />
        </Box>
        <Flex top="-60px" right="50%" pos="absolute" transform="translateX(360px)">
          <Text fontFamily="'Indie Flower'" fontSize="2xl">
            Try it out!
          </Text>
          <HandDrawnArrow
            transform="rotate(30deg)"
            boxSize="100px"
            top="15px"
            right="-60px"
            pos="absolute"
          />
        </Flex>
      </Box>
    </VStack>
  )
}
