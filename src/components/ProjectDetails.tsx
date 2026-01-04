import React from 'react';
import { ArrowLeft, TrendingUp, Brain, Database, Code, BarChart3, Zap, Target, MessageSquare, Shield, Activity, Layers } from 'lucide-react';

interface ProjectDetailsProps {
  onClose?: () => void;
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 ${className}`}>
    {children}
  </span>
);

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Portfolio Project</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stock Dashboard
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed mb-8">
                Real-time financial analysis powered by AI sentiment and comprehensive market data
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  <TrendingUp className="w-3 h-3 mr-1" /> Live Market Data
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  <Brain className="w-3 h-3 mr-1" /> AI Sentiment Analysis
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  <Database className="w-3 h-3 mr-1" /> Financial APIs
                </Badge>
              </div>
            </div>

            {onClose && (
              <button 
                onClick={onClose} 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 rounded-lg text-sm font-medium transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to App
              </button>
            )}
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500/30 text-white border border-blue-400/30">React</Badge>
            <Badge className="bg-blue-500/30 text-white border border-blue-400/30">TypeScript</Badge>
            <Badge className="bg-blue-500/30 text-white border border-blue-400/30">Node.js</Badge>
            <Badge className="bg-blue-500/30 text-white border border-blue-400/30">Express</Badge>
            <Badge className="bg-blue-500/30 text-white border border-blue-400/30">Finnhub API</Badge>
            <Badge className="bg-blue-500/30 text-white border border-blue-400/30">Hugging Face</Badge>
            <Badge className="bg-blue-500/30 text-white border border-blue-400/30">Chart.js</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Project Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Project Vision</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              As a finance enthusiast, I built this dashboard to bridge the gap between quantitative financial analysis and real-world market sentiment. The goal was to create an intelligent tool that combines hard data with AI-powered insights to help investors make better-informed decisions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Key Innovation</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Unlike traditional stock dashboards, this platform integrates AI-driven sentiment analysis from news headlines with fundamental financial metrics, providing both the numbers and the narrative context that shapes market movements.
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600">Comprehensive tools for modern stock analysis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Live stock quotes, historical prices, and market metrics powered by Finnhub's comprehensive financial API.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Scoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent scoring algorithm that analyzes price trends, volatility, and fundamentals to provide actionable insights.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Sentiment</h3>
              <p className="text-gray-600 leading-relaxed">
                Hugging Face AI models analyze news headlines to gauge market sentiment and detect potential catalysts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fundamentals</h3>
              <p className="text-gray-600 leading-relaxed">
                Key financial ratios including P/E, ROE, Debt/Equity, and dividend yield for comprehensive company analysis.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">News Feed</h3>
              <p className="text-gray-600 leading-relaxed">
                Latest company news with sentiment badges to quickly understand market narratives and trending topics.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Robust error handling, data validation, and rate limiting ensure reliable and accurate information delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10 shadow-xl border border-gray-200 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Technical Implementation</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                API Integration & Data Flow
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Finnhub API:</strong> Fetch real-time stock quotes, historical data, company profiles, and news headlines with robust error handling and rate limiting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Hugging Face Inference API:</strong> Process news headlines through pre-trained sentiment models (BERT-based) to extract market mood indicators.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Data Enrichment:</strong> Combine multiple API responses, normalize data formats, and calculate derived metrics for a unified view.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Scoring Algorithm
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Price Trend Analysis:</strong> Evaluate 30-day price movements with weighted recent performance for momentum detection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Volatility Assessment:</strong> Calculate standard deviation and range to measure risk and stability profiles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Composite Scoring:</strong> Aggregate multiple factors into a 0-100 score with transparent breakdown for user understanding.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fundamental Calculations */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fundamental Calculations</h2>
            <p className="text-xl text-gray-600">Key financial metrics used to evaluate company performance and value</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P/E</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">P/E Ratio</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-blue-700">Price per share ÷ EPS.</strong> Indicates valuation relative to earnings. Lower values may suggest undervaluation, while higher values could indicate growth expectations or overvaluation.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ROE</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Return on Equity</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-green-700">Net income ÷ shareholders' equity.</strong> Reflects efficiency of capital use. Higher ROE indicates effective management and strong profitability relative to shareholder investment.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 shadow-md border border-orange-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D/E</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Debt/Equity Ratio</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-orange-700">Total debt ÷ equity.</strong> Higher values indicate higher leverage risk. Companies with high debt may face challenges during economic downturns but can amplify returns during growth.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DIV</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Dividend Yield</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-purple-700">Annual dividends ÷ price (as %).</strong> For income-focused evaluation. Higher yields attract income investors, but sustainable dividend policies are key to long-term value.
              </p>
            </div>
          </div>
        </div>

        {/* Key Learnings */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Learnings & Skills Demonstrated</h2>
            <p className="text-xl text-gray-600">Building this project deepened my expertise in finance and technology</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Markets & Analysis</h3>
              <p className="text-gray-700 leading-relaxed">
                Gained hands-on experience with fundamental metrics (P/E ratio, ROE, Debt/Equity), learned how different indicators interact, and understood that context (industry, peers, market conditions) is crucial for interpretation. This project strengthened my ability to analyze company financials beyond surface-level numbers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI & Machine Learning Integration</h3>
              <p className="text-gray-700 leading-relaxed">
                Implemented sentiment analysis using Hugging Face's transformer models, learned about model selection and bias, and discovered how qualitative data (news, sentiment) can complement quantitative metrics. Understood the importance of aggregation strategies and the limitations of pre-trained models on financial text.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Full-Stack Development</h3>
              <p className="text-gray-700 leading-relaxed">
                Built a complete application from scratch with React/TypeScript frontend and Node.js/Express backend. Implemented RESTful API design, state management, responsive UI/UX, and real-time data visualization. Learned to balance performance, user experience, and code maintainability.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Engineering & API Design</h3>
              <p className="text-gray-700 leading-relaxed">
                Mastered working with external APIs, handling rate limits, error scenarios, and data validation. Implemented caching strategies, request optimization, and graceful degradation. Learned to normalize and transform data from multiple sources into cohesive, user-friendly formats.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture & Workflow */}
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">System Architecture & Workflow</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">User Request</h3>
              <p className="text-gray-600 text-sm">
                User searches for a stock ticker. Frontend validates input and sends request to backend API endpoint.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Data Aggregation</h3>
              <p className="text-gray-600 text-sm">
                Backend fetches stock data from Finnhub, retrieves news, runs sentiment analysis via Hugging Face, and calculates scores.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Rich Display</h3>
              <p className="text-gray-600 text-sm">
                Frontend renders interactive charts, score breakdowns, fundamental metrics, and news with sentiment badges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
