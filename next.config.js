/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: true
  },
  trailingSlash: true
}

module.exports = nextConfig 