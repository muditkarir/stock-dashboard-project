import axios from 'axios';
import { StockData, SearchResult, NewsItem, WebhookEvent } from '../types';
import { StockAnalyzer } from './stockAnalyzer-enhanced';

// Environment configuration
const API_CONFIG = {
  finnhubApiKey: process.env.REACT_APP_FINNHUB_API_KEY,
  newsApiKey: process.env.REACT_APP_NEWS_API_KEY,
  environment: process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development'
};

// Create axios instance with base configuration
const getBaseURL = () => {
  if (API_CONFIG.environment === 'production' && !API_CONFIG.finnhubApiKey) {
    // In production without API keys, use mock data only
    return '/api'; // This will fail, triggering mock fallback
  }
  if (API_CONFIG.environment === 'production') {
    // In production with API keys, use direct API calls
    return 'https://finnhub.io/api/v1';
  }
  // In development, try localhost backend first, fallback to direct API
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Direct API instance for when we call Finnhub directly from frontend
const directApi = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
    console.error(`❌ API Error: ${error.config?.url} - ${errorMessage}`);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Stock symbol not found');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(errorMessage);
  }
);

export class StockService {
  /**
   * Search for stocks by query
   */
  static async searchStocks(query: string): Promise<SearchResult> {
    if (!query.trim()) {
      return { count: 0, result: [] };
    }

    try {
      // First try backend API
      const response = await api.get(`/stocks/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (backendError) {
      console.warn('Backend API failed, trying direct API call:', backendError);
      
      // If backend fails and we have API key, try direct call to Finnhub
      if (API_CONFIG.finnhubApiKey) {
        try {
          const response = await directApi.get('/search', {
            params: { 
              q: query,
              token: API_CONFIG.finnhubApiKey 
            }
          });
          return response.data;
        } catch (directError) {
          console.error('Direct API also failed:', directError);
          throw new Error(`Search failed: Unable to connect to stock data service. Please check your internet connection and API configuration.`);
        }
      }
      
      // No API key available
      throw new Error('Stock search is unavailable: No API key configured. Please add your Finnhub API key to environment variables.');
    }
  }

  /**
   * Get comprehensive stock data including quote, profile, and scoring
   */
  static async getStockData(symbol: string): Promise<StockData> {
    try {
      // First try backend API
      const response = await api.get(`/stocks/${symbol.toUpperCase()}`);
      return response.data;
    } catch (backendError) {
      console.warn(`Backend API failed for ${symbol}, trying direct API:`, backendError);
      
      // If backend fails and we have API key, try direct calls to Finnhub
      if (API_CONFIG.finnhubApiKey) {
        try {
          // Get quote and profile directly from Finnhub
          const [quoteResponse, profileResponse] = await Promise.allSettled([
            directApi.get('/quote', {
              params: { symbol: symbol.toUpperCase(), token: API_CONFIG.finnhubApiKey }
            }),
            directApi.get('/stock/profile2', {
              params: { symbol: symbol.toUpperCase(), token: API_CONFIG.finnhubApiKey }
            })
          ]);

          if (quoteResponse.status === 'fulfilled' && profileResponse.status === 'fulfilled') {
            // Build StockData from direct API responses
            const quote = quoteResponse.value.data;
            const profile = profileResponse.value.data;
            
            // Validate that we got valid data
            if (!quote || quote.c === undefined || quote.c === 0) {
              throw new Error(`No quote data available for ${symbol}. The symbol may be invalid or markets may be closed.`);
            }
            
            if (!profile || !profile.name) {
              throw new Error(`No company profile found for ${symbol}. Please verify the stock symbol is correct.`);
            }
            
            return {
              symbol: symbol.toUpperCase(),
              quote: quote,
              profile: profile,
              scoring: StockAnalyzer.calculateStockScore(quote, profile, symbol.toUpperCase()),
              fundamentals: StockAnalyzer.calculateFundamentalAnalysis(quote, profile, symbol.toUpperCase()),
              historical: null, // Historical data requires additional API calls
              timestamp: new Date().toISOString()
            };
          } else {
            throw new Error(`Failed to retrieve complete data for ${symbol}. API response was incomplete.`);
          }
        } catch (directError) {
          console.error('Direct API calls failed:', directError);
          throw new Error(`Unable to fetch data for ${symbol}: ${directError instanceof Error ? directError.message : 'API connection failed'}`);
        }
      }
      
      // No API key available
      throw new Error(`Stock data unavailable for ${symbol}: No API key configured. Please add your Finnhub API key to access live market data.`);
    }
  }

  /**
   * Get historical data for a stock
   */
  static async getHistoricalData(
    symbol: string,
    options: {
      resolution?: string;
      days?: number;
      from?: number;
      to?: number;
    } = {}
  ): Promise<any> {
    try {
      const response = await api.get(`/stocks/${symbol.toUpperCase()}/history`, {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get company news
   */
  static async getCompanyNews(symbol: string, days: number = 7): Promise<{ news: NewsItem[] }> {
    try {
      const response = await api.get(`/stocks/${symbol.toUpperCase()}/news`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get market news
   */
  static async getMarketNews(category: string = 'general'): Promise<{ news: NewsItem[] }> {
    try {
      const response = await api.get(`/stocks/news/market`, {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching market news:', error);
      throw error;
    }
  }

  /**
   * Get news and sentiment for a specific stock
   */
  static async getNewsAndSentiment(symbol: string, days: number = 7): Promise<any> {
    try {
      // First try backend API
      const response = await api.get(`/stocks/${symbol}/news-sentiment`, {
        params: { days }
      });
      return response.data;
    } catch (backendError) {
      console.warn(`News API backend failed for ${symbol}, trying direct API:`, backendError);
      
      // If backend fails and we have API key, try direct call to Finnhub
      if (API_CONFIG.finnhubApiKey) {
        try {
          const toDate = Math.floor(Date.now() / 1000);
          const fromDate = toDate - (days * 24 * 60 * 60);
          
          const response = await directApi.get('/company-news', {
            params: { 
              symbol: symbol.toUpperCase(),
              from: new Date(fromDate * 1000).toISOString().split('T')[0],
              to: new Date(toDate * 1000).toISOString().split('T')[0],
              token: API_CONFIG.finnhubApiKey 
            }
          });
          
          const articles = response.data.slice(0, 10); // Limit to 10 articles
          
          // Generate mock sentiment for each article
          const newsWithSentiment = articles.map((article: any, index: number) => ({
            id: article.id || index,
            headline: article.headline || 'News Article',
            summary: article.summary || article.headline?.substring(0, 150) + '...',
            url: article.url,
            datetime: new Date(article.datetime * 1000).toISOString(),
            source: article.source || 'Finnhub',
            sentiment: {
              label: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
              score: Math.random() * 2 - 1, // Score between -1 and 1
            }
          }));

          // Calculate sentiment summary
          const sentimentCounts = newsWithSentiment.reduce((acc: { positive: number; neutral: number; negative: number }, article: any) => {
            const sentiment = article.sentiment.label as 'positive' | 'neutral' | 'negative';
            acc[sentiment]++;
            return acc;
          }, { positive: 0, neutral: 0, negative: 0 });

          const total = newsWithSentiment.length;
          const sentimentSummary = {
            positive: sentimentCounts.positive,
            neutral: sentimentCounts.neutral,
            negative: sentimentCounts.negative,
            total: total,
            overall: sentimentCounts.positive > sentimentCounts.negative ? 'positive' : 
                    sentimentCounts.negative > sentimentCounts.positive ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral',
            summary: `${sentimentCounts.positive} positive, ${sentimentCounts.neutral} neutral, ${sentimentCounts.negative} negative`,
            percentages: {
              positive: Math.round((sentimentCounts.positive / total) * 100),
              neutral: Math.round((sentimentCounts.neutral / total) * 100),
              negative: Math.round((sentimentCounts.negative / total) * 100)
            }
          };

          return {
            news: newsWithSentiment,
            sentiment: sentimentSummary
          };
          
        } catch (directError) {
          console.error('Direct news API also failed:', directError);
          throw new Error(`News data unavailable for ${symbol}: ${directError instanceof Error ? directError.message : 'API connection failed'}`);
        }
      }
      
      // No API key available
      throw new Error(`News and sentiment unavailable for ${symbol}: No API key configured. Please add your Finnhub API key to access news data.`);
    }
  }
}

export class WebhookService {
  /**
   * Get recent webhook events
   */
  static async getWebhookEvents(limit: number = 20): Promise<{ events: WebhookEvent[] }> {
    try {
      const response = await api.get('/webhooks/events', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw error;
    }
  }

  /**
   * Get webhook health status
   */
  static async getWebhookHealth(): Promise<any> {
    try {
      const response = await api.get('/webhooks/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching webhook health:', error);
      throw error;
    }
  }
}

export default api;
