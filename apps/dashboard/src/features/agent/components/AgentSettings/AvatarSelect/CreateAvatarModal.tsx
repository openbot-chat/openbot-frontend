// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { AvatarCreatorViewer } from '@readyplayerme/rpm-react-sdk';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Avatar } from 'models'
import { useTranslations } from 'next-intl'

export type Props = {
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onCreate?: (url: Partial<Avatar>) => void
}

export const CreateAvatarModal: React.FC<Props> = ({
  isLoading,
  isOpen,
  onClose,
  onCreate,
}) => {
  const scopedT = useTranslations('agent.avatar.createAvatarModal')
  const [avatar, setAvatar] = useState()
  
  const handleCreate = async () => {  
    await onCreate?.(avatar)
    onClose()
  }

  const handleOnAvatarExported = (url: string) => {
    console.log(`Avatar URL is: ${url}`)

    const u = new URL(url)
    const id = u.pathname.substring(1, u.pathname.lastIndexOf("."))
    const thumbnail = `https://models.readyplayer.me/${id}.png`

    // TODO 把文件上传到 AWS / Aliyun
    setAvatar({
      id,
      type: '3d',
      thumbnail,
      provider: 'readyplayerme',
      options: {
        id,
        modelSrc: url,
        animations: {
          show: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453120show1.fbx',
          idle: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453131idle.fbx',
          talking: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453130talking1.fbx',
        },
      }
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent h="85vh">
        <ModalHeader>
          {scopedT('title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AvatarCreatorViewer 
            language="Chinese"
            subdomain="openbot-autonomous-agent-platform" 
            onAvatarExported={handleOnAvatarExported}
          />
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button 
              borderRadius="lg" 
              isLoading={isLoading}
              onClick={onClose}
            >
              {scopedT('cancel')}
            </Button>
            <Button 
              borderRadius="lg" 
              colorScheme="twitter"
              isLoading={isLoading}
              onClick={handleCreate}
              isDisabled={!avatar}
            >
              {scopedT('confirm')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}