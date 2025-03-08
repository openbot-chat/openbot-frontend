import { IconButton, HStack, Skeleton, Stack, Heading, Tag } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { Connection } from 'models'
import { Link } from "@chakra-ui/next-js"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useApp } from "../context/AppProvider"
import { OAuth2EditPage } from "./AppDetailsPage/OAuth2EditPage"
import { ConnectionProvider, useConnection } from "../context/ConnectionProvider"



type Props = {
  id: string
}

export const ConnectionDetailsPage = ({
  id,
}: Props) => {
  return (
    <ConnectionProvider connectionId={id}>
      <ConnectionDetailsPageInner />
    </ConnectionProvider>
  )
}

export const ConnectionDetailsPageInner = () => {
  const { connection} = useConnection()

  return (
    <Stack>
      <ConnectionDetailsHeader />
      {connection?.type === 'oauth2' && <OAuth2EditPage />}
    </Stack>
  )
}



const ConnectionDetailsHeader = () => {
  const { app } = useApp()
  const { connection } = useConnection()

  return (
    <HStack px={8} py={4} spacing={4} justifyContent="space-between">
      <Skeleton isLoaded={!!connection}>
        <HStack spacing={8}>
          <Link href={`/apps/${app?.id}`}>
            <IconButton
              icon={<ArrowBackIcon />}
              aria-label="back"
              variant="outline"
              rounded="full"
              size="sm"
            />
          </Link>
          <HStack spacing={2}>
            <Heading>Connection: {connection?.name}</Heading>
            {connection?.type && <Tag variant="solid" colorScheme="green">{connection?.type}</Tag>}
          </HStack>
        </HStack>
      </Skeleton>
    </HStack>
  )
}


