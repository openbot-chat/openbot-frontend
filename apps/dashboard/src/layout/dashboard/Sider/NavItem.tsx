import { Tooltip, useColorModeValue, VStack } from "@chakra-ui/react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

export type NavItemProps = {
  title: string
  icon: React.ReactNode
  href: string
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  title,
  href,
}) => {
  const segment = useSelectedLayoutSegment()
  const isActive = (path: string) => {
    if (path === '/' && !segment) return true
    // console.log('segment', path, segment)
    return path.includes(segment)
  }

  const bg = useColorModeValue('gray.100', 'gray.700')

  return (
    <Link href={href}>
      <Tooltip
        hasArrow
        placement='right'
        label={title}
      >
        <VStack 
          w='full' 
          maxW="60px"
          p={2}
          borderRadius="50%"
          cursor="pointer"
          _hover={{
            bg: isActive(href) ? 'twitter.500' : 'gray.300',
          }}
          bg={isActive(href) ? 'twitter.500' : bg}
          color={isActive(href) ? bg : 'twitter.500'}
        >
          {icon}
        </VStack>
      </Tooltip>
    </Link>
  )
}