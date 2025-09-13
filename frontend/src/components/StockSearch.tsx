import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { StockService } from '../services/api';
import { SearchResult } from '../types';

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
  isLoading: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ onStockSelect, isLoading }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular stocks to show when no search
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  ];

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setError(null);
      return;
    }

    if (query.length < 2) return;

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);
        setError(null);
        const searchResults = await StockService.searchStocks(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStockSelect = (symbol: string) => {
    setQuery(symbol);
    setShowResults(false);
    onStockSelect(symbol);
    inputRef.current?.blur();
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults(null);
    setError(null);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (query.length >= 2 && results) {
      setShowResults(true);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Search stocks (e.g., AAPL, Tesla)"
          disabled={isLoading}
          className="input-field pl-10 pr-10 py-3 text-lg"
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="loading-spinner" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          {error && (
            <div className="p-4 text-sm text-red-600">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {!error && results && results.result && results.result.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                Search Results ({results.count} found)
              </div>
              {results.result.slice(0, 10).map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock.symbol)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {stock.description}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {stock.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!error && results && results.result && results.result.length === 0 && (
            <div className="p-4 text-sm text-gray-600 text-center">
              <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              No stocks found for "{query}"
            </div>
          )}

          {!query && !error && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Popular Stocks</span>
                </div>
              </div>
              {popularStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock.symbol)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stock.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
