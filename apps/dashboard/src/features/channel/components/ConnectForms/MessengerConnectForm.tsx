import { LogOutIcon } from "@/components/icons"
import { Button, Avatar, HStack, IconButton, Stack, Heading, Text, useColorModeValue } from "@chakra-ui/react"
import { useMemo } from "react"


export const MessengerConnectForm: React.FC = () => {
  const fan_pages = useMemo(() => [
    {
      name: 'Feedbacks',
    },
    {
      name: 'Products',
    }
  ], [])


  return (
    <Stack spacing={4}>
      <HStack p={4} spacing={4} rounded="4" bg={useColorModeValue('gray.200', 'gray.700')}>
        <Avatar width="40px" height="40px" />
        <Text flexGrow={1}>xx</Text>
        <IconButton aria-label="" icon={<LogOutIcon />}/>
      </HStack>

      <Stack>
        <Heading size="sm">Fan pages</Heading>
        <Text>Select a fan page to connect with your agent</Text>

        <Stack spacing={2}>
          {fan_pages.map((it, i) => (
            <HStack key={i} p={2} spacing={4} rounded={4} border="1px solid #ddd">
              <Avatar size="sm" name={it.name} src={it.icon} />
              <Text flexGrow={1}>{it.name}</Text>
              <Button colorScheme="blue" size="sm">Connect</Button>      
            </HStack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}