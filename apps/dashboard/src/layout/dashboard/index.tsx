"use client"
import {
  Flex,
  Box,
  Divider,
} from '@chakra-ui/react'
import { DashboardHeader } from './DashboardHeader'
import { Sider } from './Sider'



type Props = {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <Flex h="100vh" direction="column">
      {/*<DashboardHeader />*/}
      <Flex flex={1} overflow="hidden" direction="row">
        <Sider />
        <Divider orientation="vertical" />
        <Box
          flex="1"
          overflowY="auto" 
          position="relative"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}