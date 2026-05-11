/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@devpilot/types'],
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Output as standalone for containerization
  output: 'standalone',
  // Path alias
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname, '.');
    return config;
  },
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
