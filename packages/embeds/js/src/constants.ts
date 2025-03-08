import type { BubbleProps } from './features/bubble'
import type { PopupProps } from './features/popup'
import type { BotProps } from './components/Bot'

export const defaultBotProps: BotProps = {
  agent: '',
  showAvatar: undefined,
  isPreview: undefined,
  apiHost: undefined,
  provider: undefined,
  prefilledVariables: undefined,
  onRunStep: undefined,
}

export const defaultPopupProps: PopupProps = {
  ...defaultBotProps,
  onClose: undefined,
  onOpen: undefined,
  theme: undefined,
  autoShowDelay: undefined,
  isOpen: undefined,
  defaultOpen: undefined,
}

export const defaultBubbleProps: BubbleProps = {
  ...defaultBotProps,
  onClose: undefined,
  onOpen: undefined,
  theme: undefined,
  previewMessage: undefined,
  onPreviewMessageClick: undefined,
  autoShowDelay: undefined,
}
