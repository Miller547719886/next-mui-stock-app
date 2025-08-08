'use client';

import { Typography, Card, CardContent } from '@mui/material';
import TitleSkeleton from './skeletons/TitleSkeleton';
import { useStockStore } from '../store/stockStore';

interface TitleProps {
  loading?: boolean;
}

export default function Title({ loading = false }: TitleProps) {
  const { selectedStock } = useStockStore();

  const displayTitle = selectedStock 
    ? `${selectedStock.stock_name}(${selectedStock.stock_id})`
    : '股票名稱(股票代號)';

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ pt: '24px' }}>
        {loading ? (
          <TitleSkeleton />
        ) : (
          <>
            {/* 展示股票名称和股票号码，分两行显示 */}
            <Typography variant="h6" component="h6">
              股票名：{selectedStock ? selectedStock.stock_name : '—'}
            </Typography>
            <Typography variant="subtitle1" component="div" color="text.secondary">
              股票号码：{selectedStock ? selectedStock.stock_id : '—'}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}