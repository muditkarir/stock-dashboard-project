const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

// Validate API key
if (!FINNHUB_API_KEY) {
  throw new Error('FINNHUB_API_KEY environment variable is required');
}

/**
 * Get company news for a stock symbol
 * @param {string} symbol - Stock symbol (e.g., 'TSLA')
 * @param {number} days - Number of days back to fetch news (default: 7)
 * @returns {Promise<Array>} Array of news articles
 */
async function getCompanyNews(symbol, days = 7) {
  try {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);

    const fromDateStr = fromDate.toISOString().split('T')[0];
    const toDateStr = toDate.toISOString().split('T')[0];

    const response = await axios.get(`${BASE_URL}/company-news`, {
      params: {
        symbol: symbol.toUpperCase(),
        from: fromDateStr,
        to: toDateStr,
        token: FINNHUB_API_KEY
      },
      timeout: 10000
    });

    if (!response.data) {
      console.log(`No news data returned for ${symbol}`);
      return [];
    }

    // Filter and format news articles
    const newsArticles = response.data
      .filter(article => article.headline && article.headline.trim().length > 0)
      .slice(0, 10) // Limit to 10 most recent articles
      .map(article => ({
        id: article.id || Date.now() + Math.random(),
        headline: article.headline,
        summary: article.summary || '',
        url: article.url || '',
        datetime: article.datetime ? new Date(article.datetime * 1000) : new Date(),
        source: article.source || 'Unknown',
        image: article.image || null
      }))
      .sort((a, b) => b.datetime - a.datetime); // Sort by most recent first

    console.log(`Fetched ${newsArticles.length} news articles for ${symbol}`);
    return newsArticles;

  } catch (error) {
    console.error('Error fetching news:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}

/**
 * Get formatted date range for news queries
 * @param {number} days - Number of days back
 * @returns {object} Object with from and to date strings
 */
function getDateRange(days = 7) {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);

  return {
    from: fromDate.toISOString().split('T')[0],
    to: toDate.toISOString().split('T')[0]
  };
}

module.exports = {
  getCompanyNews,
  getDateRange
};
