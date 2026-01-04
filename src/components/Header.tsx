import React from 'react';
import { BarChart3 } from 'lucide-react';

interface HeaderProps {
  onAboutClick: () => void;
  onProjectDetailsClick?: () => void;
  onAppClick?: () => void;
  activeTab?: 'app' | 'projectDetails' | 'about' | null;
}

const Header: React.FC<HeaderProps> = ({ onAboutClick, onProjectDetailsClick, onAppClick, activeTab }) => {
  return (
    <header className="bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Stock Dashboard
              </h1>
              <p className="text-xs text-blue-600 font-medium">
                Smart Market Analysis
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onAppClick && onAppClick()}
              className={`transition-colors duration-200 font-medium ${
                activeTab === 'app' 
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              App
            </button>
            <button
              onClick={() => onProjectDetailsClick && onProjectDetailsClick()}
              className={`transition-colors duration-200 font-medium ${
                activeTab === 'projectDetails' 
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Project details
            </button>
            <button
              onClick={onAboutClick}
              className={`transition-colors duration-200 font-medium ${
                activeTab === 'about' 
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About
            </button>
            <a
              href="https://www.linkedin.com/in/mudit-karir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Mudit on LinkedIn
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50">
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
