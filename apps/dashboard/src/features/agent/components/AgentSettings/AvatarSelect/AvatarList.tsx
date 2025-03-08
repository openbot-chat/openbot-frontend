import {
  HStack,
  Box,
  Image,
  Center,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { PlusIcon } from '@/components/icons'


// 公共 avatar
const defaultAvatars: Avatar[] = [
  {
    id: 'cb004385-ef4a-481c-96dd-bc3a84954337',
    thumbnail: 'https://mv-image-proc.azureedge.net/front-img/img/zzzz2022110116672932302917BPLIEaUz.png?actions=%2Fthumbnail%2F800x800',
    options: {
      modelSrc: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202211011667293094082%E7%94%B7%E7%94%9F3.glb',
      // poseSrc: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz2022121316709082043216397ff2e9ef842b3a515bd5e.glb',
      animations: {
        show: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453120show1.fbx',
        idle: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453131idle.fbx',
        talking: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453130talking1.fbx',
      }
    },
    provider: 'readyplayerme',
    type: '3d',
  },
  {
    id: 'cb004385-ef4a-481c-96dd-3c3a84954337',
    thumbnail: 'https://cdn.mindverse.com/img/zzzz202211161668588337586YX9zGugCB.png?imageMogr2/thumbnail/312x312',
    options: {
      modelSrc: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz20221116166859425699663749ed3152ef07e2424035b.glb',
      // poseSrc: 'https://readyplayerme.github.io/visage/male.glb',
      animations: {
        show: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453120show1.fbx',
        idle: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453131idle.fbx',
        talking: 'https://cdn.mindverse.ai/mindos-resource/front-img/files/zzzz202210221666432453130talking1.fbx',
      }
    },
    provider: 'readyplayerme',
    type: '3d',
  }
]

import { CreateAvatarModal } from './CreateAvatarModal';
import { useMemo, useState } from 'react';
import { Avatar } from 'models';

type Props = {
  isLoading?: boolean;
  value?: Avatar;
  onChange?: (avatar: Avatar) => void;
}

export const AvatarList: React.FC<Props> = ({
  isLoading,
  value,
  onChange,
}) => {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [avatars, setAvatars] = useState(defaultAvatars)

  const isTemplate = useMemo(() => !!value && defaultAvatars.find(it => it.id === value.id), [defaultAvatars, value])

  const handleCreate = (avatar: Avatar) => {
    // TODO create 3d avatar
    // const newAvatars = [avatar, ...avatars]
    // setAvatars(newAvatars)
    onChange?.(avatar)
  }

  return (
    <HStack overflowX="auto" w='full' spacing={4}>
      <CreateAvatarModal 
        isLoading={isLoading} 
        isOpen={isEditOpen} 
        onClose={onEditClose} 
        onCreate={handleCreate} 
      />
      <Box 
        display="flex" 
        w="120px" 
        h="160px" 
        borderWidth={"1px"}
        borderRadius="16px"
        cursor="pointer" 
        justifyContent="center" 
        alignItems="center" 
        bg={useColorModeValue('white', 'gray.500')}
        onClick={onEditOpen}
        position="relative"
        overflow="hidden"
      >
        <Image h="100%" maxW="200%" position="absolute" mx="auto" left="50%" transform="translateX(-50%)" src={(value && !isTemplate) ? value?.thumbnail : undefined} alt="" />
        <Center position="absolute" bg="rgba(0, 0, 0, 0.2)" w="full" h="full">
          <PlusIcon fontSize="24" />
        </Center>
      </Box>
      {avatars.map((avatar) =>(
        <Box 
          key={avatar.id}
          position="relative"
          w="120px" 
          h="160px" 
          borderRadius="16px"
          bg={"white"}
          borderWidth={"1px"}
          borderColor={value?.id === avatar.id ? 'blue.500' : ''}
          _hover={{
            cursor: 'pointer',
            borderWidth: '1px',
            borderColor: 'blue.500',
          }}
          overflow="hidden"
          onClick={() => onChange?.(avatar)}
        >
          <Image h="100%" maxW="200%" position="absolute" mx="auto" left="50%" transform="translateX(-50%)" src={avatar.thumbnail} alt="" />
          <Box 
            w="100%"
            h="100%"
            position="absolute"
            top="0"
            left="0"
            bg="blue.500"
            opacity={value?.id === avatar.id ? "0.2" : "0"}
            _hover={{
              opacity: "0.2"
            }}
          />
        </Box>
      ))}
    </HStack>
  );
}