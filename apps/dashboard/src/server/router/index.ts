import { router } from '../trpc-server'
import { userRouter } from './user'
import { orgRouter } from '@/features/organization/api/router'
import { invitationRouter } from '@/features/organization/api/invitation'
import { apikeyRouter } from '@/features/apikey/api/router'
import { agentRouter } from '@/features/agent/api/router'
import { pluginRouter } from '@/features/plugin/api/router'
import { voiceRouter } from '@/features/voice/api/router'
import { datastoreRouter } from '@/features/datastore/api/router'
import { datasourceRouter } from '@/features/datasource/api/router'
import { documentRouter } from '@/features/document/api/router'
import { credentialsRouter, connectionRouter } from '@/features/credentials/api'
import { integrationRouter } from '@/features/integration/api/router'
import { toolRouter } from '@/features/tool/api/tool'
import { toolkitRouter } from '@/features/tool/api/toolkit'
import { agentToolRouter } from '@/features/agent_tool/api/router'
import { conversationRouter } from '@/features/chat/api/conversation'
import { billingRouter } from '@/features/billing/api/router'
import { planRouter } from '@/features/subscription/api/plan'
import { categoryRouter } from '@/features/marketplace/api/category'
import { marketplaceRouter } from '@/features/marketplace/api/marketplace'
import { customPlanRouter } from '@/features/billing/api/custom-plan'
import { promptRouter } from '@/features/prompt/api/router'

import { appRouter } from '@/features/app/api/app'


export const allRouter = router({
  org: orgRouter,
  user: userRouter,
  invitation: invitationRouter,
  apikey: apikeyRouter,
  customPlan: customPlanRouter,
  billing: billingRouter,
  agent: agentRouter,
  prompt: promptRouter,
  voice: voiceRouter,
  plugin: pluginRouter,
  datastore: datastoreRouter,
  datasource: datasourceRouter,
  document: documentRouter,
  credentials: credentialsRouter,
  integration: integrationRouter,
  tool: toolRouter,
  toolkit: toolkitRouter,
  agentTool: agentToolRouter,
  conversation: conversationRouter,
  marketplace: marketplaceRouter,
  category: categoryRouter,
  plan: planRouter,

  connection: connectionRouter,
  app: appRouter,
});

export type AppRouter = typeof allRouter;