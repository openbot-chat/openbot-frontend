import { PlusIcon } from "@/components/icons"
import { ChannelListPopover } from "@/features/channel/components/ChannelListPopover"
import { ChannelAccountList } from "@/features/channel/components/ChannelAccountList"
import { Stack, HStack, Box, Button } from "@chakra-ui/react"



export const SocialSection = () => {
  return (
    <Stack h="full" w="full" spacing={2}>
      <HStack>
        <Box flexGrow={1} />
        <Box>
          <ChannelListPopover
            trigger={
              <Button colorScheme="twitter" leftIcon={<PlusIcon />}>Connect</Button>
            }
          />
        </Box>
      </HStack>
      <ChannelAccountList />
    </Stack>
  )
}