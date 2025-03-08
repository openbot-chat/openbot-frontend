import { customElement } from './utils/customElement'
import {
  defaultBotProps,
  defaultBubbleProps,
  defaultPopupProps,
} from './constants'
import { Bubble } from './features/bubble'
import { Popup } from './features/popup'
import { Standard } from './features/standard'

export const registerWebComponents = () => {
  if (typeof window === 'undefined') return
  customElement('openbot-standard', defaultBotProps, Standard)
  customElement('openbot-bubble', defaultBubbleProps, Bubble)
  customElement('openbot-popup', defaultPopupProps, Popup)
}
