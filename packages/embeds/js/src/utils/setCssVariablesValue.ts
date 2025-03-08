import { isLight, hexToRgb } from '@openbot/lib/hexToRgb'
import { Theme, GeneralTheme, ChatTheme, ContainerColors, Background, BackgroundType, InputColors } from '../types'


const cssVariableNames = {
  general: {
    bgImage: '--openbot-container-bg-image',
    bgColor: '--openbot-container-bg-color',
    fontFamily: '--openbot-container-font-family',
    color: '--openbot-container-color',
  },
  chat: {
    hostBubbles: {
      bgColor: '--openbot-host-bubble-bg-color',
      color: '--openbot-host-bubble-color',
    },
    guestBubbles: {
      bgColor: '--openbot-guest-bubble-bg-color',
      color: '--openbot-guest-bubble-color',
    },
    inputs: {
      bgColor: '--openbot-input-bg-color',
      color: '--openbot-input-color',
      placeholderColor: '--openbot-input-placeholder-color',
    },
    buttons: {
      bgColor: '--openbot-button-bg-color',
      bgColorRgb: '--openbot-button-bg-color-rgb',
      color: '--openbot-button-color',
    },
    checkbox: {
      bgColor: '--openbot-checkbox-bg-color',
    },
  },
} as const

export const setCssVariablesValue = (
  theme: Theme | undefined,
  container: HTMLDivElement
) => {
  if (!theme) return
  const documentStyle = container?.style
  if (!documentStyle) return
  if (theme.general) setGeneralTheme(theme.general, documentStyle)
  if (theme.chat) setChatTheme(theme.chat, documentStyle)
}

const setGeneralTheme = (
  generalTheme: GeneralTheme,
  documentStyle: CSSStyleDeclaration
) => {
  const { background, font } = generalTheme
  if (background) setOpenbotBackground(background, documentStyle)
  if (font) documentStyle.setProperty(cssVariableNames.general.fontFamily, font)
}

const setChatTheme = (
  chatTheme: ChatTheme,
  documentStyle: CSSStyleDeclaration
) => {
  const { hostBubbles, guestBubbles, buttons, inputs, roundness } = chatTheme
  if (hostBubbles) setHostBubbles(hostBubbles, documentStyle)
  if (guestBubbles) setGuestBubbles(guestBubbles, documentStyle)
  if (buttons) setButtons(buttons, documentStyle)
  if (inputs) setInputs(inputs, documentStyle)
  if (roundness) setRoundness(roundness, documentStyle)
}

const setHostBubbles = (
  hostBubbles: ContainerColors,
  documentStyle: CSSStyleDeclaration
) => {
  if (hostBubbles.backgroundColor)
    documentStyle.setProperty(
      cssVariableNames.chat.hostBubbles.bgColor,
      hostBubbles.backgroundColor
    )
  if (hostBubbles.color)
    documentStyle.setProperty(
      cssVariableNames.chat.hostBubbles.color,
      hostBubbles.color
    )
}

const setGuestBubbles = (
  guestBubbles: ContainerColors,
  documentStyle: CSSStyleDeclaration
) => {
  if (guestBubbles.backgroundColor)
    documentStyle.setProperty(
      cssVariableNames.chat.guestBubbles.bgColor,
      guestBubbles.backgroundColor
    )
  if (guestBubbles.color)
    documentStyle.setProperty(
      cssVariableNames.chat.guestBubbles.color,
      guestBubbles.color
    )
}

const setButtons = (
  buttons: ContainerColors,
  documentStyle: CSSStyleDeclaration
) => {
  if (buttons.backgroundColor) {
    documentStyle.setProperty(
      cssVariableNames.chat.buttons.bgColor,
      buttons.backgroundColor
    )
    documentStyle.setProperty(
      cssVariableNames.chat.buttons.bgColorRgb,
      hexToRgb(buttons.backgroundColor).join(', ')
    )
  }

  if (buttons.color)
    documentStyle.setProperty(
      cssVariableNames.chat.buttons.color,
      buttons.color
    )
}

const setInputs = (inputs: InputColors, documentStyle: CSSStyleDeclaration) => {
  if (inputs.backgroundColor)
    documentStyle.setProperty(
      cssVariableNames.chat.inputs.bgColor,
      inputs.backgroundColor
    )
  if (inputs.color)
    documentStyle.setProperty(cssVariableNames.chat.inputs.color, inputs.color)
  if (inputs.placeholderColor)
    documentStyle.setProperty(
      cssVariableNames.chat.inputs.placeholderColor,
      inputs.placeholderColor
    )
}

const setOpenbotBackground = (
  background: Background,
  documentStyle: CSSStyleDeclaration
) => {
  documentStyle.setProperty(cssVariableNames.general.bgImage, null)
  documentStyle.setProperty(cssVariableNames.general.bgColor, null)
  documentStyle.setProperty(
    background?.type === BackgroundType.IMAGE
      ? cssVariableNames.general.bgImage
      : cssVariableNames.general.bgColor,
    parseBackgroundValue(background)
  )
  const backgroundColor =
    (BackgroundType.COLOR ? background.content : '#ffffff') ?? '#ffffff'
  documentStyle.setProperty(
    cssVariableNames.chat.checkbox.bgColor,
    (BackgroundType.COLOR ? background.content : '#ffffff') ?? '#ffffff'
  )
  documentStyle.setProperty(
    cssVariableNames.general.color,
    isLight(backgroundColor) ? '#303235' : '#ffffff'
  )
}

const parseBackgroundValue = ({ type, content }: Background) => {
  switch (type) {
    case BackgroundType.NONE:
      return 'transparent'
    case BackgroundType.COLOR:
      return content ?? '#ffffff'
    case BackgroundType.IMAGE:
      return `url(${content})`
  }
}

const setRoundness = (
  roundness: NonNullable<ChatTheme['roundness']>,
  documentStyle: CSSStyleDeclaration
) => {
  switch (roundness) {
    case 'none':
      documentStyle.setProperty('--openbot-border-radius', '0')
      break
    case 'medium':
      documentStyle.setProperty('--openbot-border-radius', '6px')
      break
    case 'large':
      documentStyle.setProperty('--openbot-border-radius', '20px')
      break
  }
}
