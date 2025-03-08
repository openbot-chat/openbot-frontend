import { Center, Flex, useColorModeValue } from "@chakra-ui/react"
import { Logo } from '@/assets/icons/Logo'
import React, { PropsWithChildren } from "react"

export type LoadingProps = {
  isLoading?: boolean | null;
  size?: number | string;
}

export const Spinner = ({
  size = "32px",
}: PropsWithChildren<LoadingProps>) => {
  const bg = useColorModeValue('gray.50', 'gray.600')

  return (
    <Center 
      bg={bg}
      css={{ animation: 'spin 2s infinite linear', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }}
      rounded="50%"
      p="4px"
    >
      <Logo width={size} height={size} />
    </Center>
  )
}