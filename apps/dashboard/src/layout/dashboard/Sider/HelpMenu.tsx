import { 
  IconButton, 
  Button, 
  Popover, 
  PopoverArrow, 
  PopoverBody, 
  PopoverContent, 
  PopoverTrigger,
  Stack,
  HStack,
  ButtonGroup,
  Link,
  Divider,
  Box,
  Flex,
} from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { DocumentIcon, QuestionIcon } from "@/components/icons"
import { DiscordLogo } from "@/assets/icons/DiscordLogo"
import { TwitterLogo } from "@/assets/icons/TwitterLogo"
import { TelegramLogo } from "@/assets/icons/TelegramLogo"
import { BiBug } from "react-icons/bi"



export const HelpMenu = () => {
  const scopedT = useTranslations('help')


  return (
    <Popover trigger="hover" placement="right">
      <PopoverTrigger>
        <IconButton aria-label="Help" colorScheme="twitter" rounded="full" icon={<QuestionIcon boxSize="18" />} />
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverArrow />
        <PopoverBody>
          <Stack spacing={2}>
            <Stack>
              <Link target="_blank" href="https://docs.openbot.chat">
                <Button variant="ghost" w="full" as={Flex}>
                  <DocumentIcon />
                  <Box ml={2} flex={1}>{scopedT('documents')}</Box>
                </Button>
              </Link>
              <Button variant="ghost" w="full" as={Flex} cursor="pointer">
                <BiBug />
                <Box ml={2} flex={1}>{scopedT('feedback')}</Box>
              </Button>
            </Stack>
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