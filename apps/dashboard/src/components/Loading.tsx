import { Center, Flex, useColorModeValue } from "@chakra-ui/react"
import React, { PropsWithChildren } from "react"
import { Spinner } from "./Spinner"

export type LoadingProps = {
  isLoading?: boolean | null;
  size?: number | string;
}

export const Loading = ({
  isLoading,
  size = "54px",
  children,
}: PropsWithChildren<LoadingProps>) => {
  return (
    <Flex pos="relative" w="full" h="full">
      {children}
      {isLoading && (
        <Center w='full' h="full" pos="absolute" opacity={0.6} p={2}>
          <Spinner size={size}/>
        </Center>
      )}
    </Flex>
  )
}