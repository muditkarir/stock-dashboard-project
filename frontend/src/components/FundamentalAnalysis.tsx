import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, BarChart3, Activity } from 'lucide-react';
import { FundamentalAnalysis as FundamentalAnalysisType, MetricDefinition } from '../types';
import Tooltip from './Tooltip';

interface FundamentalAnalysisProps {
  symbol: string;
  fundamentals: FundamentalAnalysisType;
  className?: string;
}

// Metric definitions for tooltips
const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
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
  revenueGrowth: {
    name: "Revenue Growth",
    description: "Year-over-year percentage change in company's total revenue.",
    formula: "(Current Revenue - Previous Revenue) ÷ Previous Revenue × 100",
    goodRange: "5-20% annually"
  }
};

const FundamentalAnalysis: React.FC<FundamentalAnalysisProps> = ({ 
  symbol, 
  fundamentals, 
  className = '' 
}) => {
  if (!fundamentals) {
    return (
      <div className={`card p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fundamental Analysis
        </h3>
        <p className="text-gray-600">
          Fundamental data not available for {symbol}
        </p>
      </div>
    );
  }

  const formatValue = (value: number | null, type: string = 'number'): string => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'ratio':
        return value.toFixed(2);
      case 'currency':
        return `$${value.toFixed(2)}`;
      case 'growth':
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
      default:
        return value.toFixed(2);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'valuation':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'profitability':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'liquidity':
        return <Activity className="w-5 h-5 text-purple-600" />;
      case 'leverage':
        return <BarChart3 className="w-5 h-5 text-orange-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className={`card p-6 ${className}`}>
      {/* Header with Overall Score */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Fundamental Analysis
        </h3>
        <div className="text-center">
          <div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${fundamentals.overall.label.color}20`,
              color: fundamentals.overall.label.color 
            }}
          >
            {fundamentals.overall.score}/100 • {fundamentals.overall.label.text}
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm">{fundamentals.overall.summary}</p>
      </div>

      {/* Key Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">P/E Ratio</span>
            <Tooltip title={METRIC_DEFINITIONS.peRatio.name} {...METRIC_DEFINITIONS.peRatio} />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatValue(fundamentals.keyRatios.peRatio, 'ratio')}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">P/B Ratio</span>
            <Tooltip title={METRIC_DEFINITIONS.pbRatio.name} {...METRIC_DEFINITIONS.pbRatio} />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatValue(fundamentals.keyRatios.pbRatio, 'ratio')}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">ROE</span>
            <Tooltip title={METRIC_DEFINITIONS.roe.name} {...METRIC_DEFINITIONS.roe} />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatValue(fundamentals.keyRatios.roe, 'percentage')}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">EPS</span>
            <Tooltip title={METRIC_DEFINITIONS.eps.name} {...METRIC_DEFINITIONS.eps} />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatValue(fundamentals.keyRatios.eps, 'currency')}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Debt/Equity</span>
            <Tooltip title={METRIC_DEFINITIONS.debtToEquity.name} {...METRIC_DEFINITIONS.debtToEquity} />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatValue(fundamentals.keyRatios.debtToEquity, 'ratio')}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Dividend Yield</span>
            <Tooltip title={METRIC_DEFINITIONS.dividendYield.name} {...METRIC_DEFINITIONS.dividendYield} />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatValue(fundamentals.keyRatios.dividendYield, 'percentage')}
          </div>
        </div>
      </div>

      {/* Analysis Categories */}
      <div className="space-y-6">
        {/* Valuation */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center mb-3">
            {getCategoryIcon('valuation')}
            <h4 className="ml-2 text-lg font-semibold text-gray-900">Valuation</h4>
            <span className="ml-auto text-sm text-gray-500">
              Score: {fundamentals.valuation.score}/100
            </span>
          </div>
          <div className="space-y-2">
            {fundamentals.valuation.insights.map((insight, index) => (
              <div 
                key={index} 
                className={`flex items-start p-3 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="mr-2 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <p className="text-sm">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profitability */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center mb-3">
            {getCategoryIcon('profitability')}
            <h4 className="ml-2 text-lg font-semibold text-gray-900">Profitability</h4>
            <span className="ml-auto text-sm text-gray-500">
              Score: {fundamentals.profitability.score}/100
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Profit Margin:</span>
              <span className="font-medium">{formatValue(fundamentals.keyRatios.profitMargin, 'percentage')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ROA:</span>
              <span className="font-medium">{formatValue(fundamentals.keyRatios.roa, 'percentage')}</span>
            </div>
          </div>
          <div className="space-y-2">
            {fundamentals.profitability.insights.map((insight, index) => (
              <div 
                key={index} 
                className={`flex items-start p-3 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="mr-2 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <p className="text-sm">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Liquidity & Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
          <div>
            <div className="flex items-center mb-3">
              {getCategoryIcon('liquidity')}
              <h4 className="ml-2 text-lg font-semibold text-gray-900">Liquidity</h4>
              <span className="ml-auto text-sm text-gray-500">
                Score: {fundamentals.liquidity.score}/100
              </span>
            </div>
            <div className="mb-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Ratio:</span>
                <span className="font-medium">{formatValue(fundamentals.keyRatios.currentRatio, 'ratio')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quick Ratio:</span>
                <span className="font-medium">{formatValue(fundamentals.keyRatios.quickRatio, 'ratio')}</span>
              </div>
            </div>
            <div className="space-y-2">
              {fundamentals.liquidity.insights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`flex items-start p-2 rounded text-xs border ${getInsightColor(insight.type)}`}
                >
                  <div className="mr-1 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <p>{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="ml-2 text-lg font-semibold text-gray-900">Growth</h4>
              <span className="ml-auto text-sm text-gray-500">
                Score: {fundamentals.growth.score}/100
              </span>
            </div>
            <div className="mb-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue Growth:</span>
                <span className="font-medium">{formatValue(fundamentals.keyRatios.revenueGrowth, 'growth')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">EPS Growth:</span>
                <span className="font-medium">{formatValue(fundamentals.keyRatios.epsGrowth, 'growth')}</span>
              </div>
            </div>
            <div className="space-y-2">
              {fundamentals.growth.insights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`flex items-start p-2 rounded text-xs border ${getInsightColor(insight.type)}`}
                >
                  <div className="mr-1 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <p>{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundamentalAnalysis;
