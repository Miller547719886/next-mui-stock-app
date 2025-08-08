import axios from 'axios';
import { apiConfig } from '../store/config';

const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0wOC0wNyAyMjozMDozNSIsInVzZXJfaWQiOiJFdmFuIiwiaXAiOiIxODguMjUzLjUuMjM5IiwiZXhwIjoxNzU1MTgxODM1fQ.d_0m60ltcnXuypYoQUvEaM5XliOHESijwg8Uz_BgwJo';

const finmindApi = axios.create({
  baseURL: apiConfig.finmindBaseUrl,
  timeout: apiConfig.defaultTimeout,
  headers: {
    'Authorization': API_TOKEN,
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

export const finmindService = {
  async getStockInfo(): Promise<StockInfo[]> {
    const response = await finmindApi.get('/data', {
      params: {
        dataset: apiConfig.datasets.stockInfo
      }
    });
    return response.data.data || [];
  },

  async getMonthlyRevenue(stockId: string, startDate: string, endDate: string): Promise<MonthlyRevenue[]> {
    const response = await finmindApi.get('/data', {
      params: {
        dataset: apiConfig.datasets.monthlyRevenue,
        data_id: stockId,
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data.data || [];
  }
};