'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Detail from '../../../components/Detail';
import { useStockStore } from '../../../store/stockStore';
import { useStockInfo } from '../../../api/hooks';

export default function StockPage() {
  const params = useParams();
  const stockId = params.stockId as string;
  const { setSelectedStock } = useStockStore();
  const { data: stockList = [] } = useStockInfo();

  useEffect(() => {
    if (stockId && stockList.length > 0) {
      const stock = stockList.find(s => s.stock_id === stockId);
      if (stock) {
        setSelectedStock(stock);
      }
    }
  }, [stockId, stockList, setSelectedStock]);

  return (
    <>
      <Header />
      <Detail />
    </>
  );
}