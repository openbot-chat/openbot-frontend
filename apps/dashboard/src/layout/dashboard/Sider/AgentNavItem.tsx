import { AgentIcon } from "@/components/icons"
import { AgentList } from "@/features/agent/components/AgentList"
import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Portal, Stack, Tooltip, useColorModeValue, VStack } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { useSelectedLayoutSegment } from "next/navigation"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Agent } from 'models'


export const AgentNavItem = () => {
  const scopedT = useTranslations('nav')
  const router = useRouter()

  const segment = useSelectedLayoutSegment()
  const isActive = (path: string) => {
    if (path === '/' && !segment) return true
    // console.log('segment', path, segment)
    return path.includes(segment)
  }
  const href = '/agents'

  const bg = useColorModeValue('gray.100', 'gray.700')

  const handleChangeAgent = (agent: Agent) => {
    router.push(`/agents/${agent.id}`)
  }

  return (
    <Popover trigger="hover" placement="right" isLazy lazyBehavior="keepMounted">
      <PopoverTrigger>
        <Link href={href}>
          <VStack 
            w='full' 
            maxW="60px"
            p={2}
            borderRadius="50%"
            cursor="pointer"
            _hover={{
              bg: isActive(href) ? 'twitter.500' : 'gray.100',
            }}
            bg={isActive(href) ? 'twitter.500' : bg}
            color={isActive(href) ? bg : 'twitter.500'}
          >
            <AgentIcon boxSize="24px" />
          </VStack>
        </Link>
      </PopoverTrigger>
      <Portal>
        <PopoverContent h="100vh" w="240px">
          <PopoverArrow />
          <PopoverBody overflowY="scroll">
            <Stack spacing={2}>
              <AgentList onChange={handleChangeAgent} />
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

