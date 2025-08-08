'use client';

import { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';

import { StockInfo } from '../api/finmind';

interface ServerStockProviderProps {
  stockInfo: StockInfo;
  stockList: StockInfo[];
  children: React.ReactNode;
}

// 客户端组件用于初始化store状态
export default function ServerStockProvider({ stockInfo, stockList, children }: ServerStockProviderProps) {
  const { setSelectedStock, setCachedTopStocks } = useStockStore();

  useEffect(() => {
    if (stockInfo) {
      setSelectedStock(stockInfo);
    }
    if (stockList?.length > 0) {
      setCachedTopStocks(stockList.slice(0, 20));
    }
  }, [stockInfo, stockList, setSelectedStock, setCachedTopStocks]);

  return <>{children}</>;
}