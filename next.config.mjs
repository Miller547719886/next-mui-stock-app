import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
// 开发环境: 使用 Next.js 内置 dev server，默认由 Turbopack 驱动热更新与打包（next dev）。
// 本项目未集成 Vite。需要时可用 next dev --webpack 退回 Webpack。

// 生产环境: 使用 Webpack 进行打包（next build），由 SWC 负责转译与最小化，next start 运行。
// Vercel 上同样使用 Next 的生产构建流程。
const nextConfig = {
  experimental: {
    // optimizePackageImports 用于按需优化指定包的导入，减少打包体积，提高构建效率
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts', 'lodash'],
    // serverComponentsExternalPackages 用于指定服务端组件可以直接从 node_modules 加载的外部包，提升并发和性能
    serverComponentsExternalPackages: ['@emotion/server'],
  },
  compiler: {
    // removeConsole 在生产环境下移除 console 相关代码，减少日志泄漏和包体积
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // output: 'standalone' 让 Next.js 生成独立可部署的产物，便于在 Docker 等环境中部署
  output: 'standalone',
  // poweredByHeader: false 关闭 X-Powered-By 响应头，提升安全性
  poweredByHeader: false,
  // generateEtags: false 关闭 ETag 生成，避免缓存相关问题
  generateEtags: false,
  /**
   * modularizeImports 配置 lodash 按需引入，减少打包体积
   * 
   * 举例说明：
   * 假设你在代码中这样写：
   *   import { debounce, uniq } from 'lodash';
   * 
   * 经过 modularizeImports 配置后，Next.js 会自动将其转化为：
   *   import debounce from 'lodash/debounce';
   *   import uniq from 'lodash/uniq';
   * 
   * 这样只会打包实际用到的 lodash 方法，极大减少最终产物体积。
   * 适用于 lodash 5.x 及以上版本的 ESM 包结构。
   * 参考文档：https://nextjs.org/docs/app/building-your-application/configuring/modularize-imports
   */
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  // headers 用于自定义 HTTP 响应头，提升安全性和缓存效率
  headers: async () => {
    return [
      {
        // 全站禁止 iframe 嵌入，防止点击劫持
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
        ],
      },
      {
        // /static 路径下的资源设置强缓存，提升静态资源加载速度
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // /_next/static 路径下的 Next.js 产物设置强缓存
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
