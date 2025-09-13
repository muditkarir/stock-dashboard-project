import React from 'react';
import { TrendingUp, TrendingDown, Minus, Building, Calendar, Globe } from 'lucide-react';
import { StockData } from '../types';
import ScoreBreakdown from './ScoreBreakdown';

interface StockCardProps {
  stockData: StockData;
}

const StockCard: React.FC<StockCardProps> = ({ stockData }) => {
  const { symbol, quote, profile, scoring } = stockData;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}T`;
    } else {
      return `$${marketCap.toFixed(1)}B`;
    }
  };

  const getPriceChangeIcon = () => {
    if (quote.dp > 0) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    } else if (quote.dp < 0) {
      return <TrendingDown className="w-5 h-5 text-red-600" />;
    } else {
      return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriceChangeColor = () => {
    if (quote.dp > 0) return 'text-green-600';
    if (quote.dp < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 70) return 'score-strong';
    if (score >= 40) return 'score-moderate';
    return 'score-weak';
  };

  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {profile?.logo && (
            <img
              src={profile.logo}
              alt={`${symbol} logo`}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{symbol}</h2>
            {profile?.name && (
              <p className="text-sm text-gray-600 max-w-xs truncate">
                {profile.name}
              </p>
            )}
          </div>
        </div>

        {/* Stock Score */}
        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getScoreColorClass(scoring.score)}`}>
          <div className="flex items-center space-x-2">
            <span>{scoring.score}/100</span>
            <span className="hidden sm:inline">• {scoring.label}</span>
          </div>
        </div>
      </div>

      {/* Price Information */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Current Price</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(quote.c)}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-600">Change</p>
          <div className={`flex items-center space-x-1 ${getPriceChangeColor()}`}>
            {getPriceChangeIcon()}
            <span className="text-lg font-semibold">
              {formatPrice(quote.d)}
            </span>
            <span className="text-sm">
              ({formatPercent(quote.dp)})
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-600">Day Range</p>
          <p className="text-lg font-medium text-gray-900">
            {formatPrice(quote.l)} - {formatPrice(quote.h)}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-600">Previous Close</p>
          <p className="text-lg font-medium text-gray-900">
            {formatPrice(quote.pc)}
          </p>
        </div>
      </div>

      {/* Company Information */}
      {profile && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {profile.marketCapitalization && (
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Market Cap:</span>
                <span className="font-medium text-gray-900">
                  {formatMarketCap(profile.marketCapitalization)}
                </span>
              </div>
            )}

            {profile.ipo && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">IPO:</span>
                <span className="font-medium text-gray-900">
                  {new Date(profile.ipo).getFullYear()}
                </span>
              </div>
            )}

            {profile.exchange && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Exchange:</span>
                <span className="font-medium text-gray-900">
                  {profile.exchange}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scoring Details */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Score</h3>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColorClass(scoring.score)}`}>
            {scoring.recommendation.action}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          {scoring.explanation}
        </p>

        <p className="text-sm text-gray-700">
          <strong>Recommendation:</strong> {scoring.recommendation.description}
        </p>

        {/* Score Breakdown */}
        {Object.keys(scoring.breakdown).length > 0 && (
          <div className="mt-4">
            <ScoreBreakdown breakdown={scoring.breakdown} />
          </div>
        )}
      </div>

      {/* Website Link */}
      {profile?.weburl && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <a
            href={profile.weburl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <Globe className="w-4 h-4 mr-1" />
            Visit Company Website
          </a>
        </div>
      )}
    </div>
  );
};

export default StockCard;
