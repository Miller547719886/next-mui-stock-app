'use client';

import { Container, Card, CardContent } from '@mui/material';
import { layoutConfig } from '../store/config';
import { useStockStore } from '../store/stockStore';
import { useMonthlyRevenue } from '../api/hooks';
import Title from './Title';
import Chart from './Chart';
import Table from './Table';
import TimeFilter from './TimeFilter';

export default function Detail() {
  const { selectedStockId, getApiDateRange } = useStockStore();
  const apiDateRange = getApiDateRange();

  const { data: revenueData = [], isLoading: loading } = useMonthlyRevenue(
    selectedStockId || '2330',
    apiDateRange.startDate,
    apiDateRange.endDate
  );

  return (
    <Container maxWidth={layoutConfig.maxWidth} sx={{ pt: layoutConfig.padding.top, pb: layoutConfig.padding.bottom }}>
      <Title loading={loading} />
      
      {/* Time Filter Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TimeFilter />
        </CardContent>
      </Card>
      
      {/* Chart and Table Card */}
      <Card>
        <CardContent>
          <Chart revenueData={revenueData} loading={loading} />
          <Table revenueData={revenueData} loading={loading} />
        </CardContent>
      </Card>
    </Container>
  );
}