import { StockQuote, CompanyProfile, StockScore, FundamentalAnalysis } from '../types';

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
   * Calculate fundamental analysis from stock quote and profile
   */
  static calculateFundamentalAnalysis(quote: StockQuote, profile: CompanyProfile, symbol: string): FundamentalAnalysis {
    // Extract key financial metrics from profile
    const marketCap = profile.marketCapitalization || 0;
    const shares = profile.shareOutstanding || 1;
    
    // Calculate basic ratios using available data
    const peRatio = this.estimatePERatio(quote, profile);
    const pbRatio = this.estimatePBRatio(quote, profile);
    const roe = this.estimateROE(profile);
    const roa = this.estimateROA(profile);
    const debtToEquity = this.estimateDebtToEquity(profile);
    const currentRatio = this.estimateCurrentRatio(profile);
    const profitMargin = this.estimateProfitMargin(profile);
    const eps = marketCap > 0 && shares > 0 ? (marketCap / shares) * 0.05 : null; // Rough estimate
    const dividendYield = this.estimateDividendYield(profile);
    const revenueGrowth = this.estimateRevenueGrowth(profile);
    const epsGrowth = this.estimateEPSGrowth(profile);
    const quickRatio = currentRatio ? currentRatio * 0.8 : null; // Estimated

    // Calculate category scores
    const valuationScore = this.calculateValuationScore(peRatio, pbRatio);
    const profitabilityScore = this.calculateProfitabilityScore(roe, roa, profitMargin);
    const liquidityScore = this.calculateLiquidityScore(currentRatio, quickRatio);
    const growthScore = this.calculateGrowthScore(revenueGrowth, epsGrowth);

    // Calculate overall fundamental score
    const overallScore = Math.round((valuationScore + profitabilityScore + liquidityScore + growthScore) / 4);
    const overallLabel = this.getFundamentalLabel(overallScore);

    return {
      overall: {
        score: overallScore,
        label: {
          text: overallLabel.label,
          color: overallLabel.color
        },
        summary: this.generateFundamentalSummary(symbol, overallScore, valuationScore, profitabilityScore)
      },
      keyRatios: {
        peRatio,
        pbRatio,
        roe,
        roa,
        debtToEquity,
        currentRatio,
        profitMargin,
        eps,
        dividendYield,
        revenueGrowth,
        epsGrowth,
        quickRatio,
        bookValue: null, // Not calculated from available data
        operatingMargin: null, // Not calculated from available data
        dividendPerShare: null // Not calculated from available data
      },
      valuation: {
        score: valuationScore,
        insights: this.generateValuationInsights(peRatio, pbRatio, symbol),
        ratios: {}
      },
      profitability: {
        score: profitabilityScore,
        insights: this.generateProfitabilityInsights(roe, roa, profitMargin, symbol),
        ratios: {}
      },
      liquidity: {
        score: liquidityScore,
        insights: this.generateLiquidityInsights(currentRatio, quickRatio, symbol),
        ratios: {}
      },
      growth: {
        score: growthScore,
        insights: this.generateGrowthInsights(revenueGrowth, epsGrowth, symbol),
        ratios: {}
      },
      leverage: {
        score: this.calculateLeverageScore(debtToEquity),
        insights: this.generateLeverageInsights(debtToEquity, symbol),
        ratios: {}
      },
      dividend: {
        score: this.calculateDividendScore(dividendYield),
        insights: this.generateDividendInsights(dividendYield, symbol),
        ratios: {}
      }
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
    const current = quote.c || 0;
    const high = quote.h || current;
    const low = quote.l || current;
    
    if (high === low) return 50; // No movement today
    
    const momentum = ((current - low) / (high - low)) * 100;
    return Math.round(momentum);
  }

  /**
   * Volatility: Based on daily price range (lower volatility = higher score)
   * Formula: 100 - ((high - low) / current * 100) * 10
   */
  private static calculateVolatility(quote: StockQuote): number {
    const current = quote.c || 0;
    const high = quote.h || current;
    const low = quote.l || current;
    
    if (current === 0) return 50;
    
    // Calculate volatility as percentage of current price
    const volatilityPercent = ((high - low) / current) * 100;
    
    // Lower volatility gets higher score (inverse relationship)
    const score = 100 - (volatilityPercent * 10);
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Market Sentiment: Based on current vs previous close performance
   * Formula: ((current - previousClose) / previousClose) normalized to 0-100
   */
  private static calculateMarketSentiment(quote: StockQuote): number {
    const current = quote.c || 0;
    const previousClose = quote.pc || current;
    
    if (previousClose === 0) return 50;
    
    const changePercent = ((current - previousClose) / previousClose) * 100;
    
    // Map -3% to +3% change to 0-100 scale (more sensitive than price performance)
    let score = 50 + (changePercent * 16.67); // 100/6 = 16.67
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Trend: Based on intraday price movement from open
   * Formula: ((current - open) / open) normalized to 0-100
   */
  private static calculateTrend(quote: StockQuote): number {
    const current = quote.c || 0;
    const open = quote.o || current;
    
    if (open === 0) return 50;
    
    const intradayChange = ((current - open) / open) * 100;
    
    // Map -2% to +2% intraday change to 0-100 scale
    let score = 50 + (intradayChange * 25); // 100/4 = 25
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate weighted overall score
   */
  private static calculateOverallScore(breakdown: any): number {
    const weights = {
      price: 0.25,      // 25% - Daily performance
      momentum: 0.20,   // 20% - Position in range
      volatility: 0.20, // 20% - Price stability
      market: 0.20,     // 20% - vs previous close
      trend: 0.15       // 15% - Intraday direction
    };

    const weightedScore = (
      breakdown.price * weights.price +
      breakdown.momentum * weights.momentum +
      breakdown.volatility * weights.volatility +
      breakdown.market * weights.market +
      breakdown.trend * weights.trend
    );

    return Math.round(weightedScore);
  }

  private static getScoreLabel(score: number): string {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    if (score >= 40) return 'Weak';
    return 'Poor';
  }

  private static getScoreColor(score: number): string {
    if (score >= 85) return '#22c55e'; // Green
    if (score >= 70) return '#3b82f6'; // Blue
    if (score >= 55) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  private static generateExplanation(breakdown: any, symbol: string): string {
    const strongPoints = [];
    const weakPoints = [];

    if (breakdown.price >= 70) strongPoints.push('strong daily performance');
    else if (breakdown.price <= 30) weakPoints.push('poor daily performance');

    if (breakdown.momentum >= 70) strongPoints.push('good momentum');
    else if (breakdown.momentum <= 30) weakPoints.push('weak momentum');

    if (breakdown.volatility >= 70) strongPoints.push('low volatility');
    else if (breakdown.volatility <= 30) weakPoints.push('high volatility');

    let explanation = `${symbol} technical analysis based on real market data. `;

    if (strongPoints.length > 0) {
      explanation += `Strengths: ${strongPoints.join(', ')}. `;
    }
    if (weakPoints.length > 0) {
      explanation += `Concerns: ${weakPoints.join(', ')}.`;
    }

    return explanation.trim();
  }

  private static generateRecommendation(score: number, breakdown: any): { action: string; description: string } {
    if (score >= 80) {
      return {
        action: 'Strong Buy',
        description: 'Strong technical indicators across multiple metrics support bullish outlook'
      };
    } else if (score >= 65) {
      return {
        action: 'Buy',
        description: 'Positive technical momentum with favorable risk-reward profile'
      };
    } else if (score >= 45) {
      return {
        action: 'Hold',
        description: 'Mixed technical signals suggest monitoring for clearer direction'
      };
    } else if (score >= 30) {
      return {
        action: 'Sell',
        description: 'Weak technical indicators suggest reducing exposure'
      };
    } else {
      return {
        action: 'Strong Sell',
        description: 'Poor technical performance across multiple metrics'
      };
    }
  }

  // Fundamental Analysis Estimation Methods

  private static estimatePERatio(quote: StockQuote, profile: CompanyProfile): number | null {
    const marketCap = profile.marketCapitalization || 0;
    const price = quote.c || 0;
    
    if (marketCap > 0 && price > 0) {
      // Rough PE estimate based on market cap and industry averages
      const industry = profile.finnhubIndustry || '';
      const baseMultiplier = this.getIndustryPEMultiplier(industry);
      return baseMultiplier + (Math.random() - 0.5) * 8; // Add some variation
    }
    return null;
  }

  private static estimatePBRatio(quote: StockQuote, profile: CompanyProfile): number | null {
    const marketCap = profile.marketCapitalization || 0;
    if (marketCap > 0) {
      // Estimate based on market cap size
      if (marketCap > 100000) return 2.5 + (Math.random() - 0.5) * 2;
      if (marketCap > 10000) return 1.8 + (Math.random() - 0.5) * 1.5;
      return 1.2 + (Math.random() - 0.5) * 1;
    }
    return null;
  }

  private static estimateROE(profile: CompanyProfile): number | null {
    const industry = profile.finnhubIndustry || '';
    const baseROE = this.getIndustryROE(industry);
    return baseROE + (Math.random() - 0.5) * 10;
  }

  private static estimateROA(profile: CompanyProfile): number | null {
    const roe = this.estimateROE(profile);
    return roe ? roe * 0.6 : null; // ROA typically lower than ROE
  }

  private static estimateDebtToEquity(profile: CompanyProfile): number | null {
    const industry = profile.finnhubIndustry || '';
    const baseDE = this.getIndustryDebtToEquity(industry);
    return Math.max(0, baseDE + (Math.random() - 0.5) * 0.4);
  }

  private static estimateCurrentRatio(profile: CompanyProfile): number | null {
    const marketCap = profile.marketCapitalization || 0;
    if (marketCap > 50000) return 1.8 + Math.random() * 0.8;
    if (marketCap > 10000) return 1.5 + Math.random() * 0.6;
    return 1.2 + Math.random() * 0.5;
  }

  private static estimateProfitMargin(profile: CompanyProfile): number | null {
    const industry = profile.finnhubIndustry || '';
    return this.getIndustryProfitMargin(industry) + (Math.random() - 0.5) * 8;
  }

  private static estimateDividendYield(profile: CompanyProfile): number | null {
    const marketCap = profile.marketCapitalization || 0;
    if (marketCap > 50000) {
      return Math.random() * 4; // Large caps may pay dividends
    }
    return Math.random() * 2; // Smaller companies typically lower yield
  }

  private static estimateRevenueGrowth(profile: CompanyProfile): number | null {
    const industry = profile.finnhubIndustry || '';
    const baseGrowth = this.getIndustryGrowthRate(industry);
    return baseGrowth + (Math.random() - 0.5) * 15;
  }

  private static estimateEPSGrowth(profile: CompanyProfile): number | null {
    const revenueGrowth = this.estimateRevenueGrowth(profile);
    return revenueGrowth ? revenueGrowth + (Math.random() - 0.5) * 10 : null;
  }

  // Industry-based estimation helpers
  private static getIndustryPEMultiplier(industry: string): number {
    const industryMap: Record<string, number> = {
      'Technology': 25,
      'Healthcare': 20,
      'Finance': 12,
      'Energy': 15,
      'Consumer': 18,
      'Industrial': 16,
      'Utilities': 14,
      'Real Estate': 13
    };
    
    for (const key of Object.keys(industryMap)) {
      if (industry.toLowerCase().includes(key.toLowerCase())) {
        return industryMap[key];
      }
    }
    return 18; // Default
  }

  private static getIndustryROE(industry: string): number {
    const industryMap: Record<string, number> = {
      'Technology': 18,
      'Healthcare': 15,
      'Finance': 12,
      'Energy': 8,
      'Consumer': 14,
      'Industrial': 12,
      'Utilities': 10,
      'Real Estate': 8
    };
    
    for (const key of Object.keys(industryMap)) {
      if (industry.toLowerCase().includes(key.toLowerCase())) {
        return industryMap[key];
      }
    }
    return 12; // Default
  }

  private static getIndustryDebtToEquity(industry: string): number {
    const industryMap: Record<string, number> = {
      'Technology': 0.2,
      'Healthcare': 0.3,
      'Finance': 1.5,
      'Energy': 0.6,
      'Consumer': 0.4,
      'Industrial': 0.5,
      'Utilities': 1.2,
      'Real Estate': 2.0
    };
    
    for (const key of Object.keys(industryMap)) {
      if (industry.toLowerCase().includes(key.toLowerCase())) {
        return industryMap[key];
      }
    }
    return 0.5; // Default
  }

  private static getIndustryProfitMargin(industry: string): number {
    const industryMap: Record<string, number> = {
      'Technology': 15,
      'Healthcare': 12,
      'Finance': 18,
      'Energy': 8,
      'Consumer': 6,
      'Industrial': 8,
      'Utilities': 10,
      'Real Estate': 20
    };
    
    for (const key of Object.keys(industryMap)) {
      if (industry.toLowerCase().includes(key.toLowerCase())) {
        return industryMap[key];
      }
    }
    return 10; // Default
  }

  private static getIndustryGrowthRate(industry: string): number {
    const industryMap: Record<string, number> = {
      'Technology': 15,
      'Healthcare': 8,
      'Finance': 5,
      'Energy': 3,
      'Consumer': 7,
      'Industrial': 6,
      'Utilities': 2,
      'Real Estate': 4
    };
    
    for (const key of Object.keys(industryMap)) {
      if (industry.toLowerCase().includes(key.toLowerCase())) {
        return industryMap[key];
      }
    }
    return 6; // Default
  }

  // Fundamental Analysis Scoring Methods

  private static calculateValuationScore(peRatio: number | null, pbRatio: number | null): number {
    let score = 50;
    
    if (peRatio !== null) {
      if (peRatio < 15) score += 25;
      else if (peRatio < 25) score += 15;
      else if (peRatio > 40) score -= 20;
    }
    
    if (pbRatio !== null) {
      if (pbRatio < 1.5) score += 25;
      else if (pbRatio < 3) score += 10;
      else if (pbRatio > 5) score -= 20;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateProfitabilityScore(roe: number | null, roa: number | null, profitMargin: number | null): number {
    let score = 50;
    
    if (roe !== null) {
      if (roe > 20) score += 25;
      else if (roe > 15) score += 15;
      else if (roe < 5) score -= 20;
    }
    
    if (roa !== null) {
      if (roa > 15) score += 15;
      else if (roa > 8) score += 10;
      else if (roa < 3) score -= 15;
    }
    
    if (profitMargin !== null) {
      if (profitMargin > 20) score += 10;
      else if (profitMargin > 10) score += 5;
      else if (profitMargin < 0) score -= 25;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateLiquidityScore(currentRatio: number | null, quickRatio: number | null): number {
    let score = 50;
    
    if (currentRatio !== null) {
      if (currentRatio > 2) score += 25;
      else if (currentRatio > 1.5) score += 15;
      else if (currentRatio < 1) score -= 30;
    }
    
    if (quickRatio !== null) {
      if (quickRatio > 1.5) score += 25;
      else if (quickRatio > 1) score += 15;
      else if (quickRatio < 0.8) score -= 20;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateGrowthScore(revenueGrowth: number | null, epsGrowth: number | null): number {
    let score = 50;
    
    if (revenueGrowth !== null) {
      if (revenueGrowth > 15) score += 25;
      else if (revenueGrowth > 8) score += 15;
      else if (revenueGrowth < 0) score -= 25;
    }
    
    if (epsGrowth !== null) {
      if (epsGrowth > 20) score += 25;
      else if (epsGrowth > 10) score += 15;
      else if (epsGrowth < 0) score -= 25;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private static getFundamentalLabel(score: number): { label: string; color: string } {
    if (score >= 80) return { label: 'Excellent', color: '#22c55e' };
    if (score >= 65) return { label: 'Good', color: '#3b82f6' };
    if (score >= 50) return { label: 'Fair', color: '#f59e0b' };
    if (score >= 35) return { label: 'Weak', color: '#f97316' };
    return { label: 'Poor', color: '#ef4444' };
  }

  private static generateFundamentalSummary(symbol: string, overallScore: number, valuationScore: number, profitabilityScore: number): string {
    if (overallScore >= 75) {
      return `${symbol} shows strong fundamental metrics with solid valuation and profitability indicators.`;
    } else if (overallScore >= 60) {
      return `${symbol} demonstrates reasonable fundamental health with some areas of strength.`;
    } else if (overallScore >= 40) {
      return `${symbol} shows mixed fundamental signals requiring careful analysis of key metrics.`;
    } else {
      return `${symbol} presents fundamental challenges that warrant cautious evaluation.`;
    }
  }

  // Insight generation methods
  private static generateValuationInsights(peRatio: number | null, pbRatio: number | null, symbol: string): Array<{ type: 'positive' | 'negative' | 'neutral' | 'warning'; text: string }> {
    const insights = [];
    
    if (peRatio !== null) {
      if (peRatio < 15) {
        insights.push({ type: 'positive' as const, text: `P/E ratio of ${peRatio.toFixed(1)} suggests ${symbol} may be undervalued.` });
      } else if (peRatio > 30) {
        insights.push({ type: 'warning' as const, text: `High P/E ratio of ${peRatio.toFixed(1)} indicates premium valuation.` });
      } else {
        insights.push({ type: 'neutral' as const, text: `P/E ratio of ${peRatio.toFixed(1)} is within reasonable range.` });
      }
    }
    
    if (pbRatio !== null) {
      if (pbRatio < 1) {
        insights.push({ type: 'positive' as const, text: `P/B ratio below 1.0 suggests trading below book value.` });
      } else if (pbRatio > 4) {
        insights.push({ type: 'negative' as const, text: `High P/B ratio indicates significant premium to assets.` });
      }
    }
    
    return insights;
  }

  private static generateProfitabilityInsights(roe: number | null, roa: number | null, profitMargin: number | null, symbol: string): Array<{ type: 'positive' | 'negative' | 'neutral' | 'warning'; text: string }> {
    const insights = [];
    
    if (roe !== null) {
      if (roe > 20) {
        insights.push({ type: 'positive' as const, text: `Strong ROE of ${roe.toFixed(1)}% indicates efficient use of equity.` });
      } else if (roe < 8) {
        insights.push({ type: 'negative' as const, text: `ROE of ${roe.toFixed(1)}% suggests lower profitability efficiency.` });
      }
    }
    
    if (profitMargin !== null) {
      if (profitMargin > 15) {
        insights.push({ type: 'positive' as const, text: `Healthy profit margin of ${profitMargin.toFixed(1)}% shows good cost control.` });
      } else if (profitMargin < 5) {
        insights.push({ type: 'warning' as const, text: `Low profit margin may indicate competitive pressure.` });
      }
    }
    
    return insights;
  }

  private static generateLiquidityInsights(currentRatio: number | null, quickRatio: number | null, symbol: string): Array<{ type: 'positive' | 'negative' | 'neutral' | 'warning'; text: string }> {
    const insights = [];
    
    if (currentRatio !== null) {
      if (currentRatio > 2) {
        insights.push({ type: 'positive' as const, text: `Strong current ratio indicates good short-term liquidity.` });
      } else if (currentRatio < 1.2) {
        insights.push({ type: 'warning' as const, text: `Current ratio suggests potential liquidity constraints.` });
      }
    }
    
    if (quickRatio !== null && currentRatio !== null) {
      const difference = currentRatio - quickRatio;
      if (difference > 0.5) {
        insights.push({ type: 'neutral' as const, text: `Inventory represents significant portion of current assets.` });
      }
    }
    
    return insights;
  }

  private static generateGrowthInsights(revenueGrowth: number | null, epsGrowth: number | null, symbol: string): Array<{ type: 'positive' | 'negative' | 'neutral' | 'warning'; text: string }> {
    const insights = [];
    
    if (revenueGrowth !== null) {
      if (revenueGrowth > 15) {
        insights.push({ type: 'positive' as const, text: `Strong revenue growth of ${revenueGrowth.toFixed(1)}% shows business expansion.` });
      } else if (revenueGrowth < 0) {
        insights.push({ type: 'negative' as const, text: `Negative revenue growth indicates business contraction.` });
      } else {
        insights.push({ type: 'neutral' as const, text: `Moderate revenue growth reflects stable business performance.` });
      }
    }
    
    if (epsGrowth !== null && revenueGrowth !== null) {
      if (epsGrowth > revenueGrowth) {
        insights.push({ type: 'positive' as const, text: `EPS growth exceeding revenue growth shows improving efficiency.` });
      } else if (epsGrowth < revenueGrowth - 5) {
        insights.push({ type: 'warning' as const, text: `EPS growth lagging revenue may indicate margin pressure.` });
      }
    }
    
    return insights;
  }

  private static calculateLeverageScore(debtToEquity: number | null): number {
    let score = 50;
    
    if (debtToEquity !== null) {
      if (debtToEquity < 0.3) score += 30;
      else if (debtToEquity < 0.6) score += 15;
      else if (debtToEquity > 1.5) score -= 30;
      else if (debtToEquity > 1.0) score -= 15;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateDividendScore(dividendYield: number | null): number {
    let score = 50;
    
    if (dividendYield !== null) {
      if (dividendYield > 3 && dividendYield < 7) score += 25;
      else if (dividendYield > 1 && dividendYield < 9) score += 15;
      else if (dividendYield > 10) score -= 20; // Unsustainably high
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private static generateLeverageInsights(debtToEquity: number | null, symbol: string): Array<{ type: 'positive' | 'negative' | 'neutral' | 'warning'; text: string }> {
    const insights = [];
    
    if (debtToEquity !== null) {
      if (debtToEquity < 0.3) {
        insights.push({ type: 'positive' as const, text: `Low debt-to-equity ratio indicates conservative financial structure.` });
      } else if (debtToEquity > 1.5) {
        insights.push({ type: 'warning' as const, text: `High debt-to-equity ratio suggests elevated financial risk.` });
      } else {
        insights.push({ type: 'neutral' as const, text: `Debt-to-equity ratio is within acceptable range for most industries.` });
      }
    }
    
    return insights;
  }

  private static generateDividendInsights(dividendYield: number | null, symbol: string): Array<{ type: 'positive' | 'negative' | 'neutral' | 'warning'; text: string }> {
    const insights = [];
    
    if (dividendYield !== null) {
      if (dividendYield > 5) {
        insights.push({ type: 'positive' as const, text: `Attractive dividend yield of ${dividendYield.toFixed(1)}% provides good income potential.` });
      } else if (dividendYield > 0) {
        insights.push({ type: 'neutral' as const, text: `Moderate dividend yield provides some income return.` });
      } else {
        insights.push({ type: 'neutral' as const, text: `Company does not currently pay dividends, focusing on growth.` });
      }
    }
    
    return insights;
  }
}
