/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.codewithseth.co.ke',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5010',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5010',
      },
    ],
  },
}

export default nextConfig
