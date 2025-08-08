import type { Metadata } from "next";
import localFont from "next/font/local";
import ThemeRegistry from '../theme/ThemeRegistry';
import Providers from '../store/providers';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
        <link rel="preload" href="/fonts/GeistVF.woff" as="font" type="font/woff" crossOrigin="" />
        <link rel="preload" href="/fonts/GeistMonoVF.woff" as="font" type="font/woff" crossOrigin="" />
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              margin: 0; 
              background: white; 
              font-family: system-ui, sans-serif;
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
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
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
