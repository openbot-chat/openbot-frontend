import React, { useEffect, useState, useMemo, forwardRef } from 'react'
import {
  Button,
  Heading,
  HStack,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
  Stack,
  Select,
  Divider,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tooltip,
} from '@chakra-ui/react'
import {
  Voice, VoiceConfig, voiceConfigSchema,
} from 'models';
import { usePlayVoice } from './hooks/usePlayVoice';

import greetings from './greetings.json';
import { SayRequest } from '@/features/voice/queries/sayQuery';
import { VoiceRadioGroup } from './VoiceRadioGroup';
import { useFormik } from 'formik';
import $pick from 'lodash.pick';
import { trpc } from '@/utils/trpc-client';
import { toFormikValidationSchema } from '@artizon/zod-formik-adapter';



const providers = [
  { label: 'Azure', identifier: 'azure' },
  { label: 'Play.ht', identifier: 'playht' },
];

type Props = {
  voice?: Voice;
  isSubmitting?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelectVoice: (voice: Voice) => void;
}

export const SelectVoiceModal: React.FC<Props> = ({
  voice,
  isSubmitting,
  isOpen,
  onClose,
  onSelectVoice,
}) => {
  const [provider, setProvider] = useState<string>();
  const [language, setLanguage] = useState<string | undefined>();

  const formik = useFormik({
    initialValues: voice ?? {
      pitch: 20,
      rate: 20,
    },
    validationSchema: () => toFormikValidationSchema(voiceConfigSchema),
    onSubmit: async (values: Voice) => {
      onSelectVoice?.(values);
    },
  })

  useEffect(() => {
    formik.setValues(voice);

    if (voice) {
      setProvider(voice.provider);
    
      if (isOpen) {
        setLanguage(voice.language);
      }
    }
  }, [voice, isOpen]);

  const handleChangeProvider = (value: string) => {
    setProvider(value);
    formik.setValues({});
  }

  const { play } = usePlayVoice(formik.values);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Select Voice
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs 
            h="full" 
            w='full' 
            isLazy 
            variant='solid-rounded' 
            colorScheme="twitter" 
            index={providers.findIndex((it) => it.identifier === provider)}
            onChange={(index) => handleChangeProvider(providers[index].identifier)}
          >
            <HStack justifyContent="space-between">
              <TabList>
                <Tab>Microsoft</Tab>
                <Tab>Play.ht</Tab>
              </TabList>
              <Button colorScheme="orange">个性化训练</Button>
            </HStack>
            <TabPanels>
              <TabPanel>
                <StandardVoiceSelect ref={formik} provider={provider} language={language} onChangeLanguage={setLanguage} onPlay={play} />
              </TabPanel>
              <TabPanel>
                <StandardVoiceSelect ref={formik} provider={provider} language={language} onChangeLanguage={setLanguage} onPlay={play} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button 
              borderRadius="lg" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              borderRadius="lg" 
              colorScheme="twitter"
              isLoading={isSubmitting}
              isDisabled={!formik.isValid}
              onClick={() => formik.submitForm()}
            >
              Confirm
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const languages = [
  {
    label: 'English(en-US)',
    value: 'en-US',
  },
  {
    label: 'Chinese(zh-CN)',
    value: 'zh-CN',
  }
]

type StandardVoiceSelectProps = {
  provider: string;
  language?: string;
  onChangeLanguage?: (language: string) => void;
  onPlay: (req: SayRequest) => void;
}

const StandardVoiceSelect = forwardRef(({
  provider,
  language,
  onChangeLanguage,
  onPlay,
}: StandardVoiceSelectProps, ref) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const query = trpc.voice.list.useQuery({
    provider,
    language,
  }, {
    refetchOnWindowFocus: false,
    staleTime: 300*1000,
  });
  const voices = useMemo(() => query.data?.items ?? [], [query.data])
  const voice = useMemo(() => voices.find(it => it.identifier === ref.values.identifier), [voices, ref.values])
  const styles = useMemo(() => voice?.styles ?? [], [voice])

  const handleChangeLanguage = (e) => {
    onChangeLanguage?.(e.target.value)
    ref.setValues({})
  }

  const handleChange = (identifier: string) => {
    const voice = voices.find(it => it.identifier === identifier)
  
    const v = $pick(ref.values, 'pitch', 'rate', 'volume', 'style')
    const values = { ...voice, ...v }
    ref.setValues(values)
  };

  return (
    <VStack
      w="full"
      py="6"
      px="8"
      spacing={4}
    >
      <Stack 
        h='400px'
        w='full'
        overflowY="auto"
      >
        <VoiceRadioGroup isLoading={query.isFetching} voices={voices} value={ref.values.identifier} onChange={handleChange} />
      </Stack>
      <Divider />
      <HStack spacing={8} w='full'>
        <VStack flex="1" alignItems="left">
          <Heading size="sm">Language</Heading>
          <Select
            w="210px"
            value={language}
            onChange={handleChangeLanguage}
            placeholder="Select Language"
          >
            {languages?.map(it => (
              <option key={it.value} value={it.value}>{it.label}</option>
            ))}
          </Select>
        </VStack>
        <VStack flex="1" alignItems="left">
          <Heading size="sm">Style</Heading>
          <Select
            name="style"
            w="150px"
            value={ref.values.style}
            onChange={ref.handleChange}
            placeholder="Default"
          >
            {styles?.map(it => (
              <option key={it} value={it}>{it}</option>
            ))}
          </Select>
        </VStack>
        <VStack flex="1" alignItems="left">
          <Heading size="sm">Pitch</Heading>
          <Slider 
            aria-label='Pitch' 
            value={ref.values.pitch} 
            onChange={(value) => ref.setFieldValue('pitch', value)} 
            min={0} 
            max={100}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg='blue.500'
              color='white'
              placement='top'
              isOpen={showTooltip}
              label={`${ref.values.pitch}%`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
        </VStack>
        <VStack flex="1" alignItems="left">
          <Heading size="sm">Speed</Heading>
          <Slider 
            aria-label='Speed' 
            value={ref.values.rate} 
            onChange={(value) => ref.setFieldValue('rate', value)} 
            min={0} 
            max={100}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg='blue.500'
              color='white'
              placement='top'
              isOpen={showTooltip}
              label={`${ref.values.rate}%`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
        </VStack>
        <VStack>
          <Button 
            w={32} 
            colorScheme="twitter" 
            onClick={() => ref.values.identifier && onPlay({
              provider,
              identifier: ref.values.identifier,
              pitch: ref.values.pitch,
              rate: ref.values.rate,
              style: ref.values.style,
              text: greetings[ref.values.language] ?? 'Do you like my voice?',
            })}
            isDisabled={!ref.isValid}
          >
            Play
          </Button>
        </VStack>
      </HStack>
    </VStack>
  )
});

StandardVoiceSelect.displayName = "StandardVoiceSelect";