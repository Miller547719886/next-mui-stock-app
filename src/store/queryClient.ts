import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query 客户端配置
 * 
 * 对于初学者：
 * TanStack Query 是一个数据获取和缓存库，它帮助管理服务器端状态
 * QueryClient 是 TanStack Query 的核心，负责管理所有查询的缓存、重新获取等行为
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * staleTime: 数据被视为"过时"的时间（毫秒）
       * 在这个时间内，TanStack Query 不会自动重新获取数据
       * 5分钟 = 5 * 60 * 1000ms
       * 适用于股票数据：营收数据不会频繁变化，5分钟内可以使用缓存
       */
      staleTime: 1000 * 60 * 5,
      
      /**
       * gcTime (垃圾回收时间): 未使用的数据在内存中保留的时间
       * 超过这个时间，数据会被从缓存中删除
       * 10分钟 = 10 * 60 * 1000ms
       * 保留时间比 staleTime 长，避免频繁的网络请求
       */
      gcTime: 1000 * 60 * 10,
      
      /**
       * retry: 查询失败时的重试次数
       * 设为1表示失败后只重试1次，避免过多的失败请求
       * 对于股票API，过多重试可能导致API限流
       */
      retry: 1,
      
      /**
       * refetchOnWindowFocus: 当窗口重新获得焦点时是否自动重新获取数据
       * 设为false避免用户切换窗口时产生不必要的网络请求
       * 对于相对静态的营收数据，这个优化很有意义
       */
      refetchOnWindowFocus: false,
    },
  },
});