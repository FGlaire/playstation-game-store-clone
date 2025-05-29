/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.api.playstation.com',
        port: '',
        pathname: '/vulcan/img/**',
      },
      {
        protocol: 'https',
        hostname: 'image.api.playstation.com',
        port: '',
        pathname: '/vulcan/ap/rnd/**',
      },
    ],
  },
}

module.exports = nextConfig 