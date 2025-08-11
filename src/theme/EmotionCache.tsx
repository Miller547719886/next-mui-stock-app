'use client';
import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';

export interface NextAppDirEmotionCacheProviderProps {
  /** This is the options passed to createCache() from 'import createCache from "@emotion/cache"' */
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
  /** By default <CacheProvider /> from 'import { CacheProvider } from "@emotion/react"' */
  CacheProvider?: (props: {
    value: EmotionCache;
    children: React.ReactNode;
  }) => React.JSX.Element | null;
  children: React.ReactNode;
}

// 优化的 Emotion 缓存提供者，支持 SSR 和样式注入控制
export default function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps) {
  const { options, CacheProvider: CustomCacheProvider = CacheProvider, children } = props;

  const [{ cache }] = React.useState(() => {
    // 创建插入点元素，确保样式插入顺序
    let insertionPoint: HTMLElement | undefined;
    
    if (typeof document !== 'undefined') {
      // 查找现有的样式插入点或创建新的
      insertionPoint = document.querySelector<HTMLMetaElement>('meta[name="emotion-insertion-point"]') || undefined;
      if (!insertionPoint) {
        insertionPoint = document.createElement('meta');
        insertionPoint.setAttribute('name', 'emotion-insertion-point');
        insertionPoint.setAttribute('content', '');
        document.head.appendChild(insertionPoint);
      }
    }

    const cache = createCache({ 
      ...options,
      insertionPoint,
      // 确保与服务端兼容
      speedy: false,
    });
    
    cache.compat = true;

    // 跟踪插入的样式，便于调试和SSR
    const inserted: string[] = [];
    const prevInsert = cache.insert;
    
    cache.insert = (...args: Parameters<typeof prevInsert>) => {
      const [, serialized] = args;
      
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      
      return prevInsert(...args);
    };

    // 提供flush功能用于SSR清理（预留接口）
    const flush = () => {
      const styles = inserted.splice(0);
      return styles;
    };

    return { cache, flush };
  });

  // 样式加载完成后的回调
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      // 延迟标记样式已加载，确保所有样式都已应用
      const timer = setTimeout(() => {
        document.body.classList.add('mui-styles-loaded');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return <CustomCacheProvider value={cache}>{children}</CustomCacheProvider>;
}

export { NextAppDirEmotionCacheProvider };