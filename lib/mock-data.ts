// Mock data generators for the crypto brokerage app

import type {
  Market,
  Quote,
  OrderBook,
  OrderBookEntry,
  Order,
  Position,
  Portfolio,
  HistoryEntry,
  ChartDataPoint,
  NewsItem,
} from './types';

// Base prices for major cryptocurrencies
const BASE_PRICES: Record<string, number> = {
  BTC: 65000,
  ETH: 3200,
  SOL: 145,
  USDC: 1.0,
  USDT: 1.0,
};

// Generate random price movement
function randomChange(base: number, volatility: number = 0.05): number {
  return base * (1 + (Math.random() - 0.5) * volatility);
}

// Generate sparkline data
function generateSparkline(basePrice: number, points: number = 24): number[] {
  const sparkline: number[] = [];
  let price = basePrice * 0.98;
  for (let i = 0; i < points; i++) {
    price = randomChange(price, 0.02);
    sparkline.push(price);
  }
  return sparkline;
}

// Mock markets data
export function getMockMarkets(): Market[] {
  const markets: Market[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: randomChange(BASE_PRICES.BTC, 0.01),
      change24h: 0,
      changePercent24h: 0,
      volume24h: 28500000000,
      marketCap: 1270000000000,
      high24h: 0,
      low24h: 0,
      sparkline: [],
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: randomChange(BASE_PRICES.ETH, 0.01),
      change24h: 0,
      changePercent24h: 0,
      volume24h: 15200000000,
      marketCap: 385000000000,
      high24h: 0,
      low24h: 0,
      sparkline: [],
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: randomChange(BASE_PRICES.SOL, 0.01),
      change24h: 0,
      changePercent24h: 0,
      volume24h: 2100000000,
      marketCap: 65000000000,
      high24h: 0,
      low24h: 0,
      sparkline: [],
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      price: 1.0,
      change24h: 0,
      changePercent24h: 0,
      volume24h: 5800000000,
      marketCap: 34000000000,
      high24h: 1.0,
      low24h: 1.0,
      sparkline: Array(24).fill(1.0),
    },
  ];

  // Calculate derived fields
  markets.forEach((market) => {
    if (market.symbol !== 'USDC') {
      const basePrice = BASE_PRICES[market.symbol];
      market.sparkline = generateSparkline(market.price);
      market.change24h = market.price - basePrice;
      market.changePercent24h = (market.change24h / basePrice) * 100;
      market.high24h = Math.max(...market.sparkline);
      market.low24h = Math.min(...market.sparkline);
    }
  });

  return markets;
}

// Mock quote data
export function getMockQuote(symbol: string): Quote {
  const basePrice = BASE_PRICES[symbol] || 100;
  const price = randomChange(basePrice, 0.001);
  const spread = price * 0.001; // 0.1% spread

  return {
    symbol,
    price,
    bid: price - spread / 2,
    ask: price + spread / 2,
    spread,
    timestamp: Date.now(),
  };
}

// Mock order book data
export function getMockOrderBook(symbol: string): OrderBook {
  const quote = getMockQuote(symbol);
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];

  // Generate 20 levels of bids
  for (let i = 0; i < 20; i++) {
    const price = quote.bid - i * (quote.price * 0.0005);
    const amount = Math.random() * 5 + 0.1;
    bids.push({
      price,
      amount,
      total: price * amount,
    });
  }

  // Generate 20 levels of asks
  for (let i = 0; i < 20; i++) {
    const price = quote.ask + i * (quote.price * 0.0005);
    const amount = Math.random() * 5 + 0.1;
    asks.push({
      price,
      amount,
      total: price * amount,
    });
  }

  return {
    symbol,
    bids,
    asks,
    timestamp: Date.now(),
  };
}

// Mock orders data
export function getMockOrders(): Order[] {
  return [
    {
      id: '1',
      symbol: 'BTC',
      type: 'limit',
      side: 'buy',
      amount: 0.05,
      price: 64500,
      status: 'pending',
      filledAmount: 0,
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 3600000,
    },
    {
      id: '2',
      symbol: 'ETH',
      type: 'market',
      side: 'buy',
      amount: 1.5,
      status: 'filled',
      filledAmount: 1.5,
      filledPrice: 3180,
      createdAt: Date.now() - 7200000,
      updatedAt: Date.now() - 7200000,
    },
  ];
}

