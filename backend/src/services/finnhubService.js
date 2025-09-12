const axios = require('axios');

class FinnhubService {
  constructor() {
    this.apiKey = process.env.FINNHUB_API_KEY;
    this.baseURL = 'https://finnhub.io/api/v1';
    
    if (!this.apiKey) {
      throw new Error('FINNHUB_API_KEY is required');
    }
  }

  // Get current stock quote
  async getQuote(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/quote`, {
        params: {
          symbol: symbol.toUpperCase(),
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }

  // Get company profile
  async getCompanyProfile(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/profile2`, {
        params: {
          symbol: symbol.toUpperCase(),
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching company profile for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch company profile for ${symbol}`);
    }
  }

  // Get historical data (candles)
  async getHistoricalData(symbol, resolution = 'D', from, to) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/candle`, {
        params: {
          symbol: symbol.toUpperCase(),
          resolution,
          from,
          to,
          token: this.apiKey
        },
        timeout: 15000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  }

  // Search for stocks
  async searchStocks(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          q: query,
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error searching stocks for ${query}:`, error.message);
      throw new Error(`Failed to search stocks for ${query}`);
    }
  }

  // Get market news
  async getMarketNews(category = 'general') {
    try {
      const response = await axios.get(`${this.baseURL}/news`, {
        params: {
          category,
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching market news:`, error.message);
      throw new Error('Failed to fetch market news');
    }
  }

  // Get company news
  async getCompanyNews(symbol, from, to) {
    try {
      const response = await axios.get(`${this.baseURL}/company-news`, {
        params: {
          symbol: symbol.toUpperCase(),
          from,
          to,
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching company news for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch company news for ${symbol}`);
    }
  }

  // Get company basic financials (key metrics)
  async getBasicFinancials(symbol, metric = 'all') {
    try {
      const response = await axios.get(`${this.baseURL}/stock/metric`, {
        params: {
          symbol: symbol.toUpperCase(),
          metric,
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching basic financials for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch basic financials for ${symbol}`);
    }
  }

  // Get company financials (income statement, balance sheet, cash flow)
  async getFinancials(symbol, statement = 'ic', freq = 'annual') {
    try {
      const response = await axios.get(`${this.baseURL}/stock/financials`, {
        params: {
          symbol: symbol.toUpperCase(),
          statement, // 'ic' for income statement, 'bs' for balance sheet, 'cf' for cash flow
          freq, // 'annual' or 'quarterly'
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching financials for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch financials for ${symbol}`);
    }
  }

  // Get insider trading data
  async getInsiderTrading(symbol, from, to) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/insider-transactions`, {
        params: {
          symbol: symbol.toUpperCase(),
          from,
          to,
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching insider trading for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch insider trading for ${symbol}`);
    }
  }

  // Get recommendation trends
  async getRecommendationTrends(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/recommendation`, {
        params: {
          symbol: symbol.toUpperCase(),
          token: this.apiKey
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching recommendation trends for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch recommendation trends for ${symbol}`);
    }
  }
}

module.exports = new FinnhubService();
