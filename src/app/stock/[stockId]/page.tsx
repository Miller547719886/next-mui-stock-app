import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Detail from '../../../components/Detail';
import ServerStockProvider from '../../../components/ServerStockProvider';
import ChartSkeleton from '../../../components/skeletons/ChartSkeleton';
import TableSkeleton from '../../../components/skeletons/TableSkeleton';

// 直接调用FinMind API，避免CORS问题
import axios from 'axios';
import { cache } from 'react';

const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0wOC0wNyAyMjozMDozNSIsInVzZXJfaWQiOiJFdmFuIiwiaXAiOiIxODguMjUzLjUuMjM5IiwiZXhwIjoxNzU1MTgxODM1fQ.d_0m60ltcnXuypYoQUvEaM5XliOHESijwg8Uz_BgwJo';

// 获取股票信息 - 使用React cache缓存
const getStockInfo = cache(async () => {
  try {
    const response = await axios.get('https://api.finmindtrade.com/api/v4/data', {
      params: {
        dataset: 'TaiwanStockInfo'
      },
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json',
      },
      timeout: 15000
    });

    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching stock info:', error);
    return [];
  }
});

// 获取股票月营收数据 - 使用React cache缓存
const getMonthlyRevenue = cache(async (stockId: string) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear() - 3, 0, 1);
  const endDate = currentDate;

  try {
    const response = await axios.get('https://api.finmindtrade.com/api/v4/data', {
      params: {
        dataset: 'TaiwanStockMonthRevenue',
        data_id: stockId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      },
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json',
      },
      timeout: 15000
    });

    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    return [];
  }
});

interface Stock {
  stock_id: string;
  stock_name: string;
  industry_category: string;
  type: string;
  date: string;
}

// 生成静态参数 - 为热门股票预生成页面
export async function generateStaticParams() {
  try {
    const stockList = await getStockInfo();
    // 取前20个热门股票预生成
    return stockList.slice(0, 20).map((stock: Stock) => ({
      stockId: stock.stock_id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 页面组件现在是Server Component
export default async function StockPage({ params }: { params: { stockId: string } }) {
  const { stockId } = params;

  try {
    // 并行获取数据
    const [stockList] = await Promise.all([
      getStockInfo(),
      getMonthlyRevenue(stockId) // 预取数据但不直接使用，让组件自己获取以支持实时更新
    ]);

    // 验证股票是否存在
    const currentStock = stockList.find((s: Stock) => s.stock_id === stockId);
    if (!currentStock) {
      notFound();
    }

    return (
      <ServerStockProvider stockInfo={currentStock} stockList={stockList}>
        <Suspense fallback={<div>Loading header...</div>}>
          <Header />
        </Suspense>
        <Suspense fallback={
          <div>
            <ChartSkeleton />
            <TableSkeleton />
          </div>
        }>
          <Detail />
        </Suspense>
      </ServerStockProvider>
    );
  } catch (error) {
    console.error('Error loading stock page:', error);
    notFound();
  }
}

// 页面元数据
export async function generateMetadata({ params }: { params: { stockId: string } }) {
  try {
    const stockList = await getStockInfo();
    const stock = stockList.find((s: Stock) => s.stock_id === params.stockId);
    
    return {
      title: stock ? `${stock.stock_name}(${stock.stock_id}) - 股票月营收分析` : '股票月营收分析',
      description: stock ? `查看${stock.stock_name}的详细月营收数据和分析图表` : '股票月营收数据分析工具',
    };
  } catch {
    return {
      title: '股票月营收分析',
      description: '股票月营收数据分析工具',
    };
  }
}