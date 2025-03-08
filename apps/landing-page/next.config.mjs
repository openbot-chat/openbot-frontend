/* eslint-disable @typescript-eslint/no-var-requires */
import { configureRuntimeEnv } from 'next-runtime-env/build/configure.js'
import bundleAnalyzer from '@next/bundle-analyzer'

configureRuntimeEnv()

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const pages = ['pricing', 'privacy-policies', 'terms-of-service', 'about']

const nextConfig = withBundleAnalyzer({
  transpilePackages: ['utils', 'models'],
  async redirects() {
    return [
      {
        source: '/openbot-lib',
        destination:
          'https://unpkg.com/openbot-js@2.0.21/dist/index.umd.min.js',
        permanent: true,
      },
      {
        source: '/openbot-lib/v2',
        destination: 'https://unpkg.com/openbot-js@2.1.3/dist/index.umd.min.js',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/_next/static/:static*',
          destination:
            process.env.NEXT_PUBLIC_VIEWER_URL + '/_next/static/:static*',
          has: [
            {
              type: 'header',
              key: 'referer',
              value:
                process.env.LANDING_PAGE_HOST +
                '/(?!' +
                pages.join('|') +
                '|\\?).+',
            },
          ],
        },
      ],
      fallback: [
        {
          source: '/:agentId*',
          destination: process.env.NEXT_PUBLIC_VIEWER_URL + '/:agentId*',
        },
        {
          source: '/api/:path*',
          destination: process.env.NEXT_PUBLIC_VIEWER_URL + '/api/:path*',
        },
      ],
    }
  },
})

const plugins = [
];

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);