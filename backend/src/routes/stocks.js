const express = require('express');
const router = express.Router();
const finnhubService = require('../services/finnhubService');
const stockScoringService = require('../services/stockScoringService');
const fundamentalAnalysisService = require('../services/fundamentalAnalysisService');
const newsService = require('../services/newsService');
const sentimentService = require('../services/sentimentService');

// Search stocks
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 1) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await finnhubService.searchStocks(query.trim());
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get comprehensive stock data
router.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    if (!symbol || symbol.length === 0) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }

    // Get all data in parallel
    const [quote, profile, basicFinancials] = await Promise.all([
      finnhubService.getQuote(symbol),
      finnhubService.getCompanyProfile(symbol).catch(() => null), // Don't fail if profile is unavailable
      finnhubService.getBasicFinancials(symbol).catch(() => null) // Don't fail if financials are unavailable
    ]);

    // Validate quote data
    if (!quote || typeof quote.c !== 'number') {
      return res.status(404).json({ error: 'Stock symbol not found or invalid' });
    }

    // Get historical data for scoring (last 30 days)
    const to = Math.floor(Date.now() / 1000);
    const from = to - (30 * 24 * 60 * 60); // 30 days ago
    
    let historicalData = null;
    try {
      historicalData = await finnhubService.getHistoricalData(symbol, 'D', from, to);
    } catch (error) {
      console.warn(`Historical data unavailable for ${symbol}:`, error.message);
    }

    // Calculate score and analyze fundamentals
    const scoreData = stockScoringService.calculateScore(quote, profile, historicalData);
    const fundamentalAnalysis = fundamentalAnalysisService.analyzeFundamentals(basicFinancials, profile);
    const recommendation = stockScoringService.getRecommendation(scoreData.score);

    // Format response
    const response = {
      symbol,
      quote,
      profile: profile || null,
      scoring: {
        ...scoreData,
        recommendation
      },
      fundamentals: fundamentalAnalysis,
      historical: historicalData && historicalData.s === 'ok' ? {
        prices: historicalData.c,
        timestamps: historicalData.t,
        volumes: historicalData.v,
        highs: historicalData.h,
        lows: historicalData.l
      } : null,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error(`Error fetching data for ${req.params.symbol}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get historical data with custom parameters
router.get('/:symbol/history', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { resolution = 'D', from, to, days = 30 } = req.query;

    let fromTimestamp, toTimestamp;
    
    if (from && to) {
      fromTimestamp = parseInt(from);
      toTimestamp = parseInt(to);
    } else {
      toTimestamp = Math.floor(Date.now() / 1000);
      fromTimestamp = toTimestamp - (parseInt(days) * 24 * 60 * 60);
    }

    const historicalData = await finnhubService.getHistoricalData(symbol, resolution, fromTimestamp, toTimestamp);

    if (historicalData.s !== 'ok') {
      return res.status(404).json({ error: 'Historical data not available for this symbol' });
    }

    res.json({
      symbol,
      resolution,
      from: fromTimestamp,
      to: toTimestamp,
      data: {
        prices: historicalData.c,
        timestamps: historicalData.t,
        volumes: historicalData.v,
        highs: historicalData.h,
        lows: historicalData.l,
        opens: historicalData.o
      }
    });
  } catch (error) {
    console.error(`Error fetching historical data for ${req.params.symbol}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get company news with sentiment analysis
router.get('/:symbol/news-sentiment', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { days = 7 } = req.query;

    console.log(`Fetching news and sentiment for ${symbol}...`);

    // Get news articles
    const newsArticles = await newsService.getCompanyNews(symbol, parseInt(days));
    
    if (!newsArticles || newsArticles.length === 0) {
      return res.json({
        symbol,
        days: parseInt(days),
        news: [],
        sentiment: {
          positive: 0,
          neutral: 0,
          negative: 0,
          total: 0,
          overall: 'neutral',
          summary: 'No recent news available.',
          percentages: { positive: 0, neutral: 0, negative: 0 }
        },
        timestamp: new Date().toISOString()
      });
    }

    // Extract headlines for sentiment analysis
    const headlines = newsArticles.map(article => article.headline);
    console.log(`Analyzing sentiment for ${headlines.length} headlines...`);

    // Analyze sentiment for all headlines
    const sentimentResults = await sentimentService.analyzeMultipleSentiments(headlines);
    
    // Combine news with sentiment
    const newsWithSentiment = newsArticles.map((article, index) => ({
      ...article,
      sentiment: sentimentResults[index] || { label: 'neutral', score: 0.5, error: 'Analysis failed' }
    }));

    // Aggregate sentiment results
    const sentimentSummary = sentimentService.aggregateSentiments(sentimentResults);

    console.log(`Completed sentiment analysis for ${symbol}: ${sentimentSummary.overall}`);

    res.json({
      symbol,
      days: parseInt(days),
      news: newsWithSentiment,
      sentiment: sentimentSummary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Error fetching news and sentiment for ${req.params.symbol}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get company news
router.get('/:symbol/news', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { days = 7 } = req.query;

    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const news = await finnhubService.getCompanyNews(symbol, from, to);

    res.json({
      symbol,
      from,
      to,
      news: news.slice(0, 10) // Limit to 10 most recent articles
    });
  } catch (error) {
    console.error(`Error fetching news for ${req.params.symbol}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get market news
router.get('/news/market', async (req, res) => {
  try {
    const { category = 'general' } = req.query;
    const news = await finnhubService.getMarketNews(category);

    res.json({
      category,
      news: news.slice(0, 15) // Limit to 15 articles
    });
  } catch (error) {
    console.error('Error fetching market news:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed fundamental analysis
router.get('/:symbol/fundamentals', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    if (!symbol || symbol.length === 0) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }

    const [basicFinancials, profile, financials] = await Promise.all([
      finnhubService.getBasicFinancials(symbol),
      finnhubService.getCompanyProfile(symbol).catch(() => null),
      finnhubService.getFinancials(symbol).catch(() => null)
    ]);

    const fundamentalAnalysis = fundamentalAnalysisService.analyzeFundamentals(basicFinancials, profile);

    if (!fundamentalAnalysis) {
      return res.status(404).json({ error: 'Fundamental data not available for this symbol' });
    }

    res.json({
      symbol,
      analysis: fundamentalAnalysis,
      rawData: {
        basicFinancials: basicFinancials?.metric || null,
        financials: financials || null
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error fetching fundamental analysis for ${req.params.symbol}:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
