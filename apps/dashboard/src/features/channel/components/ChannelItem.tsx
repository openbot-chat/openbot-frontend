import { DefaultAppIcons } from "@/constants"
import { Avatar, Box, Button, Grid, GridItem, Heading, IconButton, useColorModeValue } from "@chakra-ui/react"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { TbPlug } from "react-icons/tb"



type ChannelProps = {
  channel: any
  onClick: () => void
}

export const ChannelItem: React.FC<ChannelProps> = ({
  channel,
  onClick,
}) => {
  const t = useTranslations()

  const Icon = useMemo(() => DefaultAppIcons[channel.identifier], [channel.identifier])

  return (
    <Grid
      templateAreas={`"icon name options"`}
      gridTemplateColumns={'64px 1fr 128px'}
      gridTemplateRows={`1fr`}
      w="full"
      gap={'10px'}
      p={2}
      alignItems="center"
      cursor="pointer"
      _hover={useColorModeValue({ shadow: 'md' }, {})}
      border="1px solid #ddd"
      borderRadius="4px"
      onClick={onClick}
    >
      <GridItem area={'icon'}>
        {
          channel.icon ? (
            <Avatar bgColor={channel.theme} p={2} boxSize="48px" rounded="md" name={channel.name} src={channel.icon} />
          ) : (
            Icon ?
            <Avatar bgColor={channel.theme ?? 'gray.300'} p={2} boxSize="48px" rounded="md" icon={Icon && <Icon boxSize="32px" fill="white" />} />
              :
            <Avatar bgColor={channel.theme ?? 'gray.300'} p={2} boxSize="48px" rounded="md" name={channel.name} />
          )
        }
      </GridItem>
      <GridItem area={'name'}>
        <Heading size="sm">{channel.name}</Heading>
      </GridItem>
      <GridItem area={'options'} display="flex" justifyContent="flex-end">
        <Button variant="outline" colorScheme="twitter" size="sm" leftIcon={<TbPlug/>}>Connect</Button>
      </GridItem>
    </Grid>
  )
}