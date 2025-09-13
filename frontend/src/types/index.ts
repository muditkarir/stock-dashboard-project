// Stock data types
export interface StockQuote {
  c: number;  // Current price
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  dp: number; // Percent change
  d: number;  // Change
  t: number;  // Timestamp
}

export interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface StockScore {
  score: number;
  label: string;
  color: string;
  breakdown: {
    price?: number;
    momentum?: number;
    volatility?: number;
    market?: number;
    trend?: number;
  };
  explanation: string;
  recommendation: {
    action: string;
    description: string;
  };
}

export interface HistoricalData {
  prices: number[];
  timestamps: number[];
  volumes: number[];
  highs: number[];
  lows: number[];
}

export interface StockData {
  symbol: string;
  quote: StockQuote;
  profile: CompanyProfile | null;
  scoring: StockScore;
  fundamentals: FundamentalAnalysis | null;
  historical: HistoricalData | null;
  timestamp: string;
}

// Fundamental Analysis types
export interface FundamentalAnalysis {
  keyRatios: KeyRatios;
  valuation: AnalysisCategory;
  profitability: AnalysisCategory;
  liquidity: AnalysisCategory;
  leverage: AnalysisCategory;
  dividend: AnalysisCategory;
  growth: AnalysisCategory;
  overall: OverallScore;
}

export interface KeyRatios {
  peRatio: number | null;
  pbRatio: number | null;
  roe: number | null;
  roa: number | null;
  eps: number | null;
  bookValue: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  quickRatio: number | null;
  profitMargin: number | null;
  operatingMargin: number | null;
  dividendYield: number | null;
  dividendPerShare: number | null;
  revenueGrowth: number | null;
  epsGrowth: number | null;
}

export interface AnalysisCategory {
  score: number;
  insights: Insight[];
  ratios: Record<string, RatioData>;
}

export interface Insight {
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  text: string;
}

export interface RatioData {
  value: number | null;
  benchmark: number | null;
}

export interface OverallScore {
  score: number;
  label: {
    text: string;
    color: string;
  };
  summary: string;
}

export interface MetricDefinition {
  name: string;
  description: string;
  formula: string;
  goodRange: string;
}

export interface SearchResult {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
}

export interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ChartDataPoint {
  x: number | string;
  y: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
    fill?: boolean;
  }>;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface WebhookEvent {
  id: number;
  timestamp: string;
  type: string;
  dataKeys: string[];
}
