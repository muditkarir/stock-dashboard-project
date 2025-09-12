class FundamentalAnalysisService {
  constructor() {
    // Industry average benchmarks (these would ideally come from a database or external service)
    this.industryBenchmarks = {
      technology: {
        peRatio: 25,
        pbRatio: 4.5,
        roe: 15,
        debtToEquity: 0.3,
        currentRatio: 2.0,
        profitMargin: 20
      },
      healthcare: {
        peRatio: 18,
        pbRatio: 3.2,
        roe: 12,
        debtToEquity: 0.4,
        currentRatio: 2.5,
        profitMargin: 15
      },
      financial: {
        peRatio: 12,
        pbRatio: 1.2,
        roe: 10,
        debtToEquity: 0.8,
        currentRatio: 1.1,
        profitMargin: 25
      },
      default: {
        peRatio: 20,
        pbRatio: 2.5,
        roe: 12,
        debtToEquity: 0.5,
        currentRatio: 2.0,
        profitMargin: 10
      }
    };

    // Metric definitions for tooltips
    this.metricDefinitions = {
      peRatio: {
        name: "Price-to-Earnings Ratio",
        description: "Current share price divided by earnings per share. Indicates how much investors are willing to pay per dollar of earnings.",
        formula: "Stock Price ÷ Earnings Per Share",
        goodRange: "10-25 (varies by industry)"
      },
      pbRatio: {
        name: "Price-to-Book Ratio",
        description: "Market value compared to book value. Shows if stock is over or undervalued relative to assets.",
        formula: "Market Price per Share ÷ Book Value per Share",
        goodRange: "1-3 (varies by industry)"
      },
      roe: {
        name: "Return on Equity",
        description: "Measures profitability by revealing how much profit a company generates with shareholders' equity.",
        formula: "Net Income ÷ Shareholders' Equity × 100",
        goodRange: "15%+ is generally good"
      },
      roa: {
        name: "Return on Assets",
        description: "Indicates how efficiently a company uses its assets to generate profit.",
        formula: "Net Income ÷ Total Assets × 100",
        goodRange: "5%+ is generally good"
      },
      debtToEquity: {
        name: "Debt-to-Equity Ratio",
        description: "Measures financial leverage by comparing total debt to shareholders' equity.",
        formula: "Total Debt ÷ Shareholders' Equity",
        goodRange: "0.3-0.6 (varies by industry)"
      },
      currentRatio: {
        name: "Current Ratio",
        description: "Measures ability to pay short-term obligations with current assets.",
        formula: "Current Assets ÷ Current Liabilities",
        goodRange: "1.5-3.0"
      },
      quickRatio: {
        name: "Quick Ratio",
        description: "Like current ratio but excludes inventory. More conservative liquidity measure.",
        formula: "(Current Assets - Inventory) ÷ Current Liabilities",
        goodRange: "1.0-2.0"
      },
      profitMargin: {
        name: "Net Profit Margin",
        description: "Percentage of revenue that remains as profit after all expenses.",
        formula: "Net Income ÷ Total Revenue × 100",
        goodRange: "10%+ is generally good"
      },
      dividendYield: {
        name: "Dividend Yield",
        description: "Annual dividend payment as a percentage of stock price.",
        formula: "Annual Dividends per Share ÷ Price per Share × 100",
        goodRange: "2-6% for dividend stocks"
      },
      eps: {
        name: "Earnings Per Share",
        description: "Company's profit divided by the outstanding shares of common stock.",
        formula: "Net Income ÷ Outstanding Shares",
        goodRange: "Positive and growing"
      },
      bookValue: {
        name: "Book Value per Share",
        description: "Company's equity divided by number of outstanding shares.",
        formula: "Shareholders' Equity ÷ Outstanding Shares",
        goodRange: "Higher than market price suggests undervaluation"
      },
      operatingMargin: {
        name: "Operating Margin",
        description: "Operating income as a percentage of revenue, showing operational efficiency.",
        formula: "Operating Income ÷ Revenue × 100",
        goodRange: "15%+ is generally good"
      }
    };
  }

  /**
   * Process and analyze fundamental data from Finnhub
   */
  analyzeFundamentals(basicFinancials, profile) {
    if (!basicFinancials || !basicFinancials.metric) {
      return null;
    }

    const metrics = basicFinancials.metric;
    const industry = this.getIndustryBenchmark(profile?.finnhubIndustry);

    const analysis = {
      keyRatios: this.extractKeyRatios(metrics),
      valuation: this.analyzeValuation(metrics, industry),
      profitability: this.analyzeProfitability(metrics, industry),
      liquidity: this.analyzeLiquidity(metrics, industry),
      leverage: this.analyzeLeverage(metrics, industry),
      dividend: this.analyzeDividend(metrics),
      growth: this.analyzeGrowth(metrics),
      overall: null
    };

    // Calculate overall fundamental score
    analysis.overall = this.calculateOverallScore(analysis);

    return analysis;
  }

  /**
   * Extract key financial ratios from Finnhub metrics
   */
  extractKeyRatios(metrics) {
    return {
      peRatio: metrics.peBasicExclExtraTTM || metrics.peTTM || null,
      pbRatio: metrics.pbQuarterly || metrics.pbAnnual || null,
      roe: metrics.roeRfy || metrics.roeTTM || null,
      roa: metrics.roaRfy || metrics.roaTTM || null,
      eps: metrics.epsBasicExclExtraItemsTTM || metrics.epsTTM || null,
      bookValue: metrics.bookValuePerShareQuarterly || metrics.bookValuePerShareAnnual || null,
      debtToEquity: metrics.totalDebt2EquityQuarterly || metrics.totalDebt2EquityAnnual || null,
      currentRatio: metrics.currentRatioQuarterly || metrics.currentRatioAnnual || null,
      quickRatio: metrics.quickRatioQuarterly || metrics.quickRatioAnnual || null,
      profitMargin: metrics.netProfitMarginTTM || null,
      operatingMargin: metrics.operatingMarginTTM || null,
      dividendYield: metrics.dividendYieldIndicatedAnnual || null,
      dividendPerShare: metrics.dividendsPerShareTTM || null,
      revenueGrowth: metrics.revenueGrowthTTMYoy || null,
      epsGrowth: metrics.epsGrowthTTMYoy || null
    };
  }

  /**
   * Analyze valuation metrics
   */
  analyzeValuation(metrics, industry) {
    const peRatio = metrics.peBasicExclExtraTTM || metrics.peTTM;
    const pbRatio = metrics.pbQuarterly || metrics.pbAnnual;

    const analysis = {
      score: 50,
      insights: [],
      ratios: {
        peRatio: { value: peRatio, benchmark: industry.peRatio },
        pbRatio: { value: pbRatio, benchmark: industry.pbRatio }
      }
    };

    if (peRatio) {
      if (peRatio < industry.peRatio * 0.8) {
        analysis.insights.push({
          type: 'positive',
          text: `P/E ratio of ${peRatio.toFixed(1)} is below industry average, suggesting potential undervaluation`
        });
        analysis.score += 15;
      } else if (peRatio > industry.peRatio * 1.5) {
        analysis.insights.push({
          type: 'negative',
          text: `P/E ratio of ${peRatio.toFixed(1)} is significantly above industry average, indicating high growth expectations or overvaluation`
        });
        analysis.score -= 10;
      } else {
        analysis.insights.push({
          type: 'neutral',
          text: `P/E ratio of ${peRatio.toFixed(1)} is reasonable compared to industry average`
        });
      }
    }

    if (pbRatio) {
      if (pbRatio < 1) {
        analysis.insights.push({
          type: 'positive',
          text: `P/B ratio of ${pbRatio.toFixed(2)} below 1.0 suggests stock trades below book value`
        });
        analysis.score += 10;
      } else if (pbRatio > industry.pbRatio * 1.5) {
        analysis.insights.push({
          type: 'negative',
          text: `P/B ratio of ${pbRatio.toFixed(2)} is high, suggesting premium valuation`
        });
        analysis.score -= 5;
      }
    }

    return analysis;
  }

  /**
   * Analyze profitability metrics
   */
  analyzeProfitability(metrics, industry) {
    const roe = metrics.roeRfy || metrics.roeTTM;
    const roa = metrics.roaRfy || metrics.roaTTM;
    const profitMargin = metrics.netProfitMarginTTM;
    const operatingMargin = metrics.operatingMarginTTM;

    const analysis = {
      score: 50,
      insights: [],
      ratios: {
        roe: { value: roe, benchmark: industry.roe },
        roa: { value: roa, benchmark: 5 },
        profitMargin: { value: profitMargin, benchmark: industry.profitMargin },
        operatingMargin: { value: operatingMargin, benchmark: 15 }
      }
    };

    if (roe) {
      if (roe > industry.roe) {
        analysis.insights.push({
          type: 'positive',
          text: `Strong ROE of ${roe.toFixed(1)}% indicates efficient use of shareholders' equity`
        });
        analysis.score += 15;
      } else if (roe < industry.roe * 0.7) {
        analysis.insights.push({
          type: 'negative',
          text: `ROE of ${roe.toFixed(1)}% is below industry standards`
        });
        analysis.score -= 10;
      }
    }

    if (profitMargin) {
      if (profitMargin > industry.profitMargin) {
        analysis.insights.push({
          type: 'positive',
          text: `Healthy profit margin of ${profitMargin.toFixed(1)}% shows good cost control`
        });
        analysis.score += 10;
      } else if (profitMargin < 5) {
        analysis.insights.push({
          type: 'negative',
          text: `Low profit margin of ${profitMargin.toFixed(1)}% may indicate pricing pressure or high costs`
        });
        analysis.score -= 10;
      }
    }

    return analysis;
  }

  /**
   * Analyze liquidity metrics
   */
  analyzeLiquidity(metrics, industry) {
    const currentRatio = metrics.currentRatioQuarterly || metrics.currentRatioAnnual;
    const quickRatio = metrics.quickRatioQuarterly || metrics.quickRatioAnnual;

    const analysis = {
      score: 50,
      insights: [],
      ratios: {
        currentRatio: { value: currentRatio, benchmark: industry.currentRatio },
        quickRatio: { value: quickRatio, benchmark: 1.0 }
      }
    };

    if (currentRatio) {
      if (currentRatio >= 2.0) {
        analysis.insights.push({
          type: 'positive',
          text: `Strong current ratio of ${currentRatio.toFixed(2)} indicates good short-term liquidity`
        });
        analysis.score += 15;
      } else if (currentRatio < 1.0) {
        analysis.insights.push({
          type: 'negative',
          text: `Current ratio of ${currentRatio.toFixed(2)} below 1.0 suggests potential liquidity concerns`
        });
        analysis.score -= 15;
      }
    }

    if (quickRatio) {
      if (quickRatio >= 1.0) {
        analysis.insights.push({
          type: 'positive',
          text: `Quick ratio of ${quickRatio.toFixed(2)} shows ability to meet short-term obligations without selling inventory`
        });
        analysis.score += 10;
      }
    }

    return analysis;
  }

  /**
   * Analyze leverage metrics
   */
  analyzeLeverage(metrics, industry) {
    const debtToEquity = metrics.totalDebt2EquityQuarterly || metrics.totalDebt2EquityAnnual;

    const analysis = {
      score: 50,
      insights: [],
      ratios: {
        debtToEquity: { value: debtToEquity, benchmark: industry.debtToEquity }
      }
    };

    if (debtToEquity !== null && debtToEquity !== undefined) {
      if (debtToEquity < industry.debtToEquity * 0.7) {
        analysis.insights.push({
          type: 'positive',
          text: `Conservative debt-to-equity ratio of ${debtToEquity.toFixed(2)} indicates low financial risk`
        });
        analysis.score += 15;
      } else if (debtToEquity > industry.debtToEquity * 1.5) {
        analysis.insights.push({
          type: 'negative',
          text: `High debt-to-equity ratio of ${debtToEquity.toFixed(2)} may indicate elevated financial risk`
        });
        analysis.score -= 15;
      } else {
        analysis.insights.push({
          type: 'neutral',
          text: `Debt-to-equity ratio of ${debtToEquity.toFixed(2)} is within reasonable range`
        });
      }
    }

    return analysis;
  }

  /**
   * Analyze dividend metrics
   */
  analyzeDividend(metrics) {
    const dividendYield = metrics.dividendYieldIndicatedAnnual;
    const dividendPerShare = metrics.dividendsPerShareTTM;

    const analysis = {
      score: 50,
      insights: [],
      ratios: {
        dividendYield: { value: dividendYield, benchmark: 3.0 },
        dividendPerShare: { value: dividendPerShare, benchmark: null }
      }
    };

    if (dividendYield) {
      if (dividendYield > 6) {
        analysis.insights.push({
          type: 'warning',
          text: `Very high dividend yield of ${dividendYield.toFixed(2)}% may be unsustainable or indicate stock price decline`
        });
        analysis.score -= 5;
      } else if (dividendYield >= 2 && dividendYield <= 6) {
        analysis.insights.push({
          type: 'positive',
          text: `Attractive dividend yield of ${dividendYield.toFixed(2)}% provides good income potential`
        });
        analysis.score += 10;
      } else if (dividendYield === 0) {
        analysis.insights.push({
          type: 'neutral',
          text: 'Company does not pay dividends, likely reinvesting profits for growth'
        });
      }
    }

    return analysis;
  }

  /**
   * Analyze growth metrics
   */
  analyzeGrowth(metrics) {
    const revenueGrowth = metrics.revenueGrowthTTMYoy;
    const epsGrowth = metrics.epsGrowthTTMYoy;

    const analysis = {
      score: 50,
      insights: [],
      ratios: {
        revenueGrowth: { value: revenueGrowth, benchmark: 10 },
        epsGrowth: { value: epsGrowth, benchmark: 10 }
      }
    };

    if (revenueGrowth) {
      if (revenueGrowth > 20) {
        analysis.insights.push({
          type: 'positive',
          text: `Strong revenue growth of ${revenueGrowth.toFixed(1)}% indicates expanding business`
        });
        analysis.score += 20;
      } else if (revenueGrowth < 0) {
        analysis.insights.push({
          type: 'negative',
          text: `Negative revenue growth of ${revenueGrowth.toFixed(1)}% shows declining business`
        });
        analysis.score -= 15;
      }
    }

    if (epsGrowth) {
      if (epsGrowth > 15) {
        analysis.insights.push({
          type: 'positive',
          text: `Excellent EPS growth of ${epsGrowth.toFixed(1)}% shows improving profitability`
        });
        analysis.score += 15;
      } else if (epsGrowth < -10) {
        analysis.insights.push({
          type: 'negative',
          text: `Declining EPS growth of ${epsGrowth.toFixed(1)}% indicates profitability challenges`
        });
        analysis.score -= 15;
      }
    }

    return analysis;
  }

  /**
   * Calculate overall fundamental score
   */
  calculateOverallScore(analysis) {
    const scores = [
      analysis.valuation.score,
      analysis.profitability.score,
      analysis.liquidity.score,
      analysis.leverage.score,
      analysis.dividend.score,
      analysis.growth.score
    ];

    const weights = [0.25, 0.25, 0.15, 0.15, 0.1, 0.1];
    const weightedScore = scores.reduce((sum, score, index) => sum + score * weights[index], 0);

    return {
      score: Math.round(Math.max(0, Math.min(100, weightedScore))),
      label: this.getScoreLabel(weightedScore),
      summary: this.generateOverallSummary(analysis)
    };
  }

  /**
   * Get industry benchmark
   */
  getIndustryBenchmark(industry) {
    const industryLower = industry?.toLowerCase() || '';
    
    if (industryLower.includes('technology') || industryLower.includes('software')) {
      return this.industryBenchmarks.technology;
    } else if (industryLower.includes('healthcare') || industryLower.includes('pharmaceutical')) {
      return this.industryBenchmarks.healthcare;
    } else if (industryLower.includes('financial') || industryLower.includes('bank')) {
      return this.industryBenchmarks.financial;
    }
    
    return this.industryBenchmarks.default;
  }

  /**
   * Get score label
   */
  getScoreLabel(score) {
    if (score >= 75) return { text: 'Excellent', color: '#059669' };
    if (score >= 60) return { text: 'Good', color: '#0891b2' };
    if (score >= 40) return { text: 'Fair', color: '#d97706' };
    return { text: 'Poor', color: '#dc2626' };
  }

  /**
   * Generate overall summary
   */
  generateOverallSummary(analysis) {
    const positives = [];
    const negatives = [];

    Object.values(analysis).forEach(category => {
      if (category && category.insights) {
        category.insights.forEach(insight => {
          if (insight.type === 'positive') positives.push(insight.text);
          if (insight.type === 'negative') negatives.push(insight.text);
        });
      }
    });

    let summary = '';
    if (positives.length > negatives.length) {
      summary = 'The company shows strong fundamental metrics with ';
    } else if (negatives.length > positives.length) {
      summary = 'The company faces some fundamental challenges with ';
    } else {
      summary = 'The company shows mixed fundamental signals with ';
    }

    return summary + `${positives.length} positive and ${negatives.length} concerning indicators.`;
  }
}

module.exports = new FundamentalAnalysisService();
