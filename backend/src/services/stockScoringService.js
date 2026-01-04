class StockScoringService {
  constructor() {
    this.scoreThresholds = {
      strong: { min: 70, label: 'Strong', color: '#10B981' },
      moderate: { min: 40, label: 'Moderate', color: '#F59E0B' },
      weak: { min: 0, label: 'Weak', color: '#EF4444' }
    };
  }

  /**
   * Calculate stock score based on various metrics
   * @param {Object} quote - Current stock quote data
   * @param {Object} profile - Company profile data
   * @param {Object} historicalData - Historical price data
   * @returns {Object} Score object with value, label, color, and breakdown
   */
  calculateScore(quote, profile, historicalData = null) {
    try {
      const scores = {
        price: this.calculatePriceScore(quote),
        momentum: this.calculateMomentumScore(quote),
        volatility: this.calculateVolatilityScore(quote),
        market: this.calculateMarketScore(profile)
      };

      // Store calculation details for transparency
      const calculationDetails = {
        price: this.getPriceDetails(quote),
        momentum: this.getMomentumDetails(quote),
        volatility: this.getVolatilityDetails(quote),
        market: this.getMarketDetails(profile)
      };

      // Add historical performance if available
      if (historicalData && historicalData.c && historicalData.c.length >= 10) {
        const trendData = this.calculateTrendScoreWithDetails(historicalData);
        scores.trend = trendData.score;
        calculationDetails.trend = trendData.details;
      } else {
        // Always include trend score even when data is unavailable
        scores.trend = 50; // Neutral score
        calculationDetails.trend = { 
          error: 'Historical data not available from Finnhub free tier. Upgrade to access trend analysis or use alternative data source.' 
        };
      }

      // Calculate weighted average
      const weights = {
        price: 0.3,
        momentum: 0.25,
        volatility: 0.2,
        market: 0.15,
        trend: 0.1
      };

      let totalScore = 0;
      let totalWeight = 0;

      Object.keys(scores).forEach(key => {
        if (scores[key] !== null && weights[key]) {
          totalScore += scores[key] * weights[key];
          totalWeight += weights[key];
        }
      });

      // Normalize to 0-100 scale
      const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;

      return {
        score: Math.max(0, Math.min(100, finalScore)),
        ...this.getScoreLabel(finalScore),
        breakdown: scores,
        calculationDetails,
        explanation: this.generateExplanation(scores, quote)
      };
    } catch (error) {
      console.error('Error calculating stock score:', error);
      return {
        score: 50,
        label: 'Neutral',
        color: '#6B7280',
        breakdown: {},
        explanation: 'Unable to calculate score due to insufficient data'
      };
    }
  }

  /**
   * Score based on price performance
   */
  calculatePriceScore(quote) {
    if (!quote || typeof quote.dp !== 'number') return 50;

    const changePercent = quote.dp;
    
    if (changePercent > 5) return 90;
    if (changePercent > 2) return 80;
    if (changePercent > 0) return 65;
    if (changePercent > -2) return 35;
    if (changePercent > -5) return 20;
    return 10;
  }

  /**
   * Score based on momentum (current price vs day's range)
   */
  calculateMomentumScore(quote) {
    if (!quote || !quote.h || !quote.l || !quote.c) return 50;

    const { h: high, l: low, c: current } = quote;
    const range = high - low;
    
    if (range === 0) return 50;
    
    const positionInRange = (current - low) / range;
    
    return Math.round(positionInRange * 100);
  }

  /**
   * Score based on volatility (inverse relationship - lower volatility = higher score for stability)
   */
  calculateVolatilityScore(quote) {
    if (!quote || !quote.h || !quote.l || !quote.pc) return 50;

    const { h: high, l: low, pc: previousClose } = quote;
    const volatility = ((high - low) / previousClose) * 100;

    if (volatility < 1) return 80;
    if (volatility < 2) return 70;
    if (volatility < 3) return 60;
    if (volatility < 5) return 40;
    if (volatility < 8) return 25;
    return 10;
  }

  /**
   * Score based on market cap (larger companies generally more stable)
   */
  calculateMarketScore(profile) {
    if (!profile || !profile.marketCapitalization) return 50;

    const marketCap = profile.marketCapitalization;
    
    // Large cap (>$10B)
    if (marketCap > 10000) return 80;
    // Mid cap ($2B-$10B)
    if (marketCap > 2000) return 65;
    // Small cap ($300M-$2B)
    if (marketCap > 300) return 45;
    // Micro cap (<$300M)
    return 30;
  }

  /**
   * Score based on historical trend
   */
  calculateTrendScore(historicalData) {
    if (!historicalData || !historicalData.c || historicalData.c.length < 10) return 50;

    const prices = historicalData.c.slice(-20);
    const recentPrices = prices.slice(-5);
    const olderPrices = prices.slice(-20, -15);

    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;

    const trendPercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (trendPercent > 10) return 90;
    if (trendPercent > 5) return 80;
    if (trendPercent > 0) return 65;
    if (trendPercent > -5) return 35;
    if (trendPercent > -10) return 20;
    return 10;
  }

  calculateTrendScoreWithDetails(historicalData) {
    if (!historicalData || !historicalData.c || historicalData.c.length < 10) {
      return { score: 50, details: { error: 'Insufficient data' } };
    }

    const prices = historicalData.c.slice(-20);
    const recentPrices = prices.slice(-5);
    const olderPrices = prices.slice(-20, -15);

    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;
    const trendPercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    let score;
    if (trendPercent > 10) score = 90;
    else if (trendPercent > 5) score = 80;
    else if (trendPercent > 0) score = 65;
    else if (trendPercent > -5) score = 35;
    else if (trendPercent > -10) score = 20;
    else score = 10;

    return {
      score,
      details: {
        recentAvg: recentAvg.toFixed(2),
        olderAvg: olderAvg.toFixed(2),
        trendPercent: trendPercent.toFixed(2),
        direction: trendPercent > 0 ? 'upward' : trendPercent < 0 ? 'downward' : 'flat'
      }
    };
  }

  getPriceDetails(quote) {
    if (!quote || typeof quote.dp !== 'number') return { error: 'No data' };
    return {
      currentPrice: quote.c?.toFixed(2),
      previousClose: quote.pc?.toFixed(2),
      changePercent: quote.dp?.toFixed(2),
      changeAmount: quote.d?.toFixed(2)
    };
  }

  getMomentumDetails(quote) {
    if (!quote || !quote.h || !quote.l || !quote.c) return { error: 'No data' };
    const range = quote.h - quote.l;
    const positionInRange = range === 0 ? 0.5 : (quote.c - quote.l) / range;
    return {
      currentPrice: quote.c.toFixed(2),
      dailyHigh: quote.h.toFixed(2),
      dailyLow: quote.l.toFixed(2),
      positionInRange: (positionInRange * 100).toFixed(1) + '%'
    };
  }

  getVolatilityDetails(quote) {
    if (!quote || !quote.h || !quote.l || !quote.pc) return { error: 'No data' };
    const volatility = ((quote.h - quote.l) / quote.pc) * 100;
    return {
      dailyHigh: quote.h.toFixed(2),
      dailyLow: quote.l.toFixed(2),
      previousClose: quote.pc.toFixed(2),
      volatilityPercent: volatility.toFixed(2) + '%'
    };
  }

  getMarketDetails(profile) {
    if (!profile || !profile.marketCapitalization) return { error: 'No data' };
    const marketCap = profile.marketCapitalization;
    let tier = 'Micro Cap';
    if (marketCap > 10000) tier = 'Large Cap';
    else if (marketCap > 2000) tier = 'Mid Cap';
    else if (marketCap > 300) tier = 'Small Cap';
    
    return {
      marketCap: marketCap.toFixed(2) + 'M',
      tier,
      companyName: profile.name || 'Unknown'
    };
  }

  /**
   * Get score label and color
   */
  getScoreLabel(score) {
    if (score >= this.scoreThresholds.strong.min) {
      return {
        label: this.scoreThresholds.strong.label,
        color: this.scoreThresholds.strong.color
      };
    } else if (score >= this.scoreThresholds.moderate.min) {
      return {
        label: this.scoreThresholds.moderate.label,
        color: this.scoreThresholds.moderate.color
      };
    } else {
      return {
        label: this.scoreThresholds.weak.label,
        color: this.scoreThresholds.weak.color
      };
    }
  }

  /**
   * Generate human-readable explanation
   */
  generateExplanation(scores, quote) {
    const explanations = [];

    if (scores.price > 70) {
      explanations.push('strong price performance');
    } else if (scores.price < 30) {
      explanations.push('weak price performance');
    }

    if (scores.momentum > 70) {
      explanations.push('positive momentum');
    } else if (scores.momentum < 30) {
      explanations.push('negative momentum');
    }

    if (scores.volatility > 70) {
      explanations.push('low volatility');
    } else if (scores.volatility < 30) {
      explanations.push('high volatility');
    }

    if (explanations.length === 0) {
      return 'Mixed signals from various indicators';
    }

    return `Based on ${explanations.join(', ')}`;
  }

  /**
   * Get quick recommendation
   */
  getRecommendation(score) {
    if (score >= 70) {
      return {
        action: 'Consider',
        description: 'Stock shows strong indicators across multiple metrics'
      };
    } else if (score >= 40) {
      return {
        action: 'Monitor',
        description: 'Stock shows mixed signals, worth monitoring for opportunities'
      };
    } else {
      return {
        action: 'Caution',
        description: 'Stock shows weak indicators, exercise caution'
      };
    }
  }
}

module.exports = new StockScoringService();
