import { useMemo, useState } from 'react';
import {
  Stack,
  VStack,
  Heading,
  Card,
  Button,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  HStack,
  StackDivider,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import { trpc } from '@/utils/trpc-client'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import $pick from 'lodash.pick'
import { Avatar, Voice } from 'models'
import { AvatarSelect } from './AvatarSelect'
import { VoiceSection } from './VoiceSection'
import { useAgent } from '../../providers/AgentProvider'
import { LLMEditForm } from '@/components/LLMEditForm'
import { ChainSettingForm } from './ChainSettingForm'
import { MemorySettingForm } from './MemorySettingForm'
import { ProfileEditForm } from './ProfileEditForm'
import { CognitionEditForm } from './CognitionEditForm'
import { ConfirmModal } from '@/components/ConfirmModal'
import { MetadataEditForm } from './MetadataEditForm';



export const BasicSettings: React.FC = () => {
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const router = useRouter()
  const t = useTranslations()
  const scopedT = useTranslations('agent')
  const { agent, save, isSavingLoading } = useAgent()
  const deleteAgentMutation = trpc.agent.delete.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.agent.list.invalidate()
      router.push(`/agents`)
    },
  })

  const options = useMemo(() => agent?.options ?? {}, [agent])

  const changeOptions = (type: string) => async (values: Record<string, unknown>) => {
    const provider = values['type']
    await save({
      options: {
        ...options,
        provider,
        [type]: values,
      },
    })
  }

  const saveAvarar = async (avatar: Avatar) => {
    await save({
      avatar,
    })
  }

  const saveVoice = async (voice: Voice) => {
    await save({
      voice,
    })
  }

  const profile = useMemo(() => $pick(agent, 'instructions', 'shortcuts'), [agent])
  const metadata = useMemo(() => $pick(agent, 'metadata'), [agent])
  const cognition = useMemo(() => agent?.cognition, [agent])

  return (
    <Stack w='full' p='4' spacing={8}>
      <AvatarSelect isLoading={isSavingLoading} avatar={agent?.avatar as Avatar} onChange={saveAvarar} />
      <VoiceSection isSubmitting={isSavingLoading} value={agent?.voice as Voice} onChange={saveVoice}/>
      {/*<CognitionEditForm isLoading={isSavingLoading} formData={cognition} onSubmit={(cognition) => save({ cognition })} />*/}

      <Stack w="full" alignItems="flex-start" spacing={8} p={4}>
        <Heading size="md">{scopedT('profile_settings')}</Heading>
        <ProfileEditForm isLoading={isSavingLoading} formData={profile} onSubmit={save} />
      </Stack>
      
      <Accordion w="full" allowToggle={true}>
        <AccordionItem>
          <AccordionButton as={HStack} spacing={2} cursor="pointer">
            <AccordionIcon />
            <Heading size="sm">{scopedT('advanced_settings.title')}</Heading>
          </AccordionButton>
          <AccordionPanel as={Stack} spacing={4} p={0} divider={<StackDivider/>}>
            <Stack spacing={8} p={4}>
              <Heading size="md">{scopedT('llm.title')}</Heading>
              <LLMEditForm isLoading={isSavingLoading} formData={agent?.options?.llm} onSubmit={changeOptions("llm")}/>
            </Stack>

            <Stack alignItems="flex-start" spacing={8} p={4}>
              <Heading size="md">{scopedT('provider.heading')}</Heading>
              <ChainSettingForm isLoading={isSavingLoading} formData={agent?.options?.chain} onSubmit={changeOptions("chain")}/>
            </Stack>

            <Stack alignItems="flex-start" spacing={8} p={4}>
              <Heading size="md">{scopedT('memory.title')}</Heading>
              <MemorySettingForm isLoading={isSavingLoading} formData={agent?.options?.memory} onSubmit={changeOptions("memory")}/>
            </Stack>

            <Stack alignItems="flex-start" spacing={8} p={4}>
              <Heading size="md">{scopedT('metadata.title')}</Heading>
              <MetadataEditForm isLoading={isSavingLoading} formData={metadata} onSubmit={save} />
            </Stack>


            <Card as={VStack} w="full" alignItems="flex-start" spacing={8} p={4}>
              <Heading size="md">{t('agent.danger_zone')}</Heading>
              <ConfirmModal 
                isLoading={deleteAgentMutation.isLoading}
                trigger={
                  <Button colorScheme="red" leftIcon={<DeleteIcon />}>{t('agent.delete')}</Button>
                }
                confirmText={t('agent.confirmModal.confirm')}
                title={t('agent.confirmModal.title')}
                message={t.rich('agent.confirmModal.message', { 
                  confirmText: (chunks) => <b>{t('agent.confirmModal.confirm')}</b>,
                })}
                onConfirm={() => deleteAgentMutation.mutateAsync(agent?.id)}
              />
            </Card>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>  
    </Stack>
  );
}