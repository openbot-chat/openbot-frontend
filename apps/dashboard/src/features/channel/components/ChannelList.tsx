import { InfiniteGrid } from "@/components/InfiniteGrid"
import { App } from "models"
import { useMemo } from "react"
import { ChannelItem } from "./ChannelItem"


type Props = {
  onSelect: (channel) => void
}

export const ChannelList: React.FC<Props> = ({
  onSelect,
}) => {
  const channels: App[] = useMemo(() => [
    {
      id: '4433',
      identifier: 'twitter',
      name: 'Twitter',
      description: '',
      theme: '#50abf1',
      icon: 'https://us1.make.com/static/img/packages/twitter_256.png'
    },
    {
      id: '4u4383',
      identifier: 'telegram',
      name: 'Telegram',
      description: '',
      theme: '#179cde',
      icon: 'https://us1.make.com/static/img/packages/telegram_256.png',
    },
    {
      id: '1',
      identifier: 'wechat',
      name: 'Wechat',
      description: '',
      theme: '#0abb5d',
      icon: 'https://us1.make.com/static/img/packages/wechat_256.png'
    },
    {
      id: '3',
      identifier: 'messenger',
      name: 'Messenger',
      description: '',
      theme: '#0087fd',
      icon: 'https://us1.make.com/static/img/packages/facebook-messenger_256.png'
    },
    {
      id: '224',
      identifier: 'whatsapp',
      name: 'Whatsapp Business Cloud',
      description: '',
      theme: '#25d366',
      icon: 'https://us1.make.com/static/img/packages/whatsapp-business-cloud_256.png'
    },
    {
      id: '111',
      identifier: 'slack',
      name: 'Slack',
      description: '',
      theme: '#4a154b',
      icon: 'https://us1.make.com/static/img/packages/slack_256.png'
    },
    {
      id: '222',
      identifier: 'shopify',
      name: 'Shopify',
      theme: '#96bf48',
      description: '',
      icon: 'https://us1.make.com/static/img/packages/shopify_256.png',
    },
    {
      id: '223',
      identifier: 'discord',
      name: 'Discord',
      description: '',
      theme: '#7289da',
      icon: 'https://us1.make.com/static/img/packages/discord_256.png'
    },
    {
      id: '224',
      identifier: 'zapier',
      name: 'Zapier',
      description: '',
      theme: '#ff4a00',
      // icon: 'https://us1.make.com/static/img/packages/zapier_256.png',
    },
  ], [])

  return (
    <InfiniteGrid
      spacing={2}
      isLoading={false/*query.isLoading*/}
      items={channels}
      itemRender={(item) => <ChannelItem channel={item} onClick={() => onSelect(item)} />}
      hasMore={false/*query.hasNextPage*/}
      loadMore={()=>{
        console.log('loadMore')
      }/*loadMore*/}
      columns={[1]}
      minChildWidth="100%"
    />
  )
}
