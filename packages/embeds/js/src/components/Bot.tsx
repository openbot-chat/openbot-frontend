import { LiteBadge } from './LiteBadge'
import { isNotDefined, isNotEmpty } from '@openbot/lib'
import { getInitialChatReplyQuery } from '../queries/getInitialChatReplyQuery'
import { Agent, BotContext, InitialChatReply } from '../types'
import { ErrorMessage } from './ErrorMessage'
import {
  getExistingConversationIdFromStorage,
  setConversationInStorage,
} from '../utils/storage'
import { setCssVariablesValue } from '../utils/setCssVariablesValue'
import chatStyes from '@stream-io/stream-chat-css/dist/v2/css/index.css'
import botStyles from '../assets/bot.css'
import katexStyles from '@openbot/aibot-uikit/dist/css/katex.min.css'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Client } from '../client'
import type { Channel, Event } from '@openbot/aibot-uikit/dist/types';
import { Channel as UIChannel, Chat, MessageInput, VirtualizedMessageList, Window } from '@openbot/aibot-uikit'
import { Avatar } from './Avatar'
import { Say } from './Say'
import { AgentProvider, useAgent } from '../context/AgentContext'

export type BotProps = {
  agent: string | Agent
  showAvatar?: boolean
  isPreview?: boolean
  conversationId?: string
  apiHost?: string
  provider?: string
  prefilledVariables?: Record<string, unknown>
  onRunStep?: (runStep: Record<string, unknown>) => void
}

export const Bot: React.FC<BotProps & { class?: string }> = (props) => {
  const [initialChatReply, setInitialChatReply] = useState<InitialChatReply | undefined>()
  const [customCss, setCustomCss] = useState('')
  const [error, setError] = useState<Error | undefined>()

  // 传入的 agent id
  const agentIdFromProps = useMemo(() => {
    return typeof props.agent === 'string' ? props.agent : props.agent?.id
  }, [props.agent])

  // 如果传入的是 agent 对象，就一定是预览模式
  const isPreview = useMemo(() => {
    return typeof props.agent !== 'string' || (props.isPreview ?? false)
  }, [props.agent, props.isPreview])

  // 初始化流程
  const initializeBot = useCallback(async () => {
    const { data, error } = await getInitialChatReplyQuery({
      agent: props.agent,
      apiHost: props.apiHost,
      provider: props.provider,
      // 恢复会话
      conversationId: isNotEmpty(props.conversationId)
        ? props.conversationId
        : getExistingConversationIdFromStorage(agentIdFromProps),
    })
    if (error && 'code' in error && typeof error.code === 'string') {
      if (isPreview) {
        // 预览是实时编辑的，所以不显示错误
        return setError(
          new Error('An error occurred while loading the bot.', {
            cause: error.message,
          })
        )
      }
      if (['BAD_REQUEST', 'FORBIDDEN'].includes(error.code))
        return setError(new Error('This agent is now closed.'))
      if (error.code === 'NOT_FOUND')
        return setError(new Error("The agent you're looking for doesn't exist."))
    }

    if (!data) return setError(new Error("Error! Couldn't initiate the chat."))

    // 保存会话，以便下次恢复
    if (data.conversationId && agentIdFromProps)
      setConversationInStorage(data.agent.settings?.general?.rememberUser?.storage)(
        agentIdFromProps,
        data.conversationId
      )

    setInitialChatReply(data)

    // 优先使用传入的css
    const customCssFromProps = typeof props.agent === 'string' ? '' : (props.agent.theme?.customCss ?? '')
    setCustomCss(customCssFromProps ?? data.agent.theme?.customCss ?? '')

  }, [props, agentIdFromProps, isPreview])

  // 切换了 agent 需要重新初始化
  useEffect(() => {
    if (isNotDefined(props.agent)) return
    if (!!initialChatReply && initialChatReply.agent.id === agentIdFromProps) return

    initializeBot()
  }, [agentIdFromProps, initialChatReply, initializeBot])

  // 优先使用传入的 agent 配置
  const mergedInitialChatReply = useMemo(() => {
    return initialChatReply ? {
      ...initialChatReply,
      agent: {
        ...initialChatReply.agent,
        avatar:
          (typeof props.agent === 'string' ? undefined : props.agent.avatar) ?? initialChatReply.agent.avatar,
        voice:
          (typeof props.agent === 'string' ? undefined : props.agent.voice) ?? initialChatReply.agent.voice,
        settings:
          (typeof props.agent === 'string' ? undefined : props.agent.settings) ?? initialChatReply.agent.settings,
        theme:
          (typeof props.agent === 'string' ? undefined : props.agent.theme) ?? initialChatReply.agent.theme,
      },
    } : undefined
  }, [props.agent, initialChatReply])

  return (
    <AgentProvider agent={mergedInitialChatReply?.agent}>
      <style>{chatStyes}</style>
      <style>{botStyles}</style>
      <style>{katexStyles}</style>
      {
        customCss &&
        <style>{customCss}</style>
      }
      {
        error &&
        <ErrorMessage error={error} />
      }
      {
        mergedInitialChatReply &&
        <BotContent
          class={props.class}
          initialChatReply={mergedInitialChatReply}
          context={{
            apiHost: props.apiHost,
            provider: props.provider,
            isPreview,
            showAvatar: props.showAvatar,
            agentId: mergedInitialChatReply.agent.id,
            conversationId: mergedInitialChatReply.conversationId,
          }}
          onRunStep={props.onRunStep}
        />
      }
    </AgentProvider>
  )
}

