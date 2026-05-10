/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@devpilot/types'],
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Enable React strict mode
  strictMode: true,
  // Output as standalone for containerization
  output: 'standalone',
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['pg', 'pg-native'],
  },
  // Images config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
