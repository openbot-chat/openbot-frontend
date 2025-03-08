import { useEffect, useMemo, useState } from 'react'
import { 
  VStack, 
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { Avatar } from 'models'
import { useTranslations } from 'next-intl'
import { AvatarList } from './AvatarList'
import { ImageList } from './ImageList'
import { DHumanList } from './DHumanList'


const tabs = [
  'image',
  '3d',
  'digit_human'
]

type Props = {
  avatar?: Avatar;
  isLoading?: boolean;
  onChange?: (avatar: Partial<Avatar>) => void;
}

export const AvatarSelect: React.FC<Props> = ({
  isLoading,
  avatar,
  onChange,
}) => {
  const scopedT = useTranslations('agent')
  const [tabIndex, setTabIndex] = useState(0)

  const handleImageChange = async (avatar: Avatar) => {
    return await onChange?.(avatar);
  }

  useEffect(() => {
    setTabIndex(avatar ? tabs.indexOf(avatar?.type) : 0);
  }, [avatar]);

  return (
    <VStack w="full" alignItems="flex-start" spacing={4}>
      <Heading size="md">{scopedT('avatar.title')}</Heading>
      <Tabs w='full' h='full' variant='solid-rounded' colorScheme='whatsapp' index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>{scopedT('avatar.2d')}</Tab>
          <Tab>{scopedT('avatar.3d')}</Tab>
          <Tab>{scopedT('avatar.digit_human')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ImageList isLoading={isLoading} value={avatar} onChange={handleImageChange} />
          </TabPanel>
          <TabPanel>
            <AvatarList value={avatar} onChange={onChange} />
          </TabPanel>
          <TabPanel>
            <DHumanList value={avatar} onChange={onChange} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}