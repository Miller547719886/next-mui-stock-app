'use client';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { layoutConfig } from '../store/config';
import { useStockStore } from '../store/stockStore';
import { useMonthlyRevenue } from '../api/hooks';
import { lazy, Suspense } from 'react';
import Title from './Title';
import TimeFilter from './TimeFilter';
import ChartSkeleton from './skeletons/ChartSkeleton';
import TableSkeleton from './skeletons/TableSkeleton';

// 懒加载图表和表格组件
const Chart = lazy(() => import('./Chart'));
const Table = lazy(() => import('./Table'));

export default function Detail() {
  const { selectedStockId, getApiDateRange } = useStockStore();
  const apiDateRange = getApiDateRange();

  const { data: revenueData = [], isLoading: loading } = useMonthlyRevenue(
    selectedStockId || '2330',
    apiDateRange.startDate,
    apiDateRange.endDate
  );

  return (
    <Container 
      component="main"
      role="main"
      maxWidth={layoutConfig.maxWidth} 
      sx={{ pt: layoutConfig.padding.top, pb: layoutConfig.padding.bottom }}
      aria-label="股票數據主要內容"
    >
      <Title loading={loading} />
      
      {/* Time Filter Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TimeFilter />
        </CardContent>
      </Card>
      
      {/* Chart and Table Card */}
      <Card sx={{ minHeight: '831px' }}>
        <CardContent 
          sx={{ 
            minHeight: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          <Suspense fallback={<ChartSkeleton />}>
            <Chart revenueData={revenueData} loading={loading} />
          </Suspense>
          <Suspense fallback={<TableSkeleton />}>
            <Table revenueData={revenueData} loading={loading} />
          </Suspense>
        </CardContent>
      </Card>
    </Container>
  );
}