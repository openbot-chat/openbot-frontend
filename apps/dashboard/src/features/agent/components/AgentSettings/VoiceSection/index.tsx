
import {
  VStack,
  Button,
  Switch,
  HStack,
  Heading,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { SelectVoiceModal } from './SelectVoiceModal';
import { usePlayVoice } from './hooks/usePlayVoice';
import { Voice, VoiceConfig } from 'models';
import { BiUserVoice } from 'react-icons/bi';
import greetings from './greetings.json';
import { useTranslations } from 'next-intl';



type Props = {
  value?: VoiceConfig;
  onChange?: (data: Partial<Voice>) => Promise<void>;
  isSubmitting?: boolean;
}

export const VoiceSection: React.FC<Props> = ({
  value,
  onChange,
  isSubmitting,
}) => {
  const scopedT = useTranslations('agent.voice')
  const {
    isOpen: isSelectOpen,
    onOpen: onSelectOpen,
    onClose: onSelectClose,
  } = useDisclosure();  

  // TODO 这里要根据 voice_config 来获取 voice 详情
  // const voice = trpc.voice.by_id.useQuery(value.id)

  const toggleEnable = async (enabled: boolean) => {
    const defaultVoice = {
      id: "en-US-JennyMultilingualNeural",
      gender: "male",
      name: "Jenny Multilingual",
      identifier: "en-US-JennyMultilingualNeural",
      language: "en-US",
      provider: "azure",
      options: {},
      pitch: 20,
      rate: 20,
      volume: 20,
    };
    const voice = value ?? defaultVoice;
    
    const options = Object.assign(voice?.options ?? {}, { enabled });
    await onChange?.({
      ...voice,
      options,
    });
  }

  const handleSelect = async (voice: Voice) => {
    const options = Object.assign(voice?.options ?? {}, { enabled: true });
    await onChange?.({
      id: voice.identifier,
      ...voice,
      options,
    });
    onSelectClose();
  }

  const { play } = usePlayVoice(value);

  const handlePlay = () => {
    if (!value) return;
    
    play({
      provider: value.provider,
      identifier: value.identifier,
      pitch: value.pitch,
      rate: value.rate,
      style: value.style,
      text: greetings[value.language] ?? 'Do you like my voice',
    })
  }

  return (
    <VStack spacing={4} alignItems="flex-start">
      <SelectVoiceModal isSubmitting={isSubmitting} voice={value} isOpen={isSelectOpen} onClose={onSelectClose} onSelectVoice={handleSelect}/>
      <HStack spacing={4}>
        <Heading size="md">
          {scopedT('title')}
        </Heading>
        <Switch size="md" isChecked={value?.options?.enabled} onChange={(e) => toggleEnable(e.target.checked)}/>
      </HStack>
      {value?.options?.enabled ? (
        <HStack spacing={2}>
          <Button size="md" colorScheme="yellow" onClick={onSelectOpen} leftIcon={<BiUserVoice />}>{scopedT('selectButton.label')}</Button>
          <Button size="md" onClick={handlePlay}>{value ? `${value.gender??''} - ${value.name} - ${value.language??''}` : ''}</Button>
        </HStack>
      ) : (
        <Text fontSize="xs">{scopedT('description')}</Text>
      )}
    </VStack>
  )
}