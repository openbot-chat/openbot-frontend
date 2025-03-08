import { ConfirmModal } from '@/components/ConfirmModal'
import { trpc } from '@/utils/trpc-client'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  IconButton,
  Card,
  Box,
  WrapItem,
  HStack,
  Stack,
  Flex,
  Avatar,
  Text,
  Heading,
  useColorModeValue,
  Menu,
  MenuList,
  MenuButton,
  Portal,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react'
import { useToast } from '@/hooks/useToast'
import { AgentTool } from 'models'
import { FiMoreVertical } from 'react-icons/fi'

type Props = {
  agentTool: AgentTool
  onEdit?: () => void;
}

export const AgentToolItem: React.FC<Props> = ({
  agentTool,
  onEdit,
}) => {
  const { showToast } = useToast();
  const trpcContext = trpc.useContext();

  const removeAgentToolMutation = trpc.agent.removeTool.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async () => {
      await trpcContext.agentTool.list.invalidate()
    },
  })

  const {
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
  } = useDisclosure()

  return (
    <WrapItem
      as={Card}
      variant="outline"
      alignItems="center"
      style={{ width: '320px', height: '160px' }}
      whiteSpace={'normal'}
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius={4}
      cursor="pointer"
      _hover={useColorModeValue({ shadow: 'lg' }, { bgColor: 'gray.700' })}
    >
      <ConfirmModal 
        isLoading={removeAgentToolMutation.isLoading}
        title={"Are You Sure to delete this tool"}
        message={"Are You Sure to delete this tool?"}
        onConfirm={() => removeAgentToolMutation.mutate({
          agent_tool_id: agentTool.id,
          agent_id: agentTool.agent_id,
        })}
        isOpen={isOpenDelete}
        onOpen={onOpenDelete}
        onClose={onCloseDelete}
      />
      <Stack h='full' w='full' spacing={4}>
        <Stack w='full' spacing={4}>
          <Flex justifyContent="space-between">
            <HStack spacing={4}>
              <Avatar name={agentTool.name ?? agentTool.tool.name} src={agentTool.tool.icon} w='48px' h='48px' borderRadius={8} />
              <Stack>
                <Heading size="sm">{agentTool.name ?? agentTool.tool.name}</Heading>
              </Stack>
            </HStack>
            <Box>
              <Menu isLazy placement="bottom-end">
                <MenuButton
                  as={IconButton}
                  aria-label='Options'
                  icon={<FiMoreVertical />}
                  variant='outline'
                />
                <Portal>
                  <MenuList>
                    <MenuItem onClick={onEdit} icon={<EditIcon />}>
                      Edit
                    </MenuItem>
                    <MenuItem color="red" icon={<DeleteIcon />} onClick={onOpenDelete}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
          <Text fontSize="sm" noOfLines={2} color="gray">
            {agentTool.description ?? agentTool.tool.description}
          </Text>
        </Stack>
      </Stack>
    </WrapItem>
  )
}