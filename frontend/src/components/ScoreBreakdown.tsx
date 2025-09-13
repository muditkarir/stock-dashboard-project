import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreBreakdownProps {
  breakdown: Record<string, number>;
  className?: string;
}

// Detailed scoring methodology definitions
const SCORING_METHODOLOGY = {
  price: {
    name: "Price Performance",
    weight: "30%",
    description: "Measures recent price momentum and daily performance relative to previous close",
    calculation: "Based on daily change percentage with thresholds: >5% = 90pts, >2% = 80pts, >0% = 65pts, >-2% = 35pts, >-5% = 20pts, else 10pts",
    rationale: "Strong positive price movement indicates investor confidence and bullish sentiment. This is the highest weighted factor as price action often leads fundamental changes.",
    keyMetrics: ["Daily % Change", "Price vs Previous Close", "Intraday Performance"],
    goodRange: "65+ points (positive daily performance)"
  },
  momentum: {
    name: "Intraday Momentum",
    weight: "25%", 
    description: "Evaluates current price position within the day's trading range",
    calculation: "Position in Range = (Current Price - Daily Low) / (Daily High - Daily Low) × 100. Higher position indicates stronger buying pressure.",
    rationale: "A stock trading near daily highs suggests strong buying interest and bullish momentum. This technical indicator helps identify short-term strength.",
    keyMetrics: ["Price Position in Daily Range", "Buying vs Selling Pressure", "Intraday Trend Direction"],
    goodRange: "70+ points (trading in upper 70% of daily range)"
  },
  volatility: {
    name: "Volatility Assessment",
    weight: "20%",
    description: "Measures price stability using daily range as percentage of previous close (inverse scoring - lower volatility = higher score)",
    calculation: "Volatility % = (Daily High - Daily Low) / Previous Close × 100. Score decreases as volatility increases: <1% = 80pts, <2% = 70pts, <3% = 60pts, <5% = 40pts, <8% = 25pts, else 10pts",
    rationale: "Lower volatility indicates stability and reduced investment risk. Excessive volatility can signal uncertainty or manipulation, making the investment less predictable.",
    keyMetrics: ["Daily Range %", "Price Stability", "Risk Assessment"],
    goodRange: "60+ points (volatility under 3%)"
  },
  market: {
    name: "Market Capitalization",
    weight: "15%",
    description: "Assesses company size and market stability based on market capitalization tiers",
    calculation: "Market cap tiers: >$10B (Large Cap) = 80pts, $2B-10B (Mid Cap) = 65pts, $300M-2B (Small Cap) = 45pts, <$300M (Micro Cap) = 30pts",
    rationale: "Larger companies typically offer more stability, liquidity, and institutional coverage. Market cap classification helps assess risk profile and growth potential.",
    keyMetrics: ["Total Market Value", "Company Size Tier", "Institutional Interest"],
    goodRange: "65+ points (Mid to Large Cap companies)"
  },
  trend: {
    name: "Historical Trend",
    weight: "10%",
    description: "Analyzes medium-term price trend by comparing recent vs historical price averages",
    calculation: "Compares 5-day recent average vs 5-day average from 15-20 days ago. Trend strength determines score: >20% improvement = 90pts, >10% = 75pts, >5% = 65pts, declining trends score lower",
    rationale: "Historical trend analysis reveals underlying business momentum and investor sentiment evolution. Consistent upward trends indicate sustained business improvement.",
    keyMetrics: ["20-Day Trend Analysis", "Price Momentum Direction", "Trend Consistency"],
    goodRange: "65+ points (positive trend over 20-day period)"
  }
};

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown, className = '' }) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 40) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-4 h-4" />;
    if (score >= 40) return <Activity className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const formatScoreLabel = (key: string) => {
    const methodology = SCORING_METHODOLOGY[key as keyof typeof SCORING_METHODOLOGY];
    return methodology?.name || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className={`${className}`}>
      {/* Main Score Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-semibold text-gray-700">Quantitative Analysis Breakdown:</p>
            <div title="Click a metric to see how it's calculated and why it matters" className="inline-flex items-center">
              <Info className="w-4 h-4 text-gray-400 ml-1" />
            </div>
          </div>
          <button
            onClick={() => setExpandedDetails(!expandedDetails)}
            className="flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            {expandedDetails ? 'Hide' : 'Show'} Methodology
            {expandedDetails ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mb-2">
          💡 <strong>Tip:</strong> Click on any metric below to see detailed calculation explanations and financial reasoning
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(breakdown).map(([key, value]) => (
            value !== null && (
              <div 
                key={key} 
                className={`relative p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
                  selectedMetric === key ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${getScoreColor(value)} group`}
                onClick={() => setSelectedMetric(selectedMetric === key ? null : key)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    {getScoreIcon(value)}
                    <span className="text-xs font-medium">{formatScoreLabel(key)}</span>
                    <Info className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-bold">{value}/100</span>
                </div>
                <div className="text-xs opacity-75">
                  Weight: {SCORING_METHODOLOGY[key as keyof typeof SCORING_METHODOLOGY]?.weight || 'N/A'}
                </div>
                <div className="text-xs opacity-60 mt-1 truncate">
                  {SCORING_METHODOLOGY[key as keyof typeof SCORING_METHODOLOGY]?.description.substring(0, 40)}...
                </div>
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Selected Metric Details */}
      {selectedMetric && SCORING_METHODOLOGY[selectedMetric as keyof typeof SCORING_METHODOLOGY] && (
        <div className="mt-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Info className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-base font-bold text-blue-900">
                {SCORING_METHODOLOGY[selectedMetric as keyof typeof SCORING_METHODOLOGY].name} Deep Dive
              </h4>
            </div>
            <button
              onClick={() => setSelectedMetric(null)}
              className="text-blue-600 hover:text-blue-800 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="font-semibold text-blue-800 text-sm mb-2">📊 What This Measures:</p>
                <p className="text-sm text-blue-700">{SCORING_METHODOLOGY[selectedMetric as keyof typeof SCORING_METHODOLOGY].description}</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="font-semibold text-blue-800 text-sm mb-2">🔢 Calculation Formula:</p>
                <div className="font-mono bg-blue-50 p-3 rounded text-sm text-blue-900 border border-blue-200">
                  {SCORING_METHODOLOGY[selectedMetric as keyof typeof SCORING_METHODOLOGY].calculation}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="font-semibold text-blue-800 text-sm mb-2">💡 Why This Matters:</p>
                <p className="text-sm text-blue-700">{SCORING_METHODOLOGY[selectedMetric as keyof typeof SCORING_METHODOLOGY].rationale}</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="font-semibold text-blue-800 text-sm mb-2">📈 Key Factors Analyzed:</p>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {SCORING_METHODOLOGY[selectedMetric as keyof typeof SCORING_METHODOLOGY].keyMetrics.map((metric, index) => (
                    <li key={index}>{metric}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800 text-sm mb-1">🎯 Optimal Performance:</p>
                <p className="text-sm text-green-700">{SCORING_METHODOLOGY[selectedMetric as keyof typeof SCORING_METHODOLOGY].goodRange}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Metric Selected Guide */}
      {!selectedMetric && (
        <div className="mt-4 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <div className="flex justify-center mb-2">
            <Info className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">Ready to Explore?</p>
          <p className="text-xs text-gray-500">Click on any metric tile above to see detailed calculation methods, financial reasoning, and interpretation guidelines.</p>
        </div>
      )}

      {/* Expanded Methodology */}
      {expandedDetails && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Multi-Factor Quantitative Scoring Framework
          </h4>
          
          <div className="space-y-4 text-xs text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold text-gray-800 mb-2">📊 Scoring Philosophy</h5>
                <p>Our internal scoring system combines technical analysis, market dynamics, and risk assessment to provide a comprehensive 0-100 investment score. Each factor is weighted based on its predictive power and market relevance.</p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h5 className="font-semibold text-gray-800 mb-2">⚖️ Weighted Average Calculation</h5>
                <p>Final Score = (Price×30% + Momentum×25% + Volatility×20% + Market×15% + Trend×10%) normalized to 100-point scale. Missing data points are excluded with weight redistribution.</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold text-gray-800 mb-2">🎯 Score Interpretation Guide</h5>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-700">70-100</div>
                  <div className="text-green-600">Strong Buy</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="font-medium text-yellow-700">40-69</div>
                  <div className="text-yellow-600">Hold/Watch</div>
                </div>
                <div className="text-center p-2 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-700">0-39</div>
                  <div className="text-red-600">Weak/Avoid</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold text-gray-800 mb-2">⚠️ Risk Considerations</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Scores reflect current market conditions and may change rapidly</li>
                <li>High volatility stocks may show lower scores despite growth potential</li>
                <li>Market cap bias favors established companies over growth stocks</li>
                <li>Technical analysis complements but doesn't replace fundamental research</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBreakdown;
