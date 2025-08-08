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
    <Box mb={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6">
          時間範圍
        </Typography>
      </Box>
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
                textField: { size: 'small', sx: { width: 160 } }
              }}
            />
            <Typography variant="body2">至</Typography>
            <DatePicker
              label="結束日期"
              value={customEndDate}
              onChange={handleEndDateChange}
              format="yyyy-MM-dd"
              minDate={customStartDate || undefined}
              slotProps={{
                textField: { size: 'small', sx: { width: 160 } }
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
          >
            <ToggleButton value="one_year">近一年</ToggleButton>
            <ToggleButton value="three_years">近三年</ToggleButton>
            <ToggleButton value="five_years">近五年</ToggleButton>
            <ToggleButton value="eight_years">近八年</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
}