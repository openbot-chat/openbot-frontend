import { DefaultAppIcons } from "@/constants"
import { Avatar, Card, Grid, GridItem, Switch, Tag, TagLeftIcon, useColorModeValue } from "@chakra-ui/react"
import { ChannelAccount } from "models"
import { useTranslations } from "next-intl"
import { useMemo } from "react"





type ChannelAccountProps = {
  channel: ChannelAccount
  onClick: () => void
}

export const ChannelAccountItem: React.FC<ChannelAccountProps> = ({
  channel,
  onClick,
}) => {
  const t = useTranslations()
  const Icon = useMemo(() => DefaultAppIcons[channel.provider], [channel.provider])

  return (
    <Grid
      templateAreas={`"icon name provider options"`}
      gridTemplateColumns={'64px 1fr 110px 64px'}
      gridTemplateRows={`1fr`}
      w="full"
      gap={'10px'}
      p={2}
      alignItems="center"
      as={Card}
      _hover={useColorModeValue({ shadow: 'md', bgColor: 'gray.50' }, { bgColor: 'gray.700' })}
      onClick={onClick}
      cursor="pointer"
    >
      <GridItem area={'icon'}>
        <Avatar name={channel.name} src={channel.avatar} />
      </GridItem>
      <GridItem area={'name'}>
        {channel.name}
      </GridItem>
      <GridItem area={'provider'}>
        <Tag>
          <TagLeftIcon>
            {Icon && <Icon />}
          </TagLeftIcon>
          {channel?.name}
        </Tag>
      </GridItem>
      <GridItem area={'options'}>
        <Switch />
      </GridItem>
    </Grid>
  )
}