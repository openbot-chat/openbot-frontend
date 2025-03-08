import { BubbleProps } from './features/bubble'
import { PopupProps } from './features/popup'
import { BotProps } from './components/Bot'
import {
  close,
  hidePreviewMessage,
  open,
  setPrefilledVariables,
  showPreviewMessage,
  toggle,
} from './features/commands'

export const initStandard = (props: BotProps & { id?: string }) => {
  const standardElement = props.id
    ? document.getElementById(props.id)
    : document.querySelector('openbot-standard')
  if (!standardElement) throw new Error('<openbot-standard> element not found.')
  Object.assign(standardElement, props)
}

export const initPopup = (props: PopupProps) => {
  const popupElement = document.createElement('openbot-popup')
  Object.assign(popupElement, props)
  document.body.appendChild(popupElement)
}

export const initBubble = (props: BubbleProps) => {
  const bubbleElement = document.createElement('openbot-bubble')
  Object.assign(bubbleElement, props)
  document.body.appendChild(bubbleElement)
}

type Agent = {
  initStandard: typeof initStandard
  initPopup: typeof initPopup
  initBubble: typeof initBubble
  close: typeof close
  hidePreviewMessage: typeof hidePreviewMessage
  open: typeof open
  setPrefilledVariables: typeof setPrefilledVariables
  showPreviewMessage: typeof showPreviewMessage
  toggle: typeof toggle
}

declare const window:
  | {
    Agent: Agent | undefined
  }
  | undefined

export const parseAgent = () => ({
  initStandard,
  initPopup,
  initBubble,
  close,
  hidePreviewMessage,
  open,
  setPrefilledVariables,
  showPreviewMessage,
  toggle,
})

export const injectAgentInWindow = (agent: Agent) => {
  if (typeof window === 'undefined') return
  window.Agent = { ...agent }
}
