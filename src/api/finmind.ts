import axios from 'axios';

// 使用内部API代理，避免CORS问题
const finmindApi = axios.create({
  baseURL: '/api/finmind',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FinMindParams {
  dataset: 'TaiwanStockInfo' | 'TaiwanStockMonthRevenue';
  data_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface StockInfo {
  stock_id: string;
  stock_name: string;
  industry_category: string;
  type: string;
  date: string;
}

export interface MonthlyRevenue {
  date: string;
  stock_id: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export const finmindService = {
  async getStockInfo(): Promise<StockInfo[]> {
    try {
      const response = await finmindApi.get<ApiResponse<StockInfo[]>>('/stock-info');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch stock info');
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching stock info:', error);
      throw error;
    }
  },

  async getMonthlyRevenue(stockId: string, startDate: string, endDate: string): Promise<MonthlyRevenue[]> {
    try {
      const response = await finmindApi.get<ApiResponse<MonthlyRevenue[]>>('/monthly-revenue', {
        params: {
          data_id: stockId,
          start_date: startDate,
          end_date: endDate
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch monthly revenue');
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }
  }
};