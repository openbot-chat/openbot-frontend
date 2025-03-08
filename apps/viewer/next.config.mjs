import { join, dirname } from 'path'
import '@openbot/env/dist/env.mjs'
import { fileURLToPath } from 'url'
import { configureRuntimeEnv } from 'next-runtime-env/build/configure.js'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

configureRuntimeEnv()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO models 编译出错
  typescript: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  transpilePackages: ['models'],
  output: 'standalone',
  experimental: {
    appDir: true,
    outputFileTracingRoot: join(__dirname, '../../'),
  },
}

export default nextConfig