import React, { useState } from 'react'
import {
  BubbleTheme,
  ButtonTheme,
  PreviewMessageParams,
  PreviewMessageTheme,
} from '../types'

export type PreviewMessageProps = Pick<BubbleTheme, 'placement'> &
  Pick<PreviewMessageParams, 'avatarUrl' | 'message'> & {
    buttonSize: ButtonTheme['size']
    previewMessageTheme?: PreviewMessageTheme
    onClick: () => void
    onCloseClick: () => void
  }

const defaultBackgroundColor = '#F7F8FF'
const defaultTextColor = '#303235'

export const PreviewMessage: React.FC<PreviewMessageProps> = (props) => {
  const [isPreviewMessageHovered, setIsPreviewMessageHovered] = useState(false)

  return (
    <div
      {...{
        part: "preview-message"
      }}
      onClick={() => props.onClick()}
      className={
        'fixed max-w-[256px] rounded-md duration-200 flex items-center gap-4 shadow-md animate-fade-in cursor-pointer hover:shadow-lg p-4' +
        (props.buttonSize === 'large' ? ' bottom-24' : ' bottom-20') +
        (props.placement === 'left' ? ' left-5' : ' right-5')
      }
      style={{
        backgroundColor:
          props.previewMessageTheme?.backgroundColor ?? defaultBackgroundColor,
        color: props.previewMessageTheme?.textColor ?? defaultTextColor,
        zIndex: 42424242,
      }}
      onMouseEnter={() => setIsPreviewMessageHovered(true)}
      onMouseLeave={() => setIsPreviewMessageHovered(false)}
    >
      <CloseButton
        isHovered={isPreviewMessageHovered}
        previewMessageTheme={props.previewMessageTheme}
        onClick={props.onCloseClick}
      />
      {
        props.avatarUrl &&
        <img
          {...{
            elementtiming: 'Bot avatar',
            fetchPriority: 'high'
          }}
          src={props.avatarUrl}
          className="rounded-full w-8 h-8 object-cover"
          alt="Bot avatar"
        />
      }
      <p>{props.message}</p>
    </div>
  )
}

const CloseButton: React.FC<{
  isHovered: boolean
  previewMessageTheme?: PreviewMessageTheme
  onClick: () => void
}> = (props) => (
  <button
    className={
      `absolute -top-2 -right-2 rounded-full w-6 h-6 p-1 hover:brightness-95 active:brightness-90 transition-all border ` +
      (props.isHovered ? 'opacity-100' : 'opacity-0')
    }
    onClick={(e) => {
      e.stopPropagation()
      return props.onClick()
    }}
    style={{
      backgroundColor:
        props.previewMessageTheme?.closeButtonBackgroundColor ??
        defaultBackgroundColor,
      color:
        props.previewMessageTheme?.closeButtonIconColor ?? defaultTextColor,
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
)
