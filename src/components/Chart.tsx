'use client';

import { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import ChartSkeleton from './skeletons/ChartSkeleton';
import { useStockStore, getDisplayDateRangeByPeriod } from '../store/stockStore';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RevenueData {
  date: string;
  stock_id?: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

interface ChartProps {
  revenueData: RevenueData[];
  loading: boolean;
}

export default function Chart({ revenueData, loading }: ChartProps) {
  const { timeRangePeriod } = useStockStore();
  const [visibleSeries, setVisibleSeries] = useState({
    revenue: true,
    growthRate: true
  });

  const handleLegendClick = (dataKey: 'revenue' | 'growthRate') => {
    setVisibleSeries(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  if (loading) {
    return <ChartSkeleton />;
  }

  // Check if there's no data to display
  if (!revenueData || revenueData.length === 0) {
    return (
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6">
            數據圖表
          </Typography>
        </Box>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height={400}
          sx={{ 
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'grey.50'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            暫無數據
          </Typography>
        </Box>
      </Box>
    );
  }

  const formatRevenue = (value: number) => {
    const thousands = (value / 1000).toFixed(0);
    return Number(thousands).toLocaleString();
  };

  const formatXAxisLabel = (item: RevenueData) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    return `${year}年${String(month).padStart(2, '0')}月`;
  };

  // Filter data to display range only
  const displayRange = getDisplayDateRangeByPeriod(timeRangePeriod);
  const filteredRevenueData = revenueData.filter(item => {
    return item.date >= displayRange.startDate && item.date <= displayRange.endDate;
  });

  const chartData = filteredRevenueData.map((item) => {
    // Calculate year-over-year growth rate
    const currentDate = new Date(item.date);
    const lastYearDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
    const lastYearItem = revenueData.find(d => {
      const date = new Date(d.date);
      return date.getFullYear() === lastYearDate.getFullYear() && 
             date.getMonth() === lastYearDate.getMonth();
    });
    // Handle edge case: when lastYearItem.revenue is 0, use 1000 to avoid Infinity
    // This prevents chart rendering issues and provides reasonable scale for growth rate calculation
    const growthRate = lastYearItem 
      ? ((item.revenue - lastYearItem.revenue) / (lastYearItem.revenue || 1000) * 100)
      : 0;
    return {
      month: formatXAxisLabel(item),
      revenue: item.revenue / 1000, // Convert to thousands
      growthRate: Number(growthRate.toFixed(2)),
      displayRevenue: formatRevenue(item.revenue),
      displayGrowthRate: `${growthRate.toFixed(2)}%`
    };
  });

  // Calculate Y-axis domains for proper scaling
  const revenueValues = chartData.map(d => d.revenue);
  const growthRateValues = chartData.map(d => d.growthRate);
  
  let revenueDomain: [number, number] = [0, 100];
  let growthDomain: [number, number] = [-10, 10];
  
  if (revenueValues.length > 0) {
    const revenueMin = Math.min(...revenueValues);
    const revenueMax = Math.max(...revenueValues);
    const revenuePadding = Math.max((revenueMax - revenueMin) * 0.1, revenueMax * 0.05);
    
    revenueDomain = [
      Math.max(0, revenueMin - revenuePadding),
      revenueMax + revenuePadding
    ];
  }
  
  if (growthRateValues.length > 0) {
    const growthMin = Math.min(...growthRateValues);
    const growthMax = Math.max(...growthRateValues);
    const growthPadding = Math.max((growthMax - growthMin) * 0.1, 5);
    
    growthDomain = [
      growthMin - growthPadding,
      growthMax + growthPadding
    ];
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6">
          數據圖表
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="caption" color="text.secondary">
          註：當月營收為0時，以1000为最小值來計算年增率
        </Typography>
      </Box>
      
      <Box>
        {/* Y轴单位显示在顶部 */}
        <Box display="flex" justifyContent="space-between" mb={1} px={10}>
          <Typography variant="caption" color="text.secondary">
            營收 (千元)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            年增率 (%)
          </Typography>
        </Box>
        
        {/* Combined Chart */}
        <Box mb={0}>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart 
              data={chartData}
              margin={{ top: 20, right: 50, left: 80, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              
              {/* Left Y-axis for revenue */}
              <YAxis 
                yAxisId="revenue"
                orientation="left"
                tick={{ fontSize: 12 }}
                width={60}
                domain={revenueDomain}
                tickFormatter={(value) => Number(value).toLocaleString()}
              />
              
              {/* Right Y-axis for growth rate */}
              <YAxis 
                yAxisId="growth"
                orientation="right"
                tick={{ fontSize: 12 }}
                width={40}
                domain={growthDomain}
                tickFormatter={(value) => `${Number(value).toFixed(2)}%`}
              />
              
              <Tooltip 
                formatter={(value, name) => {
                  if (name === '月營收') return [`${Number(value).toLocaleString()}（千元）`, name];
                  if (name === '年增率') return [`${value}%`, name];
                  return [value, name];
                }}
              />
              
              {visibleSeries.revenue && (
                <Bar 
                  yAxisId="revenue"
                  dataKey="revenue" 
                  fill="#ff9800" 
                  name="月營收"
                  fillOpacity={0.8}
                />
              )}
              
              {visibleSeries.growthRate && (
                <Line 
                  yAxisId="growth"
                  type="monotone" 
                  dataKey="growthRate" 
                  stroke="#f44336" 
                  strokeWidth={3}
                  name="年增率"
                  dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
        
        {/* 自定义Legend */}
        <Box display="flex" justifyContent="center" mt={0}>
          <Stack direction="row" spacing={2}>
            {/* 
              自定义 Legend 按钮，左侧为圆点，右侧为文字，颜色与当前配置保持一致
              参考：https://mui.com/material-ui/react-button/ 及 https://mui.com/material-ui/react-box/
            */}
            <Button
              size="small"
              onClick={() => handleLegendClick('revenue')}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              {/* 左侧圆点 */}
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: visibleSeries.revenue ? '#ff9800' : '#9e9e9e',
                  mr: 1.2,
                  border: visibleSeries.revenue ? '2px solid white' : '2px solid #9e9e9e',
                  transition: 'all 0.2s'
                }}
              />
              {/* 右侧文字 */}
              <Typography variant="body2" sx={{ color: visibleSeries.revenue ? '#ff9800' : '#9e9e9e', transition: 'color 0.2s' }}>
                每月營收
              </Typography>
            </Button>
            {/* 
              参考“每月營收”按钮，采用自定义圆点和文字分离的方式，颜色与 growthRate 曲线一致
              参考：https://mui.com/material-ui/react-button/ 及 https://mui.com/material-ui/react-box/
            */}
            <Button
              size="small"
              onClick={() => handleLegendClick('growthRate')}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              {/* 左侧圆点 */}
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: visibleSeries.growthRate ? '#f44336' : '#9e9e9e',
                  mr: 1.2,
                  border: visibleSeries.growthRate ? '2px solid white' : '2px solid #9e9e9e',
                  transition: 'all 0.2s'
                }}
              />
              {/* 右侧文字 */}
              <Typography variant="body2" sx={{ color: visibleSeries.growthRate ? '#f44336' : '#9e9e9e', transition: 'color 0.2s' }}>
                月增率
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}