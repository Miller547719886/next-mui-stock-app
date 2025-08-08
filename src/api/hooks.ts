import { useQuery } from '@tanstack/react-query';
import { finmindService, StockInfo, MonthlyRevenue } from './finmind';

export function useStockInfo() {
  return useQuery<StockInfo[]>({
    queryKey: ['stockInfo'],
    queryFn: finmindService.getStockInfo,
    staleTime: 1000 * 60 * 60,
  });
}

export function useMonthlyRevenue(stockId: string, startDate: string, endDate: string) {
  return useQuery<MonthlyRevenue[]>({
    queryKey: ['monthlyRevenue', stockId, startDate, endDate],
    queryFn: () => finmindService.getMonthlyRevenue(stockId, startDate, endDate),
    enabled: !!stockId && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 30,
  });
}