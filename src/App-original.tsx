import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ProjectDetails from './components/ProjectDetails';
import StockSearch from './components/StockSearch';
import StockCard from './components/StockCard';
import StockChart from './components/StockChart';
import FundamentalAnalysis from './components/FundamentalAnalysis';
import NewsAndSentiment from './components/NewsAndSentiment';
import { StockService } from './services/api';
import { StockData, LoadingState } from './types';
import { AlertCircle, TrendingUp, BarChart3, Globe, Shield } from 'lucide-react';

function App() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });
  const [showAbout, setShowAbout] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  const handleStockSelect = useCallback(async (symbol: string) => {
    setLoadingState({ isLoading: true, error: null });
    setStockData(null);

    try {
      console.log(`🔍 Fetching data for ${symbol}...`);
      const data = await StockService.getStockData(symbol);
      console.log(`✅ Data received for ${symbol}:`, data);
      setStockData(data);
    } catch (error) {
      console.error(`❌ Error fetching data for ${symbol}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stock data';
      setLoadingState({ isLoading: false, error: errorMessage });
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleAboutClick = () => {
    setShowAbout(true);
  };

  const handleProjectDetailsClick = () => {
    setShowProjectDetails(true);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAboutClick={handleAboutClick} onProjectDetailsClick={handleProjectDetailsClick} />

      {showProjectDetails ? (
        <ProjectDetails onClose={() => setShowProjectDetails(false)} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Smart Stock Analysis Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get real-time stock data, professional analysis, and smart scoring for informed investment decisions.
            Powered by Finnhub's comprehensive market data.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <StockSearch 
            onStockSelect={handleStockSelect}
            isLoading={loadingState.isLoading}
          />
        </div>

        {/* Loading State */}
        {loadingState.isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></div>
              <p className="text-gray-600">Loading stock data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {loadingState.error && (
          <div className="card p-6 border-red-200 bg-red-50 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  Error Loading Stock Data
                </h3>
                <p className="text-red-700 mt-1">
                  {loadingState.error}
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Please check the stock symbol and try again. Make sure you're entering a valid ticker symbol (e.g., AAPL, MSFT, GOOGL).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stock Data Display */}
        {stockData && !loadingState.isLoading && (
          <div className="space-y-6">
            {/* Stock Card */}
            <StockCard stockData={stockData} />

            {/* Chart (Full Width) */}
            {stockData.historical && (
              <StockChart 
                symbol={stockData.symbol}
                historicalData={stockData.historical}
              />
            )}

            {/* Fundamental Analysis and News & Sentiment (Side by Side) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fundamental Analysis */}
              {stockData.fundamentals && (
                <FundamentalAnalysis 
                  symbol={stockData.symbol}
                  fundamentals={stockData.fundamentals}
                />
              )}

              {/* News & Sentiment Analysis */}
              <NewsAndSentiment 
                symbol={stockData.symbol}
              />
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!stockData && !loadingState.isLoading && !loadingState.error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
                  <TrendingUp className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Analyze Stocks
              </h2>
              <p className="text-gray-600 mb-6">
                Search for any stock ticker above to get started with real-time data, 
                professional analysis, and smart scoring.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Smart Scoring</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Secure API</span>
                </div>
              </div>
            </div>
          </div>
        )}
  </main>
  )}

  {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">About Stock Dashboard</h2>
                <button
                  onClick={handleCloseAbout}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Stock Dashboard</strong> is a professional web application that provides 
                  real-time stock market data, analysis, and smart scoring to help users make 
                  informed investment decisions.
                </p>

                <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Real-time Stock Data:</strong> Get current prices, daily changes, and key metrics</li>
                  <li><strong>Smart Scoring System:</strong> AI-powered analysis provides scores from 0-100</li>
                  <li><strong>Interactive Charts:</strong> Visualize price trends over the last 30 days</li>
                  <li><strong>Company Information:</strong> Access detailed company profiles and metrics</li>
                  <li><strong>Mobile Responsive:</strong> Works perfectly on desktop and mobile devices</li>
                  <li><strong>Secure API Integration:</strong> Safe and reliable data from Finnhub</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">How Scoring Works</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span><strong>Strong (70-100):</strong> Positive indicators across multiple metrics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span><strong>Moderate (40-69):</strong> Mixed signals, worth monitoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span><strong>Weak (0-39):</strong> Multiple concerning indicators</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">Technology Stack</h3>
                <p>
                  Built with modern web technologies including React, TypeScript, Tailwind CSS, 
                  Node.js, and Express. Data is sourced from Finnhub's comprehensive stock API 
                  with secure webhook support for real-time updates.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Disclaimer</h4>
                  <p className="text-yellow-800 text-sm">
                    This dashboard is for informational purposes only and should not be considered 
                    as financial advice. Always conduct your own research and consult with financial 
                    professionals before making investment decisions.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>Powered by Finnhub Stock API</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span>Sentiment via Hugging Face Inference API</span>
                    </div>
                  <button
                    onClick={handleCloseAbout}
                    className="btn-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
  {/* project details rendered above as full page when active */}
    </div>
  );
}

export default App;
