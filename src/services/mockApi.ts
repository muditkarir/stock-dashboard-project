import { SearchResult, StockData } from '../types';

// Mock data for when API is not available
export const mockSearchResults: SearchResult = {
  count: 6,
  result: [
    { symbol: 'AAPL', displaySymbol: 'AAPL', description: 'Apple Inc.', type: 'Common Stock' },
    { symbol: 'MSFT', displaySymbol: 'MSFT', description: 'Microsoft Corporation', type: 'Common Stock' },
    { symbol: 'GOOGL', displaySymbol: 'GOOGL', description: 'Alphabet Inc.', type: 'Common Stock' },
    { symbol: 'TSLA', displaySymbol: 'TSLA', description: 'Tesla, Inc.', type: 'Common Stock' },
    { symbol: 'AMZN', displaySymbol: 'AMZN', description: 'Amazon.com, Inc.', type: 'Common Stock' },
    { symbol: 'NVDA', displaySymbol: 'NVDA', description: 'NVIDIA Corporation', type: 'Common Stock' }
  ]
};

export const generateMockStockData = (symbol: string): StockData => {
  const basePrice = Math.random() * 200 + 50; // Random price between 50-250
  const change = (Math.random() - 0.5) * 20; // Random change between -10 to +10
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol: symbol.toUpperCase(),
    quote: {
      c: parseFloat(basePrice.toFixed(2)), // current price
      d: parseFloat(change.toFixed(2)), // change
      dp: parseFloat(changePercent.toFixed(2)), // change percent
      h: parseFloat((basePrice + Math.random() * 10).toFixed(2)), // high
      l: parseFloat((basePrice - Math.random() * 10).toFixed(2)), // low
      o: parseFloat((basePrice + (Math.random() - 0.5) * 5).toFixed(2)), // open
      pc: parseFloat((basePrice - change).toFixed(2)), // previous close
      t: Math.floor(Date.now() / 1000) // timestamp
    },
    profile: {
      country: 'US',
      currency: 'USD',
      exchange: 'NASDAQ',
      ipo: '2020-01-01',
      marketCapitalization: Math.floor(Math.random() * 1000000) + 100000,
      name: `${symbol.toUpperCase()} Corporation`,
      phone: '+1-555-0123',
      shareOutstanding: Math.floor(Math.random() * 10000) + 1000,
      ticker: symbol.toUpperCase(),
      weburl: `https://www.${symbol.toLowerCase()}.com`,
      logo: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`,
      finnhubIndustry: 'Technology'
    },
    fundamentals: {
      keyRatios: {
        peRatio: parseFloat((Math.random() * 30 + 10).toFixed(2)),
        pbRatio: parseFloat((Math.random() * 5 + 1).toFixed(2)),
        roe: parseFloat((Math.random() * 20 + 5).toFixed(2)),
        roa: parseFloat((Math.random() * 15 + 2).toFixed(2)),
        eps: parseFloat((Math.random() * 10 + 1).toFixed(2)),
        bookValue: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        debtToEquity: parseFloat((Math.random() * 2 + 0.1).toFixed(2)),
        currentRatio: parseFloat((Math.random() * 3 + 0.5).toFixed(2)),
        quickRatio: parseFloat((Math.random() * 2 + 0.3).toFixed(2)),
        profitMargin: parseFloat((Math.random() * 25 + 5).toFixed(2)),
        operatingMargin: parseFloat((Math.random() * 30 + 5).toFixed(2)),
        dividendYield: parseFloat((Math.random() * 5).toFixed(2)),
        dividendPerShare: parseFloat((Math.random() * 5).toFixed(2)),
        revenueGrowth: parseFloat((Math.random() * 20 - 5).toFixed(2)),
        epsGrowth: parseFloat((Math.random() * 25 - 5).toFixed(2))
      },
      valuation: { score: Math.floor(Math.random() * 40) + 60, insights: [], ratios: {} },
      profitability: { score: Math.floor(Math.random() * 40) + 60, insights: [], ratios: {} },
      liquidity: { score: Math.floor(Math.random() * 40) + 60, insights: [], ratios: {} },
      leverage: { score: Math.floor(Math.random() * 40) + 60, insights: [], ratios: {} },
      dividend: { score: Math.floor(Math.random() * 40) + 60, insights: [], ratios: {} },
      growth: { score: Math.floor(Math.random() * 40) + 60, insights: [], ratios: {} },
      overall: {
        score: Math.floor(Math.random() * 40) + 60,
        label: { text: 'Good', color: 'green' },
        summary: 'Mock fundamental analysis data'
      }
    },
    scoring: {
      score: Math.floor(Math.random() * 40) + 60,
      label: 'Good',
      color: 'green',
      breakdown: {
        price: Math.floor(Math.random() * 100),
        momentum: Math.floor(Math.random() * 100),
        volatility: Math.floor(Math.random() * 100)
      },
      explanation: 'Mock scoring data for demonstration',
      recommendation: {
        action: 'Hold',
        description: 'Mock recommendation'
      }
    },
    historical: null,
    timestamp: new Date().toISOString()
  };
};