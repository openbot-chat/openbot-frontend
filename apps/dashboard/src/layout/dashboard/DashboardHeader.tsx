import { LangSelect } from '@/components/LangSelect'
import { LogoWithRipple } from '@/components/LogoWithRipple'
import { OrganizationDropdown } from '@/features/organization/components/OrganizationDropdown'
import { useOrganization } from '@/features/organization/context/OrganizationProvider'
import { Link } from '@chakra-ui/next-js'
import { Organization } from 'models'
import { HStack, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { UserProfile } from '@/components/UserProfile'
import { useUser } from '@/features/user/UserProvider'
import { AppIcon } from '@/components/icons'
import { useTranslations } from 'next-intl'
import ExpandableButton from '@/components/ExpandableButton'



export function DashboardHeader() {
  const scopedT = useTranslations('dashboard.header')
  // const { user } = useUser()
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const { organization, switchOrganization, createOrganization } = useOrganization()

  const handleCreateNewOrganization = async (organization: Organization) => {
    await createOrganization(organization.name)
  }

  return (
    <HStack w="full" h="54px" p={4} justifyContent={"space-between"} bgColor={useColorModeValue('white', 'gray.800')}>
      <HStack>
        <Link href="/">
          <LogoWithRipple />
        </Link>

        {/*
        {user && organization && (
          <OrganizationSettingsModal
            isOpen={isOpen}
            onClose={onClose}
            user={user}
            organization={organization}
            tab='organization-settings'
          />
        )}
        <Button
          leftIcon={<SettingsIcon />}
          onClick={onOpen}
          isLoading={isNotDefined(organization)}
        >
          {scopedT('settingsButton.label')}
        </Button>
        */}

        <OrganizationDropdown
            currentOrganization={organization}
            onCreateNewOrganizationClick={handleCreateNewOrganization}
            onOrganizationSelected={switchOrganization}
          />
      </HStack>
      <HStack spacing={4} px={4}>
        <ExpandableButton rounded="full" colorScheme="twitter" icon={<AppIcon boxSize="18px"/>} suffix={"17%"}>haha</ExpandableButton>
        <UserProfile />
      </HStack>
    </HStack>
  )
}