const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = withMDX(nextConfig)
