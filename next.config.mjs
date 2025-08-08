import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts', 'lodash'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 优化生产构建
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  // 优化静态资源缓存
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
