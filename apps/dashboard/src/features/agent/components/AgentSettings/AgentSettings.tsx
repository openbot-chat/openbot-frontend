"use client"
import { BasicSettings } from './BasicSettings'
import {
  Button,
  useColorModeValue,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  VStack,
  HStack,
  Skeleton,
  Card,
  IconButton,
} from '@chakra-ui/react'
import { KnowledgeList } from './Knowledge'
import { AgentToolSettings } from './AgentToolSettings'
import { useAgent } from '../../providers/AgentProvider'
import { EditableInput } from '@/components/EditableInput'
import { Autonomous } from './Autonomous'
import { ChatIcon } from '@chakra-ui/icons'
import { ConversationBlock } from './ConversationBlock'
import { IntegrationSection } from './IntegrationSection'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import { useMemo } from 'react'
import { BiPlug } from 'react-icons/bi'
import { FaPlug } from 'react-icons/fa'
import { TbPlug } from 'react-icons/tb'
import { ChannelListPopover } from '@/features/channel/components/ChannelListPopover'



const tabs = [
  'customization',
  'knowledge',
  'tools',
  'autonomous',
  'conversation',
  'integration'
]

type Props = {
  id: string
  tab: string
}

export function AgentSettings({
  id,
  tab,
}: Props) {
  const scopedT = useTranslations('agent')
  const { agent, save, isFetchingAgent } = useAgent()
  const router = useRouter()
  const tabIndex = useMemo(() => Math.max(tabs.indexOf(tab), 0), [tab])
  const tabItemSelectedStyle = { bg: 'twitter.500', color: 'white' }
  const tabColor = useColorModeValue('gray.600', 'white')

  const setName = async (name: string) => {
    await save({
      name,
    })
  }

  const onTabChange = (index: number) => {
    const tab = tabs[index]
    router.replace(`/agents/${id}/${tab}`)
  }

  return (
    <VStack 
      overflowY="auto" 
      spacing={4}
      h='full' 
      w='full' 
      p={4}
      bg={useColorModeValue('gray.100', 'gray.700')}
    >
      <HStack w='full' spacing={2}>
        <Skeleton isLoaded={!(isFetchingAgent && !agent)}>
          <EditableInput fontSize="18px" fontWeight={700} value={agent?.name} onNewValue={setName} />
        </Skeleton>
      </HStack>
      <Tabs w='full' h='full' isLazy size="md" position="relative" variant="unstyled" maxW="1280px" onChange={onTabChange} index={tabIndex}>
        <Skeleton isLoaded={!(isFetchingAgent && !agent)}>
          <HStack>
            <TabList>
              <HStack 
                bgColor={useColorModeValue('gray.200', 'gray.700')}
                rounded="full"
                spacing={4}
                p={2}
              >
                <Tab _selected={tabItemSelectedStyle} as={Button} size="sm" rounded="full" color={tabColor}>{scopedT('tabs.customization')}</Tab>
                <Tab _selected={tabItemSelectedStyle} as={Button} size="sm" rounded="full" variant='solid' color={tabColor}>{scopedT('tabs.knowledge')}</Tab>
                <Tab _selected={tabItemSelectedStyle} as={Button} size="sm" rounded="full" variant='solid' color={tabColor}>{scopedT('tabs.tools')}</Tab>
                <Tab _selected={tabItemSelectedStyle} as={Button} size="sm" rounded="full" variant='solid' color={tabColor}>{scopedT('tabs.conversations')}</Tab>
                <Tab _selected={tabItemSelectedStyle} as={Button} size="sm" rounded="full" variant='solid' color={tabColor}>{scopedT('tabs.autonomous')}</Tab>
                <Tab size="sm" rounded="full" colorScheme="orange" as={Button}>
                  {scopedT('tabs.integration')}
                </Tab>

                <ChannelListPopover
                  trigger={
                    <IconButton rounded="full" aria-label="integration" icon={<TbPlug fontSize="24px" />}/>
                  }
                />
              </HStack>
            </TabList>
          </HStack>
        </Skeleton>
        <TabPanels>
          <TabPanel h='full'>
            <BasicSettings />
          </TabPanel>
          <TabPanel>
            {!!agent && <KnowledgeList />}
          </TabPanel>
          <TabPanel>
            {!!agent && <AgentToolSettings />}
          </TabPanel>
          <TabPanel h="90vh">
            {/*<ConversationBlock />*/}
          </TabPanel>
          <TabPanel>
            <Autonomous />
          </TabPanel>
          <TabPanel>
            <IntegrationSection />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}