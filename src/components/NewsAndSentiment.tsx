import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { StockService } from '../services/api';

interface NewsArticle {
  id: string | number;
  headline: string;
  summary?: string;
  url?: string;
  datetime: string;
  source: string;
  sentiment: {
    label: 'positive' | 'negative' | 'neutral';
    score: number;
    error?: string;
  };
}

interface SentimentSummary {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  overall: 'positive' | 'negative' | 'neutral';
  summary: string;
  percentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface NewsAndSentimentProps {
  symbol: string;
  className?: string;
}

const NewsAndSentiment: React.FC<NewsAndSentimentProps> = ({ symbol, className = '' }) => {
  const [newsData, setNewsData] = useState<{
    news: NewsArticle[];
    sentiment: SentimentSummary;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllNews, setShowAllNews] = useState(false);

  useEffect(() => {
    const fetchNewsAndSentiment = async () => {
      if (!symbol) return;

      setLoading(true);
      setError(null);

      try {
        const data = await StockService.getNewsAndSentiment(symbol, 7);
        setNewsData({
          news: data.news || [],
          sentiment: data.sentiment
        });

      } catch (err) {
        console.error('Error fetching news and sentiment:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsAndSentiment();
  }, [symbol]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow border ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">News & Sentiment</h3>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow border ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">News & Sentiment</h3>
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  const { news, sentiment } = newsData || { news: [], sentiment: null };

  return (
    <div className={`bg-white p-6 rounded-lg shadow border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">News & Sentiment</h3>
        <div className="text-xs text-gray-500">Last 7 days</div>
      </div>

      {/* Sentiment Summary */}
      {sentiment && sentiment.total > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {getSentimentIcon(sentiment.overall)}
            <span className={`text-sm font-medium capitalize ${sentiment.overall === 'positive' ? 'text-green-600' : sentiment.overall === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
              {sentiment.overall} Overall
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{sentiment.summary}</p>
          
          {/* Sentiment Breakdown */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{sentiment.positive} Positive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>{sentiment.neutral} Neutral</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>{sentiment.negative} Negative</span>
            </div>
          </div>
        </div>
      )}

      {/* News Headlines */}
      <div className="space-y-4">
        {news.length > 0 ? (
          news.slice(0, showAllNews ? news.length : 5).map((article) => (
            <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  {getSentimentIcon(article.sentiment.label)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                      {article.headline}
                    </h4>
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getSentimentColor(article.sentiment.label)}`}>
                      {article.sentiment.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.datetime)}
                    </div>
                    {article.source && (
                      <span className="text-xs text-gray-500">• {article.source}</span>
                    )}
                  </div>

                  {article.sentiment.error && (
                    <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Sentiment analysis unavailable
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">No recent news found for {symbol}</div>
            <div className="text-xs mt-1">Try checking back later</div>
          </div>
        )}
      </div>

      {news.length > 5 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={() => setShowAllNews(!showAllNews)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {showAllNews 
              ? '← Show less' 
              : `View ${news.length - 5} more articles →`
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsAndSentiment;
