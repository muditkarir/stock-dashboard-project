import React from 'react';
import { BarChart3 } from 'lucide-react';

interface HeaderProps {
  onAboutClick: () => void;
  onProjectDetailsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAboutClick, onProjectDetailsClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Stock Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Smart Market Analysis
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onProjectDetailsClick && onProjectDetailsClick()}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Project details
            </button>
            <button
              onClick={onAboutClick}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              About
            </button>
            <a
              href="https://finnhub.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Data by Finnhub
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