// Mock positions data
export function getMockPositions(): Position[] {
  const markets = getMockMarkets();
  
  return [
    {
      symbol: 'BTC',
      amount: 0.5,
      averagePrice: 62000,
      currentPrice: markets[0].price,
      value: 0.5 * markets[0].price,
      costBasis: 31000,
      unrealizedPnL: 0.5 * (markets[0].price - 62000),
      unrealizedPnLPercent: ((markets[0].price - 62000) / 62000) * 100,
      allocation: 0,
    },
    {
      symbol: 'ETH',
      amount: 5,
      averagePrice: 3000,
      currentPrice: markets[1].price,
      value: 5 * markets[1].price,
      costBasis: 15000,
      unrealizedPnL: 5 * (markets[1].price - 3000),
      unrealizedPnLPercent: ((markets[1].price - 3000) / 3000) * 100,
      allocation: 0,
    },
    {
      symbol: 'SOL',
      amount: 50,
      averagePrice: 140,
      currentPrice: markets[2].price,
      value: 50 * markets[2].price,
      costBasis: 7000,
      unrealizedPnL: 50 * (markets[2].price - 140),
      unrealizedPnLPercent: ((markets[2].price - 140) / 140) * 100,
      allocation: 0,
    },
  ];
}

// Mock portfolio data
export function getMockPortfolio(): Portfolio {
  const positions = getMockPositions();
  const totalInvested = positions.reduce((sum, pos) => sum + pos.value, 0);
  const totalCost = positions.reduce((sum, pos) => sum + pos.costBasis, 0);
  const totalPnL = totalInvested - totalCost;
  const cashBalance = 10000;

  // Calculate allocations
  positions.forEach((pos) => {
    pos.allocation = (pos.value / totalInvested) * 100;
  });

  return {
    totalValue: totalInvested + cashBalance,
    cashBalance,
    investedValue: totalInvested,
    totalPnL,
    totalPnLPercent: (totalPnL / totalCost) * 100,
    dayPnL: totalPnL * 0.1, // Mock: 10% of total PnL happened today
    dayPnLPercent: ((totalPnL * 0.1) / totalCost) * 100,
  };
}

// Mock history data
export function getMockHistory(): HistoryEntry[] {
  return [
    {
      id: '1',
      type: 'trade',
      symbol: 'BTC',
      amount: 0.5,
      price: 62000,
      total: 31000,
      status: 'completed',
      timestamp: Date.now() - 86400000 * 7,
    },
    {
      id: '2',
      type: 'trade',
      symbol: 'ETH',
      amount: 5,
      price: 3000,
      total: 15000,
      status: 'completed',
      timestamp: Date.now() - 86400000 * 14,
    },
    {
      id: '3',
      type: 'deposit',
      amount: 50000,
      total: 50000,
      status: 'completed',
      timestamp: Date.now() - 86400000 * 30,
    },
    {
      id: '4',
      type: 'trade',
      symbol: 'SOL',
      amount: 50,
      price: 140,
      total: 7000,
      status: 'completed',
      timestamp: Date.now() - 86400000 * 21,
    },
  ];
}

// Mock chart data
export function getMockChartData(
  symbol: string,
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1h',
  points: number = 100
): ChartDataPoint[] {
  const basePrice = BASE_PRICES[symbol] || 100;
  const data: ChartDataPoint[] = [];
  let price = basePrice * 0.95;

  const now = Date.now();
  const intervalMs: Record<string, number> = {
    '1m': 60000,
    '5m': 300000,
    '15m': 900000,
    '1h': 3600000,
    '4h': 14400000,
    '1d': 86400000,
  };

  const ms = intervalMs[interval];

  for (let i = 0; i < points; i++) {
    const open = price;
    const high = randomChange(price, 0.01);
    const low = randomChange(price, 0.01);
    const close = randomChange(price, 0.01);
    const volume = Math.random() * 1000000 + 100000;

    data.push({
      timestamp: now - (points - i) * ms,
      open,
      high: Math.max(open, high, low, close),
      low: Math.min(open, high, low, close),
      close,
      volume,
    });

    price = close;
  }

  return data;
}

// Mock news data
export function getMockNews(symbol?: string): NewsItem[] {
  const allNews: NewsItem[] = [
    {
      id: '1',
      title: 'Bitcoin Reaches New All-Time High',
      summary: 'Bitcoin surpasses previous records as institutional adoption continues to grow.',
      source: 'CryptoNews',
      url: '#',
      publishedAt: Date.now() - 3600000,
      sentiment: 'positive',
    },
    {
      id: '2',
      title: 'Ethereum Network Upgrade Successful',
      summary: 'Latest Ethereum upgrade improves scalability and reduces gas fees.',
      source: 'BlockchainDaily',
      url: '#',
      publishedAt: Date.now() - 7200000,
      sentiment: 'positive',
    },
    {
      id: '3',
      title: 'Solana DeFi Ecosystem Expands',
      summary: 'New DeFi protocols launch on Solana, attracting more users and liquidity.',
      source: 'DeFi Times',
      url: '#',
      publishedAt: Date.now() - 10800000,
      sentiment: 'positive',
    },
    {
      id: '4',
      title: 'Regulatory Clarity Improves Market Sentiment',
      summary: 'New regulatory framework provides clarity for crypto businesses.',
      source: 'Financial News',
      url: '#',
      publishedAt: Date.now() - 14400000,
      sentiment: 'positive',
    },
  ];

  if (symbol) {
    return allNews.filter((news) => news.title.toLowerCase().includes(symbol.toLowerCase()));
  }

  return allNews;
}

