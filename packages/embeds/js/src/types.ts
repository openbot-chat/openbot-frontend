export enum BackgroundType {
  COLOR = 'Color',
  IMAGE = 'Image',
  NONE = 'None',
}

export type Background = {
  type: BackgroundType
  content?: string
}

export type Theme = {
  general?: GeneralTheme
  chat?: ChatTheme
  customCss?: string
}

export type AvatarProps = {
  isEnabled: boolean
  url?: string
}

export type ContainerColors = {
  backgroundColor: string
  color: string
}

export type InputColors = ContainerColors & {
  placeholderColor: string
}

export type GeneralTheme = {
  font: string
  background: Background
}

export type ChatTheme = {
  hostAvatar?: AvatarProps
  guestAvatar?: AvatarProps
  hostBubbles: ContainerColors,
  guestBubbles: ContainerColors,
  buttons: ContainerColors,
  inputs: InputColors,
  roundness?: 'none' | 'medium' | 'large'
}

export type Agent = {
  id: string
  name: string
  theme?: Theme
  avatar?: {
    type: 'photo' | '3d' | 'video'
    provider?: string
    thumbnail?: string
    options?: any
  }
  voice?: {
    provider: string,
    identifier: string,
    options: any
  }
  settings?: {
    general?: {
      isBrandingEnabled: boolean
      rememberUser?: {
        storage?: 'local' | 'session'
      }
    },
    metadata?: any
  }
}

export type ChatReply = {
  agent?: Agent
  conversationId?: string
}

export type BotContext = {
  agentId: string
  conversationId?: string
  isPreview: boolean
  showAvatar?: boolean
  apiHost?: string
  provider?: string
}

export type InitialChatReply = ChatReply & {
  agent: NonNullable<ChatReply['agent']>
  conversationId: NonNullable<ChatReply['conversationId']>
}
