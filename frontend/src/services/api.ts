import axios from 'axios';
import { StockData, SearchResult, NewsItem, WebhookEvent } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
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
    try {
      const response = await api.get(`/stocks/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive stock data including quote, profile, and scoring
   */
  static async getStockData(symbol: string): Promise<StockData> {
    try {
      const response = await api.get(`/stocks/${symbol.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      throw error;
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
