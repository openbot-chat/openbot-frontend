import {
  HStack,
  Box,
  Image,
  useDisclosure,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import { PlusIcon } from '@/components/icons'


const defaultAvatars = [
]

import { useState } from 'react';
import { Avatar } from 'models';

type Props = {
  isLoading?: boolean;
  value?: Record<string, unknown>;
  onChange?: (avatar: Record<string, unknown>) => void;
}

export const DHumanList: React.FC<Props> = ({
  isLoading,
  value,
  onChange,
}) => {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const [avatars, setAvatars] = useState(defaultAvatars);
  // TODO avatar create

  const handleCreate = (avatar: Partial<Avatar>) => {
    // TODO create 3d avatar
    const newAvatars = [avatar, ...avatars];
    setAvatars(newAvatars);
    onChange?.(avatar);
  }

  return (
    <HStack overflowX="auto" w='full' spacing={4}>
      <Box 
        display="flex" 
        w="120px" 
        h="160px" 
        borderWidth={"1px"}
        borderRadius="16px" 
        cursor="pointer" 
        justifyContent="center" 
        alignItems="center" 
        onClick={onCreateOpen}
        bg={useColorModeValue('white', 'gray.500')}
        position="relative"
        overflow="hidden"
      >
        <Center position="absolute" bg="rgba(0, 0, 0, 0.2)" w="full" h="full">
          <PlusIcon fontSize="24" />
        </Center>
      </Box>
      {avatars.map((avatar, i) =>(
        <Box 
          key={i} 
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