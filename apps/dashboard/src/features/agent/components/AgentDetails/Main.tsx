import { useMemo } from 'react';
import { MomentList } from '@/components/MomentList';

import { Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Stack } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { Standard } from '@openbot/react';
import { useAgent } from '../../providers/AgentProvider';



export function Main() {
  const { data: session } = useSession();
  const { agent } = useAgent();


  return (
    <Standard
      agent={agent}
      showAvatar
      provider="dashboard"
      apiHost={process.env.NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL}
    />
  )

  /*
  const moments = useMemo(() => ([
    {
      id: '1',
      type: 'text',
      avatar: agent?.avatar?.thumbnail,
      text: '我入驻了 @超级马里奥Online, 在里面充当主要玩家, 欢迎粉丝前来捧场',
    },
    {
      id: '2',
      type: 'text',
      avatar: agent?.avatar?.thumbnail,
      text: '今天我和 @马斯克 交流了关于人类和AI如何共处的深刻话题.',
    }
  ] as Moment[]), [agent])

  return (
    <Tabs w='full' h='full' variant='soft-rounded' colorScheme='green' pt={4}>
      <Flex direction="column" h='full' w='full'>
        <TabList>
          <Tab>动态</Tab>
          <Tab>和我聊天</Tab>
        </TabList>
        <TabPanels flex={1}>
          <TabPanel>
            <MomentList moments={moments} />
          </TabPanel>
          <TabPanel w="full" h="full">
            {agent && <Standard agent={agent?.id} />}
          </TabPanel>
        </TabPanels>
      </Flex>
    </Tabs>
  )
  */
}