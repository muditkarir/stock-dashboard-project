const axios = require('axios');

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const SENTIMENT_MODEL_URL = 'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment';

/**
 * Analyze sentiment of a text using FinBERT model
 * @param {string} text - Text to analyze
 * @returns {Promise<object>} Sentiment analysis result
 */
async function analyzeSentiment(text) {
  try {
    if (!text || text.trim().length === 0) {
      return { label: 'neutral', score: 0.5, error: 'Empty text' };
    }

    const response = await axios.post(SENTIMENT_MODEL_URL, {
      inputs: text
    }, {
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout for AI processing
    });

    // RoBERTa sentiment model typically returns array of classification results
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Get the prediction with highest score
      const predictions = response.data[0];
      const topPrediction = predictions.reduce((max, pred) => 
        pred.score > max.score ? pred : max
      );

      return {
        label: mapRoBERTaLabel(topPrediction.label),
        score: topPrediction.score,
        rawPredictions: predictions
      };
    }

    // Fallback for unexpected response format
    console.warn('Unexpected sentiment response format:', response.data);
    return { label: 'neutral', score: 0.5, error: 'Unexpected response format' };

  } catch (error) {
    console.error('Sentiment analysis error:', error.message);
    
    // Handle specific error cases
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 429) {
        return { label: 'neutral', score: 0.5, error: 'Rate limit exceeded' };
      }
    }
    
    return { label: 'neutral', score: 0.5, error: error.message };
  }
}

/**
 * Map BERT sentiment labels to simplified sentiment labels
 * @param {string} label - Original BERT label (1-5 stars)
 * @returns {string} Simplified sentiment label
 */
function mapRoBERTaLabel(label) {
  const lowerLabel = label.toLowerCase();
  
  // This model returns star ratings - map them to sentiment
  if (lowerLabel.includes('5 stars') || lowerLabel.includes('4 stars')) return 'positive';
  if (lowerLabel.includes('1 star') || lowerLabel.includes('2 stars')) return 'negative';
  return 'neutral'; // 3 stars or anything else
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
  aggregateSentiments,
  mapRoBERTaLabel
};
