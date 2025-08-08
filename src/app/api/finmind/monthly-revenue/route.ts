import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0wOC0wNyAyMjozMDozNSIsInVzZXJfaWQiOiJFdmFuIiwiaXAiOiIxODguMjUzLjUuMjM5IiwiZXhwIjoxNzU1MTgxODM1fQ.d_0m60ltcnXuypYoQUvEaM5XliOHESijwg8Uz_BgwJo';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stockId = searchParams.get('data_id');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  // 验证必需参数
  if (!stockId || !startDate || !endDate) {
    return NextResponse.json({
      success: false,
      error: 'Missing required parameters',
      message: 'data_id, start_date, and end_date are required'
    }, {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  try {
    const response = await axios.get('https://api.finmindtrade.com/api/v4/data', {
      params: {
        dataset: 'TaiwanStockMonthRevenue',
        data_id: stockId,
        start_date: startDate,
        end_date: endDate
      },
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    return NextResponse.json({
      success: true,
      data: response.data.data || []
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=180' // 缓存3分钟，月营收数据变化较频繁
      }
    });
  } catch (error) {
    console.error('FinMind Monthly Revenue API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch monthly revenue data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}