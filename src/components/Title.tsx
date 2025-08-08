'use client';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TitleSkeleton from './skeletons/TitleSkeleton';
import { useStockStore } from '../store/stockStore';

export default function Title() {
  const { selectedStock, isStockSwitching } = useStockStore();

  return (
    <Card sx={{ mb: 3, minHeight: '100px' }}>
      <CardContent 
        sx={{ 
          pt: '24px',
          minHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {isStockSwitching ? (
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