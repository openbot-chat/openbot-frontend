import React from 'react'
import {
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  VStack,
} from '@chakra-ui/react'
import { FeatureCard } from './FeatureCard'
// import { FolderIcon } from 'assets/icons/FolderIcon'
import { AccessibilityIcon } from 'assets/icons/AccessibilityIcon'
// import { CalculatorIcon } from 'assets/icons/CaluclatorIcon'
import { ConditionIcon } from 'assets/icons/ConditionIcon'
import { PersonAddIcon } from 'assets/icons/PersonAddIcon'
// import { ShareIcon } from 'assets/icons/ShareIcon'

const features = [
  {
    Icon: AccessibilityIcon,
    title: 'Task Generalization',
    content:
      'One-stop solution to accomplish 80+ professional tasks ranging from daily life to work.',
  },
  {
    Icon: PersonAddIcon,
    title: 'Unhindered Cross-boundary Capability',
    content: 'One-stop solution for communicating and collaborating across different media, languages, and platforms.',
  },
  {
    Icon: ConditionIcon,
    title: 'Hyper-automation',
    content: 'One-stop solution to smartly and automatically fulfill your personalized tasks.',
  },
  // {
  //   Icon: CalculatorIcon,
  //   title: '全渠道执行任务',
  //   content: 'Openbot智能体具备触达全球用户的能力，你可以将智能体接入全球20多种社交平台、通信工具以及全球互联网去执行任务。',
  // },
  // {
  //   Icon: ShareIcon,
  //   title: '个性化学习能力',
  //   content: 'Openbot智能体能够深度学习你的个性化知识以及文字语音表达方式，你可以通过这种方式打专属于你的个性化智能体。',
  // },
  // {
  //   Icon: FolderIcon,
  //   title: '工具集成能力',
  //   content:
  //     'Openbot智能体通过API和100+第三方软件进行集成，具备学习和使用外部工具的能力。',
  // },
]

export const Features = () => {
  return (
    <Flex as="section" justifyContent="center">

      <Stack
        style={{ maxWidth: '1200px' }}
        pt={32}
        w="full"
        px="4"
        spacing={16}
        justifyContent="space-between"
        alignItems="center"
      >

        <Stack spacing={6} w="full">
          <Heading
            fontSize={{ base: '3xl', lg: '5xl', xl: '6xl' }}
            textAlign="center"
            data-aos="fade"
          >
            Why use Openbot autonomous agents to complete tasks?
          </Heading>
          {/* <Text
            textAlign="center"
            fontSize={{ base: 'lg', xl: 'xl' }}
            color="gray.400"
            data-aos="fade"
          >
            Openbot is a better way to ask for information. It leads to an
            increase in customer satisfaction and retention and multiply by 3
            your conversion rate compared to classical forms.
          </Text> */}
        </Stack>

        <VStack>
          <Heading as="h1" textAlign="center" data-aos="fade">
            Openbot offers three major value points.
          </Heading>
          {/* <Text
            color="gray.500"
            fontSize={['lg', 'xl']}
            textAlign="center"
            data-aos="fade"
          >
            Openbot makes form building easy and comes with powerful features
          </Text> */}
        </VStack>
        <SimpleGrid columns={[1, 3]} spacing="10" pt="10" data-aos="fade">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </SimpleGrid>
      </Stack>
    </Flex>
  )
}
