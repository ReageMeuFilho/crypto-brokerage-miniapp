import { NextResponse } from 'next/server';
import { getMockOrderBook } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();
    const orderbook = getMockOrderBook(symbol);
    return NextResponse.json(orderbook);
  } catch (error) {
    console.error('Error fetching orderbook:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orderbook' },
      { status: 500 }
    );
  }
}

