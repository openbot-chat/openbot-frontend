import { chakra, Button, Box, ButtonProps, IconButtonProps, HStack, Square } from "@chakra-ui/react"
import { useState } from "react"
import { motion } from "framer-motion"


type Props = {
  suffix?: React.ReactNode
} & ButtonProps & Pick<IconButtonProps, 'icon'>

const ExpandableButton = (props: Props) => {
  const { icon, suffix, children, ...rest} = props
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <Button
      variant={isHovered ? 'solid' : 'outline'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      px={isHovered ? 2 : 0}
      {...rest}
    >
      <Square p={2}>{icon}</Square>
      {isHovered && <chakra.span transition="padding .3s" mr={2}>{children}</chakra.span>}
      {suffix && <chakra.span mr={2}>{suffix}</chakra.span>}
    </Button>
  )
}

export default ExpandableButton