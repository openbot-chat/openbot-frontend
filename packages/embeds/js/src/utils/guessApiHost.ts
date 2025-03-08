import { env } from '@openbot/env'

import { getRuntimeVariable } from '@openbot/env/getRuntimeVariable'

const cloudViewerUrl = 'https://api.openbot.chat/web/v1'

export const guessApiHost = () =>
  getRuntimeVariable('NEXT_PUBLIC_OPENBOT_WEB_API_BASE_URL')?.split(',')[0] ??
  cloudViewerUrl