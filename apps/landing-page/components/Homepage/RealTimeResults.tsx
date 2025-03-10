import { Flex, Stack, Heading, Text, Button, VStack } from '@chakra-ui/react'
// import { Standard } from '@openbot/react'
import { ArrowRight } from 'assets/icons/ArrowRight'
import { HandDrawnArrow } from 'assets/illustrations/HandDrawnArrow'
// import { PublicAgent, Agent } from 'models'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
// import { sendRequest } from '@openbot/lib'

// const nameBlockId = 'shuUtMDMw9P4iAHbz7B5SqJ'
// const messageBlockId = 'sqvXpT1YXE3Htp6BCPvVGv3'

export const RealTimeResults = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  // const [agent, setAgent] = useState<PublicAgent>()

  const fetchTemplate = async () => {
    /*
    const { data, error } = await sendRequest(
      `/agents/realtime-airtable.json`
    )
    if (error) return
    const agent = data as Agent
    setAgent({ ...agent, agentId: agent.id } as PublicAgent)
    */
  }

  useEffect(() => {
    fetchTemplate()
  }, [])

  // const refreshIframeContent = () => {
  //   if (!iframeRef.current) return
  //   iframeRef.current.src += ''
  // }

  // const handleAnswer = ({ blockId }: { blockId: string }) => {
  //   if ([nameBlockId, messageBlockId].includes(blockId))
  //     setTimeout(refreshIframeContent, 1000)
  // }

  return (
    <Flex as="section" justify="center">
      <Stack
        style={{ maxWidth: '1200px' }}
        pt={'52'}
        w="full"
        px="4"
        spacing={16}
        justifyContent="space-between"
        alignItems="center"
      >
        <VStack spacing={6}>
          <Heading
            fontSize={{ base: '4xl', xl: '6xl' }}
            textAlign="center"
            data-aos="fade"
          >
            Collect results in real-time
          </Heading>
          <Text
            textAlign="center"
            color="gray.400"
            maxW="1000px"
            fontSize={{ base: 'lg', xl: 'xl' }}
            data-aos="fade"
          >
            One of the main advantage of a chat application is that you collect
            the user&apos;s responses on each question.{' '}
            <strong>You won&apos;t lose any valuable data.</strong>
          </Text>
          <Flex>
            <Button
              as={Link}
              rightIcon={<ArrowRight />}
              href={`https://dashboard.openbot.chat/auth/signup`}
              variant="ghost"
              colorScheme="blue"
              data-aos="fade"
            >
              Try it now
            </Button>
          </Flex>
        </VStack>

        <Stack
          w="full"
          direction={['column', 'row']}
          spacing="4"
          data-aos="fade"
        >
          {/* {agent && (
            <Standard
              agent="airtable-real-time"
              apiHost="https://agent.chat"
              onAnswer={handleAnswer}
              style={{
                borderRadius: '0.375rem',
                borderWidth: '1px',
                height: '533px',
              }}
            />
          )} */}
          <iframe
            ref={iframeRef}
            src="https://airtable.com/embed/shr8nkV6DVN88LVIv?backgroundColor=blue"
            width="100%"
            height="533"
            style={{
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: 'white',
            }}
          />
          <Flex
            top="-60px"
            right="-30px"
            pos="absolute"
            display={{ base: 'none', xl: 'flex' }}
          >
            <Text fontFamily="'Indie Flower'" fontSize="2xl">
              It&apos;s a real Airtable view!
            </Text>
            <HandDrawnArrow
              transform="rotate(30deg)"
              boxSize="100px"
              top="15px"
              right="-60px"
              pos="absolute"
            />
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  )
}
