// https://www.smashingmagazine.com/2022/11/whats-new-nextjs-13/
// 说内嵌了 sass, scss, next-transpile-modules 等

const isProd = process.env.NODE_ENV === 'production'

import { join, dirname } from 'path'
import '@openbot/env/dist/env.mjs'
import { configureRuntimeEnv } from 'next-runtime-env/build/configure.js'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const injectViewerUrlIfVercelPreview = (val) => {
  if (
    (val && typeof val === 'string' && val.length > 0) ||
    process.env.VERCEL_ENV !== 'preview' ||
    !process.env.VERCEL_BUILDER_PROJECT_NAME ||
    !process.env.NEXT_PUBLIC_VERCEL_VIEWER_PROJECT_NAME
  )
    return
  process.env.NEXT_PUBLIC_VIEWER_URL =
    `https://${process.env.VERCEL_BRANCH_URL}`.replace(
      process.env.VERCEL_BUILDER_PROJECT_NAME,
      process.env.NEXT_PUBLIC_VERCEL_VIEWER_PROJECT_NAME
    )
}

injectViewerUrlIfVercelPreview(process.env.NEXT_PUBLIC_VIEWER_URL)

configureRuntimeEnv()

import withNextIntl from 'next-intl/plugin'
const withNextIntlConfig = withNextIntl('./i18n.ts')

console.log(process.version)
console.log('NODE_ENV: ', process.env.NODE_ENV)
console.log('STATIC_URL: ', process.env.STATIC_URL)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/marketplace/agents',
        permanent: true,
      },
      /*{
        source: '/chat/*',
        destination: '/chat',
        permanent: true,
      },*/
    ]
  },
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: join(__dirname, '../../'),
  },
  transpilePackages: [
    '@openbot/lib',
    'models',
    '@openbot/env',
  ],
  env: {
    STATIC_URL: isProd ? process.env.STATIC_URL : '',
  },
  assetPrefix: isProd ? process.env.STATIC_URL : '',
  poweredByHeader: false,
  // webpack5: true,
  /*
  webpack(config) {
    console.log('lalala webpack');
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false 
    };

    return config;
  }
  */
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    config.resolve.alias["~"] = __dirname

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    }); // 针对 SVG 的处理规则

    
    config.experiments = {
      topLevelAwait: true,
      layers: true
    };
    // next-upload 等会引发 fs not found, 所以这里必须加上
    config.resolve.fallback = {
      fs: false,
      process: false,
      buffer: false,
      module: false,
      path: false
    };
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config
  },
};

const plugins = [
  withNextIntlConfig
];

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
