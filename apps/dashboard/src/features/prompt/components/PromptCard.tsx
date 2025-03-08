import { Button, HStack, Icon, IconButton, Stack, Text } from "@chakra-ui/react"
import { TbTrash, TbPencil } from "react-icons/tb"
import dayjs from "dayjs"
// import relativeTime from "dayjs/plugin/relativeTime"

// dayjs.extend(relativeTime);
import { Prompt } from 'models';
import { ConfirmModal } from "@/components/ConfirmModal";
import { useTranslations } from "next-intl";

type Props = {
  prompt: Prompt
  onDelete?: (prompt: Prompt) => void
  onEdit?: (prompt: Prompt) => void
  onSelect?: (prompt: Prompt) => void
}

export default function PromptCard({
  prompt,
  onSelect,
  onDelete,
  onEdit,
}: Props) {
  const t = useTranslations()
  const scopedT = useTranslations('prompts.promptCard')

  return (
    <Stack borderWidth="1px" borderRadius="md" padding={4} h="240px" w="320px">
      <HStack justifyContent="space-between">
        <Text noOfLines={1} as="b" flex={1}>
          {prompt.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {dayjs(prompt.created_at).fromNow()}
        </Text>
      </HStack>
      <Text fontSize="sm" color="gray.500">
        {`ID: ${prompt.id}`}
      </Text>
      <Stack flex={1}>
        <Text noOfLines={3} >
          {prompt.content}
        </Text>  
      </Stack>
      <HStack justifyContent="flex-end" spacing={0}>
        {onSelect && (
          <Button size="sm" mr={2} colorScheme="twitter" onClick={() => onSelect?.(prompt)}>
            {scopedT('selectButton.label')}
          </Button>
        )}
        <IconButton
          aria-label="edit"
          size="sm"
          variant="ghost"
          icon={<Icon fontSize="lg" as={TbPencil} color="gray.500" />}
          onClick={() => onEdit?.(prompt)}
        />
        <ConfirmModal
          message={t('prompts.confirmModal.message')}
          trigger={
            <IconButton
              aria-label="delete"
              size="sm"
              variant="ghost"
              icon={<Icon fontSize="lg" as={TbTrash} color="gray.500" />}
            />
          }
          onConfirm={() => onDelete?.(prompt)}
        />
      </HStack>
    </Stack>
  );
}