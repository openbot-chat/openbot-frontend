import { createRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  useColorModeValue,
  VStack,
  Icon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Cognition } from 'models';
import { BiImage, BiUserVoice, BiVideo } from 'react-icons/bi'
import { useTranslations } from 'next-intl';



type CheckCardProps = {
  children: React.ReactNode
  isChecked: boolean
  onChange: (value: boolean) => void
}

const CheckCard = ({
  children,
  isChecked = false,
  onChange,
}: CheckCardProps) => {
  return (
    <Box position="relative" maxW="300px" onClick={() => onChange(!isChecked)} cursor="pointer">
      {children}
      {!isChecked && (
        <Box rounded="full" w="full" h="full" position="absolute" top={0} left={0} bg="white" opacity={0.6} />
      )}
  </Box>
  )
}



type Props = {
  isLoading?: boolean;
  formData?: Cognition;
  onSubmit: (values: Cognition) => void;
}

export const CognitionEditForm: React.FC<Props> = ({
  isLoading,
  formData,
  onSubmit,
}) => {
  const t = useTranslations()
  const scopedT = useTranslations('agent')
  const [voice, setVoice] = useState<boolean>(false)
  const [image, setImage] = useState<boolean>(false)
  const [video, setVideo] = useState<boolean>(false)

  useEffect(() => {
    if (!formData) return

    setVoice(formData.voice ?? false)
    setImage(formData.image ?? false)
    setVideo(formData.video ?? false)
  }, [formData])

  const handleSubmit = () => {
    onSubmit({
      voice,
      image,
      video,
    })
  }

  return (
    <HStack spacing={4}>
      <Heading size="md">{scopedT('cognition.heading')}</Heading>
      <HStack rounded="full" bg={useColorModeValue('gray.200', 'gray.700')} p={2}>
        <CheckCard isChecked={voice} onChange={setVoice}>
          <Tooltip label={scopedT('cognition.voice.tooltip')}>
            <IconButton variant="none" size="sm" aria-label="voice" rounded="full" icon={<BiUserVoice fontSize="21px" />}/>
          </Tooltip>
        </CheckCard>
        <CheckCard isChecked={image} onChange={setImage}>
          <Tooltip label={scopedT('cognition.image.tooltip')}>
            <IconButton variant="none" size="sm" aria-label="image" rounded="full" icon={<BiImage fontSize="21px" />}/>
          </Tooltip>
        </CheckCard>
        <CheckCard isChecked={video} onChange={setVideo}>
          <Tooltip label={scopedT('cognition.video.tooltip')}>
            <IconButton variant="none" size="sm" aria-label="video" rounded="full" icon={<BiVideo fontSize="21px" />}/>
          </Tooltip>
        </CheckCard>
      </HStack>

      <Button isLoading={isLoading} type="submit" colorScheme="twitter" onClick={() => handleSubmit()} loadingText={t('saveButton.label')}>{t('saveButton.label')}</Button>
    </HStack>
  );
}