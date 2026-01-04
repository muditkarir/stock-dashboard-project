const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.1-8b-instruct:free'; // Free model

/**
 * Analyze sentiment of a text using OpenRouter (Llama 3.1 free model)
 * @param {string} text - Text to analyze
 * @returns {Promise<object>} Sentiment analysis result
 */
async function analyzeSentiment(text) {
  try {
    if (!text || text.trim().length === 0) {
      return { label: 'neutral', score: 0.5, error: 'Empty text' };
    }

    if (!OPENROUTER_API_KEY) {
      console.warn('OPENROUTER_API_KEY not configured, defaulting to neutral sentiment');
      return { label: 'neutral', score: 0.5, error: 'API key not configured' };
    }

    const response = await axios.post(OPENROUTER_API_URL, {
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: `Analyze the sentiment of this financial news headline. Respond with ONLY ONE WORD: positive, negative, or neutral.\n\nHeadline: "${text}"`
        }
      ],
      max_tokens: 10,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://stock-dashboard.vercel.app',
        'X-Title': 'Stock Dashboard'
      },
      timeout: 15000
    });

    const sentiment = response.data.choices[0]?.message?.content?.trim().toLowerCase();
    
    // Map response to sentiment
    let label = 'neutral';
    let score = 0.5;
    
    if (sentiment?.includes('positive')) {
      label = 'positive';
      score = 0.8;
    } else if (sentiment?.includes('negative')) {
      label = 'negative';
      score = 0.2;
    }

    return { label, score };

  } catch (error) {
    console.error('Sentiment analysis error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
      
      if (error.response.status === 429) {
        return { label: 'neutral', score: 0.5, error: 'Rate limit exceeded' };
      }
    }
    
    return { label: 'neutral', score: 0.5, error: error.message };
  }
}

/**
 * Analyze sentiment for multiple headlines
 * @param {Array<string>} headlines - Array of headlines to analyze
 * @returns {Promise<Array>} Array of sentiment results
 */
async function analyzeMultipleSentiments(headlines) {
  if (!headlines || headlines.length === 0) {
    return [];
  }

  const results = [];
  
  // Process headlines in small batches to avoid rate limits
  const batchSize = 3;
  for (let i = 0; i < headlines.length; i += batchSize) {
    const batch = headlines.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (headline, index) => {
      // Add small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, index * 100));
      return await analyzeSentiment(headline);
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches
    if (i + batchSize < headlines.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Aggregate sentiment results into summary
 * @param {Array} sentimentResults - Array of sentiment analysis results
 * @returns {object} Aggregated sentiment summary
 */
function aggregateSentiments(sentimentResults) {
  if (!sentimentResults || sentimentResults.length === 0) {
    return {
      positive: 0,
      neutral: 0,
      negative: 0,
      overall: 'neutral',
      summary: 'No sentiment data available.'
    };
  }

  const counts = sentimentResults.reduce((acc, result) => {
    if (result.error) {
      acc.neutral++; // Count errors as neutral
    } else {
      acc[result.label]++;
    }
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  const total = counts.positive + counts.neutral + counts.negative;
  
  // Determine overall sentiment
  let overall = 'neutral';
  if (counts.positive > counts.negative + counts.neutral) {
    overall = 'positive';
  } else if (counts.negative > counts.positive + counts.neutral) {
    overall = 'negative';
  }

  // Generate summary text
  let summary = '';
  if (overall === 'positive') {
    summary = `Recent news is mostly positive, with ${counts.positive} positive, ${counts.neutral} neutral, and ${counts.negative} negative headlines.`;
  } else if (overall === 'negative') {
    summary = `Recent news is mostly negative, with ${counts.negative} negative, ${counts.neutral} neutral, and ${counts.positive} positive headlines.`;
  } else {
    summary = `Recent news sentiment is mixed, with ${counts.positive} positive, ${counts.neutral} neutral, and ${counts.negative} negative headlines.`;
  }

  return {
    positive: counts.positive,
    neutral: counts.neutral,
    negative: counts.negative,
    total,
    overall,
    summary,
    percentages: {
      positive: Math.round((counts.positive / total) * 100),
      neutral: Math.round((counts.neutral / total) * 100),
      negative: Math.round((counts.negative / total) * 100)
    }
  };
}

module.exports = {
  analyzeSentiment,
  analyzeMultipleSentiments,
  aggregateSentiments
};
