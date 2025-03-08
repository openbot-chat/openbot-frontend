import React, { useEffect, useRef } from 'react'
import { OpenbotLogo } from './icons/OpenbotLogo'

type Props = {
  botContainer?: HTMLDivElement
}

export const LiteBadge: React.FC<Props> = ({ botContainer }) => {
  const liteBadge = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!document || !botContainer) return

    const appendBadgeIfNecessary = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((removedNode) => {
          if (
            'id' in removedNode &&
            liteBadge &&
            (removedNode as any).id == 'lite-badge'
          ) {
            console.log("Sorry, you can't remove the brand 😅")
            liteBadge.current && botContainer?.append(liteBadge.current)
          }
        })
      })
    }

    const observer = new MutationObserver(appendBadgeIfNecessary)
    observer.observe(botContainer, {
      subtree: false,
      childList: true,
    })

    return () => observer.disconnect()
  }, [botContainer])

  return (
    <a
      ref={liteBadge}
      href={'https://openbot.chat/?utm_source=litebadge'}
      target="_blank"
      rel="noopener noreferrer"
      className="lite-badge"
      id="lite-badge"
    >
      <OpenbotLogo />
      <span>Made with Openbot</span>
    </a>
  )
}