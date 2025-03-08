import { CommandData } from '../../commands'
import { BubbleButton } from './BubbleButton'
import { PreviewMessage, PreviewMessageProps } from './PreviewMessage'
import { isDefined } from '@openbot/lib'
import { BubbleParams } from '../types'
import { Bot, BotProps } from '../../../components/Bot'
import { useCallback, useEffect, useState } from 'react'
import styles from '../../../assets/index.css'

export type BubbleProps = BotProps &
  BubbleParams & {
    onOpen?: () => void
    onClose?: () => void
    onPreviewMessageClick?: () => void
  }

export const Bubble: React.FC<BubbleProps> = (props) => {
  const {
    onOpen,
    onClose,
    previewMessage: previewMessageFromProps,
    onPreviewMessageClick,
    theme,
    autoShowDelay,
    ...botProps
  } = props

  const [prefilledVariables, setPrefilledVariables] = useState(botProps.prefilledVariables)
  const [isPreviewMessageDisplayed, setIsPreviewMessageDisplayed] = useState(false)
  const [previewMessage, setPreviewMessage] = useState<
    Pick<PreviewMessageProps, 'avatarUrl' | 'message'>
  >({
    message: previewMessageFromProps?.message ?? '',
    avatarUrl: previewMessageFromProps?.avatarUrl,
  })
  const [isBotOpened, setIsBotOpened] = useState(false)
  const [isBotStarted, setIsBotStarted] = useState(false)

  const openBot = useCallback(() => {
    if (!isBotStarted) setIsBotStarted(true)
    hideMessage()
    setIsBotOpened(true)
    if (!isBotOpened) onOpen?.()
  }, [isBotStarted, setIsBotStarted, isBotOpened, setIsBotOpened])

  const closeBot = useCallback(() => {
    setIsBotOpened(false)
    if (isBotOpened) onClose?.()
  }, [isBotOpened, setIsBotOpened])

  const toggleBot = useCallback(() => {
    isBotOpened ? closeBot() : openBot()
  }, [isBotOpened, openBot, closeBot])

  const handlePreviewMessageClick = useCallback(() => {
    onPreviewMessageClick?.()
    openBot()
  }, [openBot])

  const showMessage = useCallback((
    previewMessage?: Pick<PreviewMessageProps, 'avatarUrl' | 'message'>
  ) => {
    if (previewMessage) setPreviewMessage(previewMessage)
    if (isBotOpened) return
    setIsPreviewMessageDisplayed(true)
  }, [isBotOpened])

  const hideMessage = () => {
    setIsPreviewMessageDisplayed(false)
  }

  const processIncomingEvent = useCallback((event: MessageEvent<CommandData>) => {
    const { data } = event
    if (!data.isFromAgent) return
    if (data.command === 'open') openBot()
    if (data.command === 'close') closeBot()
    if (data.command === 'toggle') toggleBot()
    if (data.command === 'showPreviewMessage') showMessage(data.message)
    if (data.command === 'hidePreviewMessage') hideMessage()
    if (data.command === 'setPrefilledVariables')
      setPrefilledVariables({
        ...prefilledVariables,
        ...data.variables,
      })
  }, [openBot, closeBot, toggleBot, showMessage])

  useEffect(() => {
    window.addEventListener('message', processIncomingEvent)
    return () => {
      window.removeEventListener('message', processIncomingEvent)
    }
  }, [processIncomingEvent])

  useEffect(() => {
    const previewMessageAutoShowDelay = previewMessageFromProps?.autoShowDelay
    if (isDefined(autoShowDelay)) {
      setTimeout(() => {
        openBot()
      }, autoShowDelay)
    }
    if (isDefined(previewMessageAutoShowDelay)) {
      setTimeout(() => {
        showMessage()
      }, previewMessageAutoShowDelay)
    }
  }, [])

  useEffect(() => {
    setPrefilledVariables({
      ...prefilledVariables,
      ...botProps.prefilledVariables
    })
  }, [botProps.prefilledVariables])

  return (
    <>
      <style>{styles}</style>
      {
        isPreviewMessageDisplayed &&
        <PreviewMessage
          {...previewMessage}
          placement={theme?.placement}
          previewMessageTheme={theme?.previewMessage}
          buttonSize={theme?.button?.size}
          onClick={handlePreviewMessageClick}
          onCloseClick={hideMessage}
        />
      }
      <BubbleButton
        {...theme?.button}
        placement={theme?.placement}
        toggleBot={toggleBot}
        isBotOpened={isBotOpened}
      />
      <div
        {...{
          part: 'bot'
        }}
        style={{
          height: 'calc(100% - 80px)',
          transition:
            'transform 200ms cubic-bezier(0, 1.2, 1, 1), opacity 150ms ease-out',
          transformOrigin:
            props.theme?.placement === 'left' ? 'bottom left' : 'bottom right',
          transform: isBotOpened ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 1)',
          boxShadow: 'rgb(0 0 0 / 16%) 0px 5px 40px',
          backgroundColor: theme?.chatWindow?.backgroundColor,
          zIndex: 42424242,
        }}
        className={
          'fixed rounded-lg w-full sm:w-[400px] max-h-[704px]' +
          (isBotOpened ? ' opacity-1' : ' opacity-0 pointer-events-none') +
          (theme?.button?.size === 'large'
            ? ' bottom-24'
            : ' bottom-20') +
          (theme?.placement === 'left' ? ' sm:left-5' : ' sm:right-5')
        }
      >
        {
          isBotStarted &&
          <Bot
            {...botProps}
            prefilledVariables={prefilledVariables}
            class="rounded-lg"
          />
        }
      </div>
    </>
  )
}
