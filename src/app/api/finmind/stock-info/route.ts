import { NextResponse } from 'next/server';
import axios from 'axios';

const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0wOC0wNyAyMjozMDozNSIsInVzZXJfaWQiOiJFdmFuIiwiaXAiOiIxODguMjUzLjUuMjM5IiwiZXhwIjoxNzU1MTgxODM1fQ.d_0m60ltcnXuypYoQUvEaM5XliOHESijwg8Uz_BgwJo';

export async function GET() {
  try {
    const response = await axios.get('https://api.finmindtrade.com/api/v4/data', {
      params: {
        dataset: 'TaiwanStockInfo'
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
        'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=7200' // 30分钟缓存
      }
    });
  } catch (error) {
    console.error('FinMind API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stock info',
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