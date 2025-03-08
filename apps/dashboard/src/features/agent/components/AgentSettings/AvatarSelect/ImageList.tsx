import {
  HStack,
  Box,
  Image,
  Center,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { PlusIcon } from '@/components/icons';
import { Avatar } from 'models';
import { ImageUploadModal } from '@/components/Upload';

const avatars: Avatar[] = [];

type Props = {
  isLoading?: boolean;
  value?: Avatar;
  onChange?: (avatar: Partial<Avatar>) => Promise<void>;
}

export const ImageList: React.FC<Props> = ({
  isLoading,
  value,
  onChange,
}) => {
  const {
    isOpen: isImageUploadOpen,
    onOpen: onImageUploadOpen,
    onClose: onImageUploadClose,
  } = useDisclosure();
  console.log('ImageList value: ', value);

  const hanleSelectImage = async (value: Record<string, unknown>) => {
    return await onChange?.({
      thumbnail: value.url as string,
      type: 'image',
      provider: 'image',
    });
  }

  return (
    <HStack overflowX="auto" w='full' spacing={4}>
      <ImageUploadModal 
        isLoading={isLoading}
        url={value?.thumbnail} 
        isOpen={isImageUploadOpen} 
        onClose={onImageUploadClose} 
        onSelect={hanleSelectImage} 
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
        onClick={onImageUploadOpen}
        position="relative"
        overflow="hidden"
      >
        <Image h="100%" maxW="200%" position="absolute" mx="auto" left="50%" transform="translateX(-50%)" src={value?.thumbnail} alt="" />
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
          boxShadow="base"
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
            opacity={value === avatar ? "0.2" : "0"}
            _hover={{
              opacity: "0.2"
            }}
          />
        </Box>
      ))}
    </HStack>
  );
}