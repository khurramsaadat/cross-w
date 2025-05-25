/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['cross-w.netlify.app'],
  },
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  productionBrowserSourceMaps: false,
  distDir: 'out',
  trailingSlash: true,
  assetPrefix: '',
}

module.exports = nextConfig 