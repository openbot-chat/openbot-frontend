// import { EmojiOrImageIcon } from '@/components/EmojiOrImageIcon'
import {
  // HardDriveIcon,
  PlusIcon,
} from '@/components/icons'
import {
  IconButton,
  Menu,
  MenuButton,
  Button,
  HStack,
  MenuList,
  MenuItem,
  Text,
  useDisclosure,
  Avatar,
} from '@chakra-ui/react'
import { Organization } from 'models'
import { useTranslations } from 'next-intl'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { CreateOrganizationModal } from './CreateOrganizationModal'
import { ArrowUpDownIcon } from '@chakra-ui/icons'
import { isSvgSrc } from '@openbot/lib'



type Props = {
  currentOrganization?: Organization
  onOrganizationSelected: (organizationId: string) => void
  onCreateNewOrganizationClick: (organization: Organization) => void
}

export const OrganizationDropdown = ({
  currentOrganization,
  onOrganizationSelected,
  onCreateNewOrganizationClick,
}: Props) => {
  const scopedT = useTranslations('organization.dropdown')
  const { organizations } = useOrganization()

  const { 
    isOpen: isOpenCreate, 
    onOpen: onOpenCreate, 
    onClose: onCloseCreate,
  } = useDisclosure()

  return (
    <>
      <CreateOrganizationModal
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        onCreate={onCreateNewOrganizationClick}
      />
      <Menu placement="bottom-start">
        <MenuButton as={Button} variant="unstyled" px="2">
          {currentOrganization && (
            <HStack>
              <Avatar
                src={currentOrganization.icon}
                boxSize="24px"
                objectFit={isSvgSrc(currentOrganization.icon) ? undefined : 'cover'}
                name={currentOrganization.name}
                rounded="full"
              />
              <Text>{currentOrganization.name}</Text>
              <IconButton size="sm" aria-label="dropdown" icon={<ArrowUpDownIcon />} />
              {/*<PlanTag plan={currentOrganization.plan} />*/}
            </HStack>
          )}
        </MenuButton>
        <MenuList p={2}>
          {organizations
            ?.filter((organization) => organization.id !== currentOrganization?.id)
            .map((organization) => (
              <MenuItem
                key={organization.id}
                onClick={() => onOrganizationSelected(organization.id)}
                color={organization.id === currentOrganization?.id ? 'twitter.500' : 'current'}
                css={organization.id === currentOrganization?.id ? {
                  fontWeight: 500,
                } : undefined}
                rounded="8px"
                py={2}
              >
                <HStack rounded={2}>
                  <Avatar
                    src={organization.icon}
                    boxSize="24px"
                    objectFit={isSvgSrc(organization.icon) ? undefined : 'cover'}
                    name={organization.name}
                    rounded="full"
                  />
                  <Text>{organization.name}</Text>
                  {/*<PlanTag plan={organization.plan} />*/}
                </HStack>
              </MenuItem>
            ))}
          <MenuItem onClick={onOpenCreate} icon={<PlusIcon />} rounded="8px" py={2}>
            {scopedT('newButton.label')}
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
