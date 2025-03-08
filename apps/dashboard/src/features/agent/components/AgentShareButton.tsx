import { DiscordLogo } from "@/assets/icons/DiscordLogo"
import { TelegramLogo } from "@/assets/icons/TelegramLogo"
import { TwitterLogo } from "@/assets/icons/TwitterLogo"
import { CopyButton } from "@/components/CopyButton"
import { 
  Box, 
  InputRightElement, 
  ButtonGroup, 
  Divider, 
  HStack, 
  IconButton, 
  Input, 
  InputGroup, 
  Popover, 
  PopoverArrow, 
  PopoverBody, 
  PopoverContent, 
  PopoverHeader, 
  PopoverTrigger, 
  Stack,
} from "@chakra-ui/react"
import { Agent } from "models"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { FiShare2 } from "react-icons/fi"


type Props = {
  agent: Agent
}

export const AgentShareButton = ({
  agent, 
}: Props) => {
  const scopedT = useTranslations('agent')
  const shareLink = useMemo(() => `https://dashboard.openbot.chat/marketplace/agents/${agent.id}`, [agent])

  return (
    <Popover trigger="hover" placement="bottom">
      <PopoverTrigger>
        <Box>
          <FiShare2 cursor="pointer" />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>{scopedT('shareButton.popover.heading')}</PopoverHeader>
        <PopoverBody>
          <Stack>
            <InputGroup>
              <Input value={shareLink} isReadOnly pr="4.5rem" />
              <InputRightElement width="4.5rem">
                <CopyButton h="1.75rem" size="sm" textToCopy={shareLink} />
              </InputRightElement>
            </InputGroup>
            <Divider />
            <HStack>
              <ButtonGroup size="sm">
                <IconButton rounded="full" aria-label="Discord" icon={<DiscordLogo boxSize="24px"/>} colorScheme="discord" />
                <IconButton rounded="full" aria-label="Twitter" icon={<TwitterLogo boxSize="24px"/>} />
                <IconButton rounded="full" aria-label="Telegram" icon={<TelegramLogo boxSize="full" />} colorScheme="telegram"/>
              </ButtonGroup>
            </HStack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}