import { HomeIcon } from "@/components/icons";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { useOrganization } from "@/features/organization/context/OrganizationProvider";
import { useToast } from "@/hooks/useToast";
import { trpc } from "@/utils/trpc-client";
import { AddIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { 
  Stack, 
  Tabs, 
  TabList, 
  Tab, 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  useColorModeValue, 
  Container, 
  TabPanels, 
  TabPanel,
  Box, 
  Flex, 
  ButtonGroup,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { Tool } from "models";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { EditAPIToolModal } from "../EditToolModal/EditAPIToolModal";
import { EditOpenAPIToolModal } from "../EditToolModal/EditOpenAPIToolModal";
import { EditToolModal } from "../EditToolModal/EditToolModal";
import { ToolItem } from "./ToolItem";


export const ToolListPage = () => {
  const scopedT = useTranslations('tools')
  const { showToast } = useToast()
  const trpcContext = trpc.useContext()
  const [type, setType] = useState()

  const {
    onOpen: onOpenEditTool,
    onClose: onCloseEditTool,
    isOpen: isOpenEditTool,
  } = useDisclosure()
  const {
    onOpen: onOpenEditAPITool,
    onClose: onCloseEditAPITool,
    isOpen: isOpenEditAPITool,
  } = useDisclosure()
  const {
    onOpen: onOpenEditOpenApiTool,
    onClose: onCloseEditOpenApiTool,
    isOpen: isOpenEditOpenApiTool,
  } = useDisclosure()
  const [selectedTool, setSelectedTool] = useState<Tool | undefined>()
  const { organization } = useOrganization()

  const query = trpc.tool.list.useInfiniteQuery({
    size: 20,
    org_id: organization?.id,
  }, {
    enabled: !!organization?.id,
  })

  const tools = useMemo(
    () => query.data?.pages.flatMap((d) => d.items) ?? [],
    [query.data]
  )

  const createToolMutation = trpc.tool.create.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async (tool) => {
      trpcContext.tool.list.invalidate()
      showToast({ status: 'success', description: scopedT('create.success') })
    },
  })

  const updateToolMutation = trpc.tool.update.useMutation({
    onError: (error) => showToast({ description: error.message }),
    onSuccess: async (tool) => {
      trpcContext.tool.list.invalidate()
      showToast({ status: 'success', description: scopedT('update.success') })
    },
  })

  const handleSubmit = async (tool: Tool) => {
    if (!selectedTool) {
      const values = {
        ...tool,
        org_id: organization.id,
      }

      await createToolMutation.mutateAsync(values)
    } else {
      const values = {
        ...tool,
        id: selectedTool.id,
      }
      await updateToolMutation.mutateAsync(values)
    }
  }

  const handleClick = async (tool: Tool) => {
    setType(tool.type)
    setSelectedTool(tool)

    if (tool.type === 'openapi') {
      onOpenEditOpenApiTool()    
    } else {
      onOpenEditTool()
    }
  }

  const handleOpenCreateModal = (type: string) => () => {
    setType(type)
    setSelectedTool(undefined)
    onOpenEditTool()
  }

  const handleOpenCreateAPIModal = () => {
    setType('openapi')
    setSelectedTool(undefined)
    onOpenEditAPITool()
  }

  const handleOpenCreateOpenApiModal = () => {
    setType('openapi')
    setSelectedTool(undefined)
    onOpenEditOpenApiTool()
  }

  return (
    <Container maxW="1280px">
      <Stack w="full" h="100vh" spacing={8} py={8}>
        <Stack w='full'>
          <Breadcrumb color={useColorModeValue('gray.500', 'white')} fontWeight='medium' fontSize="sm" spacing='8px' separator={<ChevronRightIcon color={useColorModeValue('gray.500', 'white')} />}>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'><HomeIcon /></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='/tools'>{scopedT('title')}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Stack>

        <EditOpenAPIToolModal isLoading={createToolMutation.isLoading || updateToolMutation.isLoading} value={selectedTool} isOpen={isOpenEditOpenApiTool} onClose={onCloseEditOpenApiTool} onSubmit={handleSubmit} />
        <EditToolModal type={type ?? selectedTool?.type} isLoading={createToolMutation.isLoading || updateToolMutation.isLoading} value={selectedTool} isOpen={isOpenEditTool} onClose={onCloseEditTool} onSubmit={handleSubmit} />
        <EditAPIToolModal isLoading={createToolMutation.isLoading || updateToolMutation.isLoading} value={selectedTool} isOpen={isOpenEditAPITool} onClose={onCloseEditAPITool} onSubmit={handleSubmit} />

        <Flex>
          <Box flexGrow={1}></Box>
          <Menu>
            <MenuButton>
              <ButtonGroup isAttached colorScheme="twitter">
                <Button rightIcon={<AddIcon />}>{scopedT('createButton.label')}</Button>
              </ButtonGroup>
            </MenuButton>
            <MenuList>
              <MenuItem isDisabled icon={<FiPlus />} onClick={handleOpenCreateAPIModal}>
                OpenAPI Tool(View)
              </MenuItem>
              <MenuItem icon={<FiPlus />} onClick={handleOpenCreateOpenApiModal}>
                {scopedT('createOpenAPIToolButton.label')}
              </MenuItem>
              <MenuItem icon={<FiPlus />} onClick={handleOpenCreateModal('function')}>
                {scopedT('createFunctionToolButton.label')}
              </MenuItem>
              <MenuItem isDisabled icon={<FiPlus />} onClick={handleOpenCreateModal('function')}>
                Create Workflow Tool
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <InfiniteGrid<Tool>
          w='full'
          isLoading={query.isLoading}
          items={tools}
          itemRender={(item) => <ToolItem tool={item} onClick={() => handleClick(item)} />}
          hasMore={query.hasNextPage}
          loadMore={query.fetchNextPage}
          columns={[1, 1, 2, 2, 3, 4]}
          minChildWidth="320px"    
        />
      </Stack>
    </Container>
  );
}