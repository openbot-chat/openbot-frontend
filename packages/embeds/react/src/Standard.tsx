import { useEffect, useRef } from 'react'
import type { BotProps } from '@openbot/js2'

type Props = BotProps & {
  style?: React.CSSProperties
  className?: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openbot-standard': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { class?: string }
    }
  }
}

type StandardElement = HTMLElement & Props

export const Standard = ({ style, className, ...assignableProps }: Props) => {
  const ref = useRef<StandardElement | null>(null)

  useEffect(() => {
    ; (async () => {
      await import('@openbot/js2/dist/web')
    })()
  }, [])

  useEffect(() => {
    if (!ref.current) return
    Object.assign(ref.current, assignableProps)
  }, [assignableProps])

  return <openbot-standard ref={ref} style={style} class={className} />
}
