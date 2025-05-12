/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    esmExternals: true
  }
}

module.exports = nextConfig 