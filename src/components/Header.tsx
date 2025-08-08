'use client';

import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { layoutConfig } from '../store/config';
import { useStockStore } from '../store/stockStore';
import { useStockInfo } from '../api/hooks';

export default function Header() {
  const router = useRouter();
  const { selectedStock, cachedTopStocks, setCachedTopStocks } = useStockStore();
  const { data: stockList = [], isLoading } = useStockInfo();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedFilter = useMemo(
    () => debounce((input: string) => {
      setInputValue(input);
    }, 300),
    []
  );

  // 缓存前十条数据
  const topTenStocks = useMemo(() => {
    const top10 = stockList.slice(0, 20);
    if (top10.length > 0 && cachedTopStocks.length === 0) {
      setCachedTopStocks(top10);
    }
    return top10;
  }, [stockList, cachedTopStocks.length, setCachedTopStocks]);

  const filteredOptions = useMemo(() => {
    // 如果处于focus状态且没有输入内容，显示缓存的前十条
    if (isFocused && !inputValue) {
      return cachedTopStocks.length > 0 ? cachedTopStocks : topTenStocks;
    }
    
    // 如果没有输入内容，返回前十条
    if (!inputValue) return topTenStocks;
    
    // 有输入内容时进行搜索过滤
    return stockList
      .filter(option => 
        option.stock_id.includes(inputValue) || 
        option.stock_name.includes(inputValue)
      )
      .slice(0, 20);
  }, [stockList, inputValue, isFocused, cachedTopStocks, topTenStocks]);

  return (
    <Box 
      position="fixed" 
      top={0} 
      left={0} 
      right={0} 
      bgcolor="background.paper" 
      borderBottom={1} 
      borderColor="divider"
      p={2}
      zIndex={1000}
    >
      <Container maxWidth={layoutConfig.maxWidth}>
        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
          <Autocomplete
            options={filteredOptions}
            getOptionLabel={(option) => `${option.stock_name}(${option.stock_id})`}
            value={selectedStock}
            onChange={(event, newValue) => {
              if (newValue) {
                router.push(`/stock/${newValue.stock_id}`);
              }
            }}
            loading={isLoading}
            onInputChange={(event, value) => {
              debouncedFilter(value);
            }}
            filterOptions={(options) => options}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="輸入台/美股代號，查看公司價值"
                variant="outlined"
                onFocus={() => {
                  setIsFocused(true);
                  setInputValue('');
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: params.InputProps.endAdornment
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Box fontWeight="bold">
                    {option.stock_name}({option.stock_id})
                  </Box>
                  <Box color="text.secondary" fontSize="0.875rem">
                    {option.industry_category}
                  </Box>
                </Box>
              </li>
            )}
            sx={{ 
              width: '100%', 
              maxWidth: 400,
              minWidth: 300
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}