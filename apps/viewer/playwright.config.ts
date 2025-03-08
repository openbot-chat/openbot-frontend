import { PlaywrightTestConfig } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const localViewerEnvPath = path.join(
  __dirname,
  '../../../apps/viewer/.env.local'
)

if (fs.existsSync(localViewerEnvPath))
  require('dotenv').config({
    path: localViewerEnvPath,
  })

const playwrightBaseConfig: PlaywrightTestConfig = {
  // globalSetup: require.resolve(path.join(__dirname, 'globalSetup')),
  timeout: process.env.CI ? 50 * 1000 : 40 * 1000,
  expect: {
    timeout: process.env.CI ? 10 * 1000 : 5 * 1000,
  },
  retries: process.env.NO_RETRIES ? 0 : 1,
  workers: process.env.CI ? 2 : 3,
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    ['html', { outputFolder: 'src/test/reporters' }],
  ],
  maxFailures: process.env.CI ? 10 : undefined,
  webServer: process.env.CI
    ? {
      command: 'pnpm run start',
      timeout: 60_000,
      reuseExistingServer: true,
    }
    : undefined,
  outputDir: './src/test/results',
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    locale: 'en-US',
    browserName: 'chromium',
    viewport: { width: 1400, height: 1000 },
  },
}

const config: PlaywrightTestConfig = {
  ...playwrightBaseConfig,
  testDir: path.join(__dirname, 'src'),
  webServer: process.env.CI
    ? {
      ...(playwrightBaseConfig.webServer as { command: string }),
      port: 3001,
    }
    : undefined,
  use: {
    ...playwrightBaseConfig.use,
    baseURL: process.env.NEXT_PUBLIC_VIEWER_URL,
  },
}

export default config