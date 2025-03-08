import { useAgent } from "@/features/agent/providers/AgentProvider"
import { EditableUrl } from "@/features/deploy/components/EditableUrl"
import { useToast } from "@/hooks/useToast"
import { trpc } from "@/utils/trpc-client"
import { Stack, Heading, Wrap, Flex } from "@chakra-ui/react"
import { isDefined, isNotDefined } from '@openbot/lib'
import { integrationsList } from './embeds/EmbedButton'
import { env } from '@openbot/env'



export const EmbedsSection = () => {
  const { agent, save } = useAgent()
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()

  const publicId = agent?.identifier ?? ''
  // const isPublished = isDefined(publishedAgent)

  const handlePublicIdChange = async (identifier: string) => {
    save({ identifier })
  }

  const checkIfPathnameIsValid = (pathname: string) => {
    const isCorrectlyFormatted =
      /^([a-z0-9]+-[a-z0-9]*)*$/.test(pathname) || /^[a-z0-9]*$/.test(pathname)

    if (!isCorrectlyFormatted) {
      showToast({
        description:
          'Should contain only contain letters, numbers. Words can be separated by dashes.',
      })
      return false
    }
    return true
  }

  const checkIfPublicIdIsValid = async (publicId: string) => {
    const isLongerThanAllowed = publicId.length >= 4
    if (!isLongerThanAllowed) {
      showToast({
        description: 'Should be longer than 4 characters',
      })
      return false
    }

    if (!checkIfPathnameIsValid(publicId)) return false

    
    const data = await trpcContext.agent.identifierAvailable.fetch(publicId);
    console.warn('identifierAvailable data: ', data, data?.isAvailable)
    if (!data?.isAvailable) {
      showToast({ description: 'ID is already taken' })
      return false
    }

    return true
  }

  return (
    <Flex h="full" w="full" justifyContent="center" align="flex-start">
      <Stack maxW="1000px" w="full" pt="10" spacing={10}>
        <Stack spacing={4} align="flex-start">
          <Heading fontSize="2xl" as="h1">
            Your Agent link
          </Heading>
          {agent && (
              <EditableUrl
                hostname={env.NEXT_PUBLIC_VIEWER_URL[0] ?? 'https://viewer.openbot.chat'}
                pathname={publicId}
                isValid={checkIfPublicIdIsValid}
                onPathnameChange={handlePublicIdChange}
              />
          )}
        </Stack>
        <Stack spacing={4}>
          <Heading fontSize="2xl" as="h1">
            Embed your Agent
          </Heading>
          <Wrap spacing={6}>
            {integrationsList.map((IntegrationButton, idx) => (
              <IntegrationButton
                key={idx}
                publicId={publicId}
                isPublished={true/*isPublished*/}
              />
            ))}
          </Wrap>
        </Stack>
      </Stack>
    </Flex>
  )
}