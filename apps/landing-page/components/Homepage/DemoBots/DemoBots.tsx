import { Flex, Heading, Text, SimpleGrid, Stack, VStack } from '@chakra-ui/react'
import * as React from 'react'
import joshuaPictureSrc from 'public/images/homepage/joshua.jpg'
import julienPictureSrc from 'public/images/homepage/julien.jpeg'
// import nicolaiPictureSrc from 'public/images/homepage/nicolai.jpg'
// import annaFilouPictureSrc from 'public/images/homepage/annaFilou.jpeg'
// import theoPictureSrc from 'public/images/homepage/theo.jpeg'
// import abhayPictureSrc from 'public/images/homepage/abhay.jpeg'
// import lucasPictureSrc from 'public/images/homepage/lucas.png'
import oscarPictureSrc from 'public/images/homepage/oscar.jpeg'
// import invictuzPictureSrc from 'public/images/homepage/invictuz.png'
import laszloPictureSrc from 'public/images/homepage/laszlo.jpeg'
import kurniaPictureSrc from 'public/images/homepage/kurnia.jpeg'
// import marioPictureSrc from 'public/images/homepage/barretta.jpeg'
import stevePictureSrc from 'public/images/homepage/steve.jpg'
import { DemoBot } from './DemoBot'
import { StaticImageData } from 'next/image'

export type DemoBotData = {
  name: string
  avatarSrc?: StaticImageData
  provider: 'email' | 'productHunt' | 'capterra' | 'reddit'
  role?: string
  content: string | React.ReactNode
}

const demoBots: DemoBotData[][] = [
  [
    {
      name: 'Fitness Coach',
      // role: 'Growth Strategist @ Socialhackrs Media',
      role:
        'Make fitness plans and recommendations for you',
      avatarSrc: joshuaPictureSrc,
      provider: 'email',
      content:
        'Make fitness plans and recommendations for you',
    },
    {
      name: 'Trip Advisor',
      role: 'Help you plan your trip',
      provider: 'email',
      avatarSrc: laszloPictureSrc,
      content: (
        <>
          Openbot is one of the best chatbot builders with its intelligent
          features and drag-and-drop simplicity. Its UI/UX is an earthly
          paradise...
          <br />
          What&apos;s even more important is the person who stands behind it. He
          guarantees that the platform will work and progress for a long time.
        </>
      ),
    },
  ],
  [
    {
      name: 'GitHuber',
      role: 'Introducing trending projects on GitHub',
      provider: 'capterra',
      avatarSrc: oscarPictureSrc,
      content:
        'Within 5 minutes of signing up you can already have your bot running thanks to the templates it comes with. I have used many tools to make bots but none as simple, easy and powerful as Openbot.',
    },
    {
      name: 'Rap God',
      role: 'A rapper, a beacon of hope',
      avatarSrc: julienPictureSrc,
      provider: 'email',
      content:
        'I run Google ads all year long on our landing page that contains a openbot. I saw a 2x increase on our conversation rate compared to our old WordPress form.',
    },
  ],
  [
    {
      name: 'Shopping Assistant',
      role: 'Provides Amazon product recommendations',
      provider: 'email',
      avatarSrc: kurniaPictureSrc,
      content: (
        <>
          I have several chatbot builders, but Openbot is the one I use the
          most. It is simple to construct and very intuitive. <br />
          Integration with third-party applications is simple, and you can
          create the most sophisticated bots with its simplicity.
        </>
      ),
    },
    {
      name: 'Industry Analyst',
      provider: 'email',
      avatarSrc: stevePictureSrc,
      role: 'Providing industrial reports',
      content: (
        <>
          We built our own onboarding template last December for all signups for
          Stillio and it works fantastic and reliably.
          <br />
          <br />
          We send the collected data to a Make-com webhook and from there,
          post-process and send to Encharge (email drip campaigns) and Pipedrive
          (CRM).
          <br />
          We are now working on personalizing the email templates based on the
          answers (user industry and role) given in the openbot. We are big fan!
        </>
      ),
    },
  ],
]

export const DemoBots = () => {
  return (
    <Flex as="section" justify="center">
      <VStack spacing={12} px="4" maxW="1200px">
        <Stack spacing="6" minW={[0, '300px']}>
          <Heading textAlign={'center'} data-aos="fade">
            Rich Autonomous Task Capabilities with Openbot
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: 'lg', xl: 'xl' }}
            data-aos="fade"
          >
            Offering coverage for more than 80 professional service capabilities, Openbot autonomous agent decomposes and executes tasks based on your set objectives. In personal life, Openbot can assume a variety of roles, such as a personal assistant, encyclopedic knowledge expert, psychological counselor, and home tutor. Equally, in enterprise operations, Openbot is competent for numerous roles including finance & legal advisor, sales expert, marketing expert, strategic advisor, and customer service manager.
          </Text>
        </Stack>
        <SimpleGrid columns={[1, 2, 3]} spacing="12">
          {demoBots.map((testimonialGroup, index) => (
            <Stack key={index} spacing="10">
              {testimonialGroup.map((testimonial, index) => (
                <DemoBot key={index} {...testimonial} />
              ))}
            </Stack>
          ))}
        </SimpleGrid>
      </VStack>
    </Flex>
  )
}
