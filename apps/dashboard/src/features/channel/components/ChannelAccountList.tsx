import { InfiniteGrid } from "@/components/InfiniteGrid"
import { useMemo } from "react"
import { ChannelAccountItem } from "./ChannelAccountItem"


type Props = {
  onSelect: (item: any) => void
}

export const ChannelAccountList: React.FC<Props> = ({
  onSelect,
}) => {
  const channelAccounts = useMemo(() => [
    {
      id: '2',
      provider: 'wechat',
      name: 'Alan',
      avatar: '',
    }
  ], [])

  return (
    <InfiniteGrid<any>
      isLoading={false/*query.isLoading*/}
      items={channelAccounts}
      itemRender={(item) => <ChannelAccountItem channel={item} onClick={() => onSelect(item)}/>}
      hasMore={false/*query.hasNextPage*/}
      loadMore={()=>{
        console.log('loadMore')
      }/*loadMore*/}
      columns={[1]}
      minChildWidth="100%"
    />
  )
}
