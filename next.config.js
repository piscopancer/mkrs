const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
}

module.exports = withMDX(nextConfig)
