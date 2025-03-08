import React, { useCallback, useEffect, useState } from 'react'
import { isDefined, isNotDefined } from '@openbot/lib'
import { CommandData } from '../../commands'
import { PopupParams } from '../types'
import { Bot, BotProps } from '../../../components/Bot'
import styles from '../../../assets/index.css'

export type PopupProps = BotProps &
  PopupParams & {
    defaultOpen?: boolean
    isOpen?: boolean
    onOpen?: () => void
    onClose?: () => void
  }

export const Popup: React.FC<PopupProps> = (props) => {
  const {
    onOpen,
    onClose,
    autoShowDelay,
    theme,
    isOpen,
    defaultOpen,
    ...botProps
  } = props

  const [prefilledVariables, setPrefilledVariables] = useState(botProps.prefilledVariables)

  const [isBotOpened, setIsBotOpened] = useState(isOpen ?? false)

  const closeBot = useCallback(() => {
    setIsBotOpened(false)
    onClose?.()
  }, [setIsBotOpened, onClose])

  const openBot = useCallback(() => {
    setIsBotOpened(true)
    onOpen?.()
  }, [setIsBotOpened, onOpen])

  useEffect(() => {
    if (isBotOpened) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('pointerdown', closeBot)
    }
    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('pointerdown', closeBot)
    }
  }, [isBotOpened, closeBot])

  const toggleBot = useCallback(() => {
    isBotOpened ? closeBot() : openBot()
  }, [isBotOpened, closeBot, openBot])

  const processIncomingEvent = useCallback((event: MessageEvent<CommandData>) => {
    const { data } = event
    if (!data.isFromAgent) return
    if (data.command === 'open') openBot()
    if (data.command === 'close') closeBot()
    if (data.command === 'toggle') toggleBot()
    if (data.command === 'setPrefilledVariables')
      setPrefilledVariables({
        ...prefilledVariables,
        ...data.variables,
      })
  }, [openBot, closeBot, toggleBot])

  useEffect(() => {
    window.addEventListener('message', processIncomingEvent)
    return () => {
      window.removeEventListener('message', processIncomingEvent)
    }
  }, [processIncomingEvent])

  useEffect(() => {
    if (defaultOpen) openBot()
    if (isDefined(autoShowDelay)) {
      setTimeout(() => {
        openBot()
      }, autoShowDelay)
    }
  }, [])

  useEffect(() => {
    if (isNotDefined(isOpen) || isOpen === isBotOpened) return
    toggleBot()
  }, [isOpen])

  useEffect(() => {
    setPrefilledVariables({
      ...prefilledVariables,
      ...botProps.prefilledVariables
    })
  }, [botProps.prefilledVariables])

  if (!isBotOpened) return <></>

  return (
    <>
      <style>{styles}</style>
      <div
        className="relative"
        style={{
          zIndex: 42424242,
        }}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fade-in"
          {...{ part: 'overlay' }}
          onClick={closeBot}
        />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div
              className={
                'relative h-[80vh] transform overflow-hidden rounded-lg text-left transition-all sm:my-8 sm:w-full sm:max-w-lg' +
                (theme?.backgroundColor ? ' shadow-xl' : '')
              }
              style={{
                backgroundColor:
                  theme?.backgroundColor ?? '#fff',
              }}
              onPointerDown={e => e.stopPropagation()}
            >
              <Bot {...botProps} prefilledVariables={prefilledVariables} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
