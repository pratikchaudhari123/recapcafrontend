/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' to enable production server mode
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // Exclude undici from webpack processing (it's a Node.js native module)
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push('undici')
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        undici: false,
      }
    }
    return config
  },
}

module.exports = nextConfig