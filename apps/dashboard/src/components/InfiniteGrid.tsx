import {
  useCallback,
  useEffect,
  useRef
} from 'react'
import {
  SimpleGrid,
  Box,
  SimpleGridProps,
  Center,
} from '@chakra-ui/react'
import { LoadingProps } from './Loading'
import { Spinner } from './Spinner'

type Props<T> = {
  hasMore?: boolean
  isLoading?: boolean
  items: T[]
  spacing?: number
  itemRender: (item: T, index: number) => React.ReactNode
  loadMore: () => void
  Loading?: React.ComponentType<LoadingProps>
} & SimpleGridProps

export function InfiniteGrid<T>({
  spacing = 4,
  hasMore,
  isLoading,
  items,
  itemRender,
  loadMore,
  Loading: propsLoading,
  ...rest
}: Props<T>) {
  const wrapper = useRef<HTMLDivElement | null>(null)
  const bottomElement = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entities: IntersectionObserverEntry[]) => {
    const target = entities[0]
    if (target.isIntersecting && hasMore) loadMore()
  }, [loadMore, hasMore])

  useEffect(() => {
    if (!bottomElement.current) return

    const options: IntersectionObserverInit = {
      root: wrapper.current,
      threshold: 0,
    }
    const observer = new IntersectionObserver(handleObserver, options)
    if (bottomElement.current) observer.observe(bottomElement.current)

    console.log('bottomElement: ', bottomElement)

    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleObserver, bottomElement.current])

  const LoadingComponent = propsLoading || DefaultLoading;

  return (
    <SimpleGrid 
      spacing={spacing}
      ref={wrapper}
      w="full"
      {...rest}
    >
      {items.map((it, index) => (
        <Box 
          key={`item-${index}`}
          ref={(items.length - 10) === index ? bottomElement : undefined}
        >
          {itemRender(it, index)}
        </Box>
      ))}
      <LoadingComponent isLoading={isLoading} />
    </SimpleGrid>
  );
}

const DefaultLoading = ({
  isLoading,
}: LoadingProps) => isLoading ? (
  <Center w="full">
    <Spinner size="24px" />
  </Center>) : <></>