
import {
  VStack,
} from '@chakra-ui/react'
import { CredentialsList } from './CredentialsList'


export const CredentialsListPage = () => {
  return (
    <VStack w="full" h="full" spacing={6} pl={12} pr={12} pt={4}>
      <CredentialsList />
    </VStack>
  )
}