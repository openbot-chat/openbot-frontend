import { Link } from "@chakra-ui/next-js"
import { Button, Card, Heading, HStack, Text, Stack, Box } from "@chakra-ui/react"
import { useTranslations } from "next-intl"





export const WelcomeCard = () => {
  const scopedT = useTranslations('welcome')

  return (
    <Card w="full" maxW="1080px" borderRadius="md" p={8}>
      <HStack>
        <Stack spacing={4}>
          <Heading size="lg">Bring AI to life.</Heading>
          <Text noOfLines={3}>
            Build your own personalized AI robot and connect it with your social media, engaging with your audience in a whole new way.
          </Text>
          <Box>
            <Link href="/agents">
              <Button 
                colorScheme="twitter" 
                size="lg"
                rounded="full"
              >
                {scopedT('createAgentButton.label')}
              </Button>
            </Link>
          </Box>
        </Stack>
        <Box w="300px">
        </Box>
      </HStack>
    </Card>
  )
}