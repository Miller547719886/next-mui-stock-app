import type { Metadata } from "next";
import ThemeRegistry from '../theme/ThemeRegistry';
import Providers from '../store/providers';
import "./globals.css";

export const metadata: Metadata = {
  title: "股票月营收分析",
  description: "基于FinMind API的台股月营收数据分析工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        {/* 预加载关键CSS */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="preload" href="/_next/static/css/app/globals.css" as="style" />
        
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="//api.finmindtrade.com" />
        
        {/* 预连接到关键第三方域名 */}
        <link rel="preconnect" href="//fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="" />
        
        {/* 预加载关键JavaScript chunks */}
        <link rel="modulepreload" href="/_next/static/chunks/webpack-runtime.js" />
        <link rel="modulepreload" href="/_next/static/chunks/framework.js" />
        <link rel="modulepreload" href="/_next/static/chunks/main.js" />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'system-ui';
              font-display: swap;
              src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
            }
            body { 
              margin: 0; 
              background: white; 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-display: swap;
            }
            .loading-screen {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: white;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .css-loaded .loading-screen {
              display: none;
            }
          `
        }} />
      </head>
      <body>
        <div className="loading-screen"></div>
        <ThemeRegistry>
          <Providers>
            {children}
          </Providers>
        </ThemeRegistry>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                document.body.classList.add('css-loaded');
              }, 100);
            });
          `
        }} />
      </body>
    </html>
  );
}
