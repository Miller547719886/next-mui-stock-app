'use client';

import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useStockStore, TimeRangePeriod } from '../store/stockStore';

export default function TimeFilter() {
  const { timeRangePeriod, dateRange, setTimeRangePeriod, setDateRange } = useStockStore();
  
  const customStartDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
  const customEndDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: TimeRangePeriod | null,
  ) => {
    if (newPeriod !== null) {
      setTimeRangePeriod(newPeriod);
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date && customEndDate) {
      setDateRange({
        startDate: date.toISOString().split('T')[0],
        endDate: dateRange.endDate
      });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date && customStartDate) {
      setDateRange({
        startDate: dateRange.startDate,
        endDate: date.toISOString().split('T')[0]
      });
    }
  };

  return (
    <Box mb={3} role="region" aria-labelledby="time-filter-title">
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" id="time-filter-title">
          時間範圍
        </Typography>
      </Box>
      {/* 隱藏的描述文本供屏幕閱讀器使用 */}
      <Typography 
        id="date-range-description" 
        variant="body2" 
        sx={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        選擇要顯示數據的日期範圍，或使用預設的時間範圍選項
      </Typography>
      <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between" flexWrap="wrap">
        {/* Left side: Date Range Picker */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              時間範圍:
            </Typography>
            <DatePicker
              label="開始日期"
              value={customStartDate}
              onChange={handleStartDateChange}
              format="yyyy-MM-dd"
              slotProps={{
                textField: { 
                  size: 'small', 
                  sx: { width: 170 },
                  'aria-label': '選擇數據開始日期',
                  inputProps: {
                    'aria-describedby': 'date-range-description'
                  }
                }
              }}
            />
            <Typography variant="body2" aria-hidden="true">至</Typography>
            <DatePicker
              label="結束日期"
              value={customEndDate}
              onChange={handleEndDateChange}
              format="yyyy-MM-dd"
              minDate={customStartDate || undefined}
              slotProps={{
                textField: { 
                  size: 'small', 
                  sx: { width: 170 },
                  'aria-label': '選擇數據結束日期',
                  inputProps: {
                    'aria-describedby': 'date-range-description'
                  }
                }
              }}
            />
          </Stack>
        </LocalizationProvider>

        {/* Right side: Time Range Switch */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            時間範圍:
          </Typography>
          <ToggleButtonGroup
            value={timeRangePeriod}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
            aria-label="選擇時間範圍"
          >
            <ToggleButton 
              value="one_year"
              aria-label="顯示近一年的數據"
            >
              近一年
            </ToggleButton>
            <ToggleButton 
              value="three_years"
              aria-label="顯示近三年的數據"
            >
              近三年
            </ToggleButton>
            <ToggleButton 
              value="five_years"
              aria-label="顯示近五年的數據"
            >
              近五年
            </ToggleButton>
            <ToggleButton 
              value="eight_years"
              aria-label="顯示近八年的數據"
            >
              近八年
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
}