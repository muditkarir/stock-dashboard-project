import { StockQuote, StockScore } from '../types';

export class StockAnalyzer {
  /**
   * Calculate comprehensive stock scoring based on real market data
   */
  static calculateStockScore(quote: StockQuote, symbol: string): StockScore {
    const breakdown = this.calculateBreakdown(quote);
    const overallScore = this.calculateOverallScore(breakdown);
    
    return {
      score: overallScore,
      label: this.getScoreLabel(overallScore),
      color: this.getScoreColor(overallScore),
      breakdown,
      explanation: this.generateExplanation(breakdown, symbol),
      recommendation: this.generateRecommendation(overallScore, breakdown)
    };
  }

  /**
   * Calculate individual scoring metrics
   */
  private static calculateBreakdown(quote: StockQuote) {
    return {
      price: this.calculatePricePerformance(quote),
      momentum: this.calculateMomentum(quote),
      volatility: this.calculateVolatility(quote),
      market: this.calculateMarketSentiment(quote),
      trend: this.calculateTrend(quote)
    };
  }

  /**
   * Price Performance: Based on daily change percentage
   * Formula: Normalized daily change performance (-5% to +5% mapped to 0-100)
   */
  private static calculatePricePerformance(quote: StockQuote): number {
    const changePercent = quote.dp || 0; // Daily percentage change
    
    // Normalize -5% to +5% range to 0-100 scale
    // 0% change = 50 points, +5% = 100 points, -5% = 0 points
    let score = 50 + (changePercent * 10);
    
    // Cap between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Momentum: Based on price position within day's range
   * Formula: (current - low) / (high - low) * 100
   */
  private static calculateMomentum(quote: StockQuote): number {
    const { c: current, h: high, l: low } = quote;
    
    if (high === low) return 50; // No movement
    
    const momentum = ((current - low) / (high - low)) * 100;
    return Math.round(Math.max(0, Math.min(100, momentum)));
  }

  /**
   * Volatility Score: Lower volatility gets higher score
   * Formula: Based on day's range relative to current price
   */
  private static calculateVolatility(quote: StockQuote): number {
    const { c: current, h: high, l: low } = quote;
    
    if (current === 0) return 50;
    
    const dailyRange = high - low;
    const rangePercent = (dailyRange / current) * 100;
    
    // Lower volatility = higher score
    // 0-1% range = 90-100 points, 1-3% = 70-90, 3-5% = 50-70, >5% = 0-50
    let score = 100 - (rangePercent * 15);
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Market Sentiment: Based on price relative to previous close
   * Formula: Current price vs previous close performance
   */
  private static calculateMarketSentiment(quote: StockQuote): number {
    const { c: current, pc: previousClose } = quote;
    
    if (previousClose === 0) return 50;
    
    const change = ((current - previousClose) / previousClose) * 100;
    
    // Similar to price performance but broader range
    let score = 50 + (change * 8);
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Trend Analysis: Based on opening vs current price
   * Formula: Intraday trend direction and strength
   */
  private static calculateTrend(quote: StockQuote): number {
    const { c: current, o: open } = quote;
    
    if (open === 0) return 50;
    
    const intradayChange = ((current - open) / open) * 100;
    
    // Positive trend gets higher score
    let score = 50 + (intradayChange * 12);
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Calculate overall score from breakdown
   */
  private static calculateOverallScore(breakdown: any): number {
    const weights = {
      price: 0.25,      // 25% weight
      momentum: 0.20,   // 20% weight  
      volatility: 0.20, // 20% weight
      market: 0.20,     // 20% weight
      trend: 0.15       // 15% weight
    };

    return Math.round(
      breakdown.price * weights.price +
      breakdown.momentum * weights.momentum +
      breakdown.volatility * weights.volatility +
      breakdown.market * weights.market +
      breakdown.trend * weights.trend
    );
  }

  /**
   * Get score label based on overall score
   */
  private static getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Neutral';
    return 'Poor';
  }

  /**
   * Get score color based on overall score
   */
  private static getScoreColor(score: number): string {
    if (score >= 80) return 'green';
    if (score >= 70) return 'blue';
    if (score >= 60) return 'yellow';
    if (score >= 50) return 'orange';
    return 'red';
  }

  /**
   * Generate explanation for the scoring
   */
  private static generateExplanation(breakdown: any, symbol: string): string {
    const strongest = Object.entries(breakdown)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
    const weakest = Object.entries(breakdown)
      .sort(([,a], [,b]) => (a as number) - (b as number))[0];

    return `${symbol} analysis: Strongest in ${strongest[0]} (${strongest[1]}/100), needs attention in ${weakest[0]} (${weakest[1]}/100). All metrics calculated from real-time market data.`;
  }

  /**
   * Generate investment recommendation
   */
  private static generateRecommendation(score: number, breakdown: any) {
    let action: string;
    let description: string;

    if (score >= 75) {
      action = 'Strong Buy';
      description = 'Excellent technical indicators across multiple metrics suggest strong upward potential.';
    } else if (score >= 65) {
      action = 'Buy';
      description = 'Positive technical signals indicate good investment opportunity with manageable risk.';
    } else if (score >= 55) {
      action = 'Hold';
      description = 'Mixed signals suggest maintaining current position while monitoring key metrics.';
    } else if (score >= 45) {
      action = 'Weak Hold';
      description = 'Below-average performance metrics suggest caution. Consider reducing position size.';
    } else {
      action = 'Sell';
      description = 'Poor technical indicators suggest significant downside risk. Consider exiting position.';
    }

    return { action, description };
  }
}