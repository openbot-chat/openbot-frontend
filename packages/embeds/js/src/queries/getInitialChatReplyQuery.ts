import { InitialChatReply, Agent } from '../types'
import { guessApiHost } from '../utils/guessApiHost'
import { isNotEmpty, sendRequest } from '@openbot/lib'

export type StartParams = {
  agent?: string | Agent
  conversationId?: string
  isStreamEnabled?: boolean
}

export async function getInitialChatReplyQuery({
  agent,
  apiHost,
  provider,
  conversationId,
}: StartParams & {
  apiHost?: string
  provider?: string
}): Promise<{ data?: InitialChatReply; error?: Error }> {
  if (!agent)
    throw new Error('Agent ID is required to renew conversation')

  const baseUrl = isNotEmpty(apiHost) ? apiHost : guessApiHost()

  // 分配一个会话
  const resp = await sendRequest<{ id: string }>({
    method: 'POST',
    url: `${baseUrl}/conversations/renew`,
    body: {
      provider: provider ?? 'web',
      agent_id: typeof agent === 'string' ? agent : agent.id,
      id: conversationId,
    },
  })

  if (resp.error) {
    throw resp.error
  }

  conversationId = resp.data?.id
  if (!conversationId) {
    throw new Error('Empty agent conversation')
  }

  if (typeof agent !== 'string') {
    // 直接传入了agent结构，以传入为准
    return {
      data: {
        agent: {
          ...agent,
          theme: {
            customCss: ""
          },
          settings: {
            general: {
              isBrandingEnabled: false
            },
            metadata: {
            }
          }
        },
        conversationId,
      },
    }
  }

  // 传入的是agent id，查询agent详细信息
  const agentResp = await sendRequest<Agent>({
    url: `${baseUrl}/agents/${agent}`,
    method: 'GET'
  })

  if (agentResp.error) {
    throw agentResp.error
  }

  agent = agentResp.data!
  return {
    data: {
      agent: {
        ...agent,
        theme: {
          customCss: ""
        },
        settings: {
          general: {
            isBrandingEnabled: false
          },
          metadata: {
          }
        }
      },
      conversationId,
    }
  }
}
