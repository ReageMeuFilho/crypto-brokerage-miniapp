import { NextResponse } from 'next/server';
import { getMockMarkets } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();
    const markets = getMockMarkets();
    const market = markets.find(m => m.symbol === symbol);
    
    if (!market) {
      return NextResponse.json(
        { error: 'Symbol not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(market);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}

