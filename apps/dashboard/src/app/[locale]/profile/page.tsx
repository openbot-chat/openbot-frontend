"use client"
import {
  Avatar,
  Stack,
  VStack,
  Text,
} from '@chakra-ui/react'

import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session, status } = useSession()

  return (
    <Stack pt={4}>
      <VStack>
        <Avatar width="108px" height="108px" src={session?.user?.image ?? ''} />
        <Text>{session?.user?.name}</Text>
      </VStack>
    </Stack>
  )
}