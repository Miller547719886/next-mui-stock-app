'use client';

import { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSkeleton from './skeletons/TableSkeleton';
import { useStockStore, getDisplayDateRangeByPeriod } from '../store/stockStore';
import { RevenueData } from '../types/common';

interface TableProps {
  revenueData: RevenueData[];
  loading?: boolean;
}

export default function Table({ revenueData, loading = false }: TableProps) {
  const { timeRangePeriod } = useStockStore();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Filter data to display range only
  const displayRange = getDisplayDateRangeByPeriod(timeRangePeriod);
  const filteredRevenueData = revenueData.filter(item => {
    return item.date >= displayRange.startDate && item.date <= displayRange.endDate;
  });

  useEffect(() => {
    if (tableContainerRef.current && filteredRevenueData.length > 0) {
      tableContainerRef.current.scrollLeft = tableContainerRef.current.scrollWidth;
    }
  }, [filteredRevenueData]);

  if (loading) {
    return <TableSkeleton />;
  }

  // Check if there's no data to display
  if (!revenueData || revenueData.length === 0) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6">
            月營收數據表
          </Typography>
        </Box>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height={200}
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

  const calculateYearOverYearGrowth = (currentRevenue: number, currentDate: string) => {
    const current = new Date(currentDate);
    const lastYear = new Date(current.getFullYear() - 1, current.getMonth(), 1);
    const lastYearStr = `${lastYear.getFullYear()}-${String(lastYear.getMonth() + 1).padStart(2, '0')}-01`;
    
    const lastYearData = revenueData.find(item => item.date === lastYearStr);
    if (!lastYearData) return null;
    
    // Handle edge case: when lastYearData.revenue is 0, use 1000 to avoid Infinity
    // This prevents calculation errors and provides reasonable scale for growth rate calculation
    return ((currentRevenue - lastYearData.revenue) / (lastYearData.revenue || 1000) * 100);
  };

  return (
    <Box role="region" aria-labelledby="table-title">
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" id="table-title">
          月營收數據表
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="caption" color="text.secondary">
          註：當月營收為0時，以1000为最小值來計算年增率
        </Typography>
      </Box>
      
      <TableContainer 
        component={Paper} 
        variant="outlined"
        ref={tableContainerRef}
        role="table"
        aria-label="月營收數據詳細表格"
        aria-describedby="table-description"
        sx={{ 
          maxHeight: 200, 
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: 4,
          },
        }}
      >
        {/* 表格描述，供屏幕閱讀器使用 */}
        <Typography 
          id="table-description"
          variant="body2"
          sx={{ 
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden'
          }}
        >
          此表格包含月營收數據和年增率資訊，可水平滾動查看更多數據。第一行為年份月份，第二行為營收金額（千元），第三行為年增率（百分比）。
        </Typography>
        <MuiTable size="small" role="presentation">
          <TableBody>
            {/* Header Row */}
            <TableRow 
              sx={{ backgroundColor: 'grey.100' }}
              role="row"
            >
              <TableCell 
                component="th"
                scope="col"
                sx={{ 
                  minWidth: 120, 
                  position: 'sticky', 
                  left: 0, 
                  backgroundColor: 'grey.100', 
                  zIndex: 2,
                  fontWeight: 'bold',
                  borderRight: '1px solid',
                  borderRightColor: 'divider'
                }}
              >
                年份/月份
              </TableCell>
              {filteredRevenueData.map((item) => (
                <TableCell 
                  key={item.date} 
                  component="th"
                  scope="col"
                  align="center" 
                  sx={{ minWidth: 100, fontWeight: 'bold' }}
                >
                  {item.revenue_year}年{String(item.revenue_month).padStart(2, '0')}月
                </TableCell>
              ))}
            </TableRow>
            
            {/* Data Rows */}
            <TableRow role="row">
              <TableCell 
                component="th"
                scope="row"
                sx={{ 
                  fontWeight: 'bold', 
                  position: 'sticky', 
                  left: 0, 
                  backgroundColor: 'background.paper', 
                  zIndex: 1,
                  borderRight: '1px solid',
                  borderRightColor: 'divider'
                }}
              >
                每月營收(千元)
              </TableCell>
              {filteredRevenueData.map((item) => (
                <TableCell key={item.date} align="center">
                  {formatRevenue(item.revenue)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow role="row">
              <TableCell 
                component="th"
                scope="row"
                sx={{ 
                  fontWeight: 'bold', 
                  position: 'sticky', 
                  left: 0, 
                  backgroundColor: 'background.paper', 
                  zIndex: 1,
                  borderRight: '1px solid',
                  borderRightColor: 'divider'
                }}
              >
                單月營收年增率(%)
              </TableCell>
              {filteredRevenueData.map((item) => {
                const growthRate = calculateYearOverYearGrowth(item.revenue, item.date);
                return (
                  <TableCell 
                    key={item.date} 
                    align="center"
                    sx={{ color: growthRate !== null && growthRate >= 0 ? 'success.main' : growthRate !== null ? 'error.main' : 'text.secondary' }}
                  >
                    {growthRate !== null ? `${growthRate.toFixed(2)}%` : '-'}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  );
}