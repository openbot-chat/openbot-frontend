import { useCallback, useEffect, useRef, useState } from 'react'
import type { PopupProps } from '@openbot/js2'

type Props = PopupProps

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openbot-popup': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { class?: string }
    }
  }
}

type PopupElement = HTMLElement & Props

export const Popup = (props: Props) => {
  const ref = useRef<PopupElement | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    ; (async () => {
      await import('@openbot/js2/dist/web')
      setIsInitialized(true)
    })()
    return () => {
      ref.current?.remove()
    }
  }, [])

  const attachPopupToDom = useCallback((props: Props) => {
    const popupElement = document.createElement('openbot-popup') as PopupElement
    ref.current = popupElement
    injectPropsToElement(ref.current, props)
    document.body.append(ref.current)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    if (!ref.current) attachPopupToDom(props)
    injectPropsToElement(ref.current as PopupElement, props)
  }, [attachPopupToDom, isInitialized, props])

  const injectPropsToElement = (element: PopupElement, props: Props) => {
    Object.assign(element, props)
  }

  return null
}
