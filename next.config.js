const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['geist'],
  experimental: {
    typedRoutes: true,
    staleTimes: {
      dynamic: 60 * 60,
      static: 60 * 120,
    },
  },
  logging: { fetches: { fullUrl: true } },
  reactStrictMode: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        type: 'asset/source',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    )
    return config
  },
}

module.exports = withMDX(nextConfig)
