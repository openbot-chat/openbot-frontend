import { AgentProfileModal } from '@/features/marketplace/components/AgentProfileModal'
import { Agent } from 'models'
import { Flex, Button, Avatar, Box, Heading, HStack, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Stack, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { AddBuddyIcon, UsersIcon } from '@/components/icons'



type Props = {
  agent: Agent
}

export const AgentPreviewButton = ({
  agent
}: Props) => {
  const scopedT = useTranslations('agent')
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure()

  return (
    <>
      {agent && <AgentProfileModal agent={agent} isOpen={isOpen} onClose={onClose} />}
      <Popover trigger="hover" placement="bottom">
        <PopoverTrigger>
          <HStack rounded="full" bg={useColorModeValue('gray.200', 'gray.600')} p={1} pr={4}>
            <Avatar bg="white" name={agent?.name} src={agent?.avatar?.thumbnail} w="32px" h="32px" cursor="pointer" />
            <Heading size="xs">{agent?.name}</Heading>
          </HStack>
        </PopoverTrigger>
        <PopoverContent w="240px">
          <PopoverArrow />
          <PopoverBody>
            <Stack>
              <Button variant="ghost" w="full" as={Flex} onClick={onOpen} cursor="pointer">
                <UsersIcon />
                <Box ml={2} flex={1}>{scopedT('aboutme')}</Box>
              </Button>
              <Button variant="ghost" w="full" as={Flex} cursor="pointer">
                <AddBuddyIcon color="orange" />
                <Box ml={2} flex={1}>{scopedT('addToTeam')}</Box>
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  )
}