type BotContentProps = {
  class?: string
  initialChatReply: InitialChatReply
  context: BotContext
  onRunStep?: (runStep: Record<string, unknown>) => void
}

const BotContent: React.FC<BotContentProps> = (props) => {
  const [botContainer, setBotContainer] = useState<HTMLDivElement>()
  const botContainerRef = useRef<HTMLDivElement | null>(null)
  const [client, setClient] = useState<Client>()
  const [channel, setChannel] = useState<Channel>()

  useEffect(() => {
    console.warn('BotContent remount')
  }, [])

  useEffect(() => {
    setBotContainer(botContainerRef.current ?? undefined)
  }, [botContainerRef])

  useEffect(() => {
    if (!botContainer) return
    const resizeObserver = new ResizeObserver((_entries) => {
      // return setIsMobile(entries[0].target.clientWidth < 400)
    })
    resizeObserver.observe(botContainer)
    return () => {
      resizeObserver.disconnect()
    }
  }, [botContainer])

  const { setState } = useAgent()
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // 切换 agent 或会话时重新相应的 client
  useEffect(() => {
    console.warn('Bot useEffect client new')
    const { apiHost: baseURL } = props.context
    const client = new Client({ baseURL })

    setClient(client)

    // 当新消息到达时, 设置动画
    const updatedHandler = () => {
      setState('talking')
      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(() => {
        setState('idle')
      }, 3000)
    }

    const runStepEventHandler = (event) => {
      const e = event as { type: string; data: any }
      props.onRunStep?.(e.data)
      console.warn('props.onRunStep: ', props.onRunStep)
    }

    client.on('message.updated', updatedHandler)
    client.on('run_step.new', runStepEventHandler)
  
    return () => {
      setClient(undefined)

      client.off('message.updated', updatedHandler)
      client.off('run_step.new', runStepEventHandler)

      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [
    timerRef,
    props.onRunStep,
    props.initialChatReply.conversationId,
    props.context.apiHost
  ])

  useEffect(() => {
    if (!client) return

    const { agent, conversationId } = props.initialChatReply

    console.log('Bot useEffect agent: ', agent)

    const channel = client.channel('messaging', conversationId, { agent })

    setChannel(channel)

    return () => {
      setChannel(undefined)
    }
  }, [
    client,
    props.initialChatReply,
  ])

  // const injectCustomFont = useCallback(() => {
  //   const href = `https://fonts.googleapis.com/css2?family=${props.initialChatReply.agent?.theme?.general?.font ?? 'Open Sans'
  //     }:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap');')`

  //   const existingFont = document.getElementById('bot-font')
  //   if (existingFont) {
  //     if (existingFont
  //       .getAttribute('href')
  //       ?.includes(
  //         props.initialChatReply.agent?.theme?.general?.font ?? 'Open Sans'
  //       )) {
  //       return
  //     }
  //     existingFont.setAttribute('href', href)
  //   } else {
  //     const font = document.createElement('link')
  //     font.href = href
  //     font.rel = 'stylesheet'
  //     font.id = 'bot-font'
  //     document.head.appendChild(font)
  //   }
  // }, [props.initialChatReply.agent])

  useEffect(() => {
    // injectCustomFont()
    if (!botContainer) return
    setCssVariablesValue(props.initialChatReply.agent.theme, botContainer)
  }, [props.initialChatReply.agent, botContainer])

  console.warn(`render model: ${props.initialChatReply.agent?.avatar?.options?.modelSrc}?quality=low`)


  return (
    <div
      ref={botContainerRef}
      className={
        `relative w-full h-full text-base overflow-hidden bg-cover bg-center openbot-container ${props.class ?? ''} ${props.context.showAvatar ? 'openbot-container--with-avatar' : ''}`
      }
    >
      <div className='openbot-avatar-container'>
        {
          props.context.showAvatar && props.initialChatReply.agent.avatar &&
          <Avatar {...props.initialChatReply.agent.avatar} />
        }
      </div>
      <div className='openbot-messages-container'>
        {
          client &&
          <Chat client={client}>
            <UIChannel
              channel={channel}
              dragAndDropWindow
              acceptedFiles={["image/*"]}
              maxNumberOfFiles={4}
              skipMessageDataMemoization
              EmptyStateIndicator={() => null}
              // 这里要把 MessageInput 的属性复制一遍，dnd 的时候才会设置到 MessageInputContext
              optionalMessageInputProps={{
                focus: true,
                grow: true,
                voice: true,
                useMentionsTransliteration: false
              }}
            >
              <Window>
                <VirtualizedMessageList messageActions={[]} additionalVirtuosoProps={{ increaseViewportBy: 30000 }} />
                <MessageInput focus grow voice useMentionsTransliteration={false} />
              </Window>
            </UIChannel>
          </Chat>
        }
      </div>
      {
        props.initialChatReply.agent.voice?.options?.enabled && channel &&
        <Say
          channel={channel}
          agent={props.initialChatReply.agent}
          apiHost={props.context.apiHost}
        />
      }
      {
        props.initialChatReply.agent.settings?.general?.isBrandingEnabled &&
        <LiteBadge botContainer={botContainer} />
      }
    </div>
  )
}