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
        {/* Emotion 样式插入点 */}
        <meta name="emotion-insertion-point" content="" />
        
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="//api.finmindtrade.com" />
        
        {/* 预连接到关键第三方域名 */}
        <link rel="preconnect" href="//fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="" />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 字体优化 */
            @font-face {
              font-family: 'system-ui';
              font-display: swap;
              src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
            }
            
            /* 基础样式 - 防止FOUC */
            * {
              box-sizing: border-box;
            }
            
            html {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            body { 
              margin: 0; 
              background: #fafafa; 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-display: swap;
              line-height: 1.5;
              color: #212121;
            }
            
            /* MUI 基础重置样式 - 内联关键CSS */
            .MuiCssBaseline-root {
              color-scheme: light;
            }
            
            /* 卡片基础样式 */
            .MuiCard-root {
              background-color: #fff;
              color: rgba(0, 0, 0, 0.87);
              transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
              position: relative;
            }
            
            /* 容器基础样式 */
            .MuiContainer-root {
              width: 100%;
              margin-left: auto;
              box-sizing: border-box;
              margin-right: auto;
              padding-left: 16px;
              padding-right: 16px;
            }
            
            /* 按钮基础样式 */
            .MuiButton-root {
              min-width: 64px;
              padding: 6px 16px;
              border-radius: 4px;
              font-weight: 500;
              line-height: 1.75;
              text-transform: none;
              border: 0;
              cursor: pointer;
              user-select: none;
              vertical-align: middle;
              appearance: none;
              text-decoration: none;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            /* Typography 基础样式 */
            .MuiTypography-h6 {
              font-weight: 500;
              font-size: 1rem;
              line-height: 1.5;
              letter-spacing: 0.0075em;
              margin: 0;
            }
            
            .MuiTypography-subtitle1 {
              font-weight: 400;
              font-size: 1rem;
              line-height: 1.75;
              letter-spacing: 0.00938em;
              margin: 0;
            }
            
            /* 加载屏幕 */
            .loading-screen {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #fafafa;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 1;
              transition: opacity 0.3s ease-out;
            }
            
            .mui-styles-loaded .loading-screen {
              opacity: 0;
              pointer-events: none;
            }
            
            /* 防止样式未加载时的布局偏移 */
            .MuiSkeleton-root {
              display: inline-block;
              height: 1.2em;
              background-color: rgba(0, 0, 0, 0.11);
              border-radius: 4px;
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
            // 优化的样式加载检测
            (function() {
              var styleCheckCount = 0;
              var maxChecks = 50; // 最多检查5秒
              
              function checkStylesLoaded() {
                styleCheckCount++;
                
                // 检查关键 MUI 样式是否已加载
                var testElement = document.createElement('div');
                testElement.className = 'MuiButton-root';
                testElement.style.visibility = 'hidden';
                testElement.style.position = 'absolute';
                document.body.appendChild(testElement);
                
                var computedStyle = window.getComputedStyle(testElement);
                var hasStyles = computedStyle.minWidth === '64px' || 
                               computedStyle.padding.includes('6px') ||
                               styleCheckCount >= maxChecks;
                
                document.body.removeChild(testElement);
                
                if (hasStyles) {
                  document.body.classList.add('mui-styles-loaded');
                  document.body.classList.add('css-loaded'); // 保持兼容性
                } else {
                  setTimeout(checkStylesLoaded, 100);
                }
              }
              
              // 立即开始检查样式
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkStylesLoaded);
              } else {
                checkStylesLoaded();
              }
            })();
          `
        }} />
      </body>
    </html>
  );
}
