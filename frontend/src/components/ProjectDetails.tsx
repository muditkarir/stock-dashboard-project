import React from 'react';
import { X } from 'lucide-react';

interface ProjectDetailsProps {
  onClose?: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project — Stock Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">A concise overview: architecture, data flow, scoring logic, and financial analysis highlights.</p>
          </div>
          <div>
            {onClose && (
              <button onClick={onClose} className="px-3 py-2 bg-white border rounded shadow text-gray-700">Back to dashboard</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Project summary</h2>
            <p className="text-sm text-gray-700 mb-2">This is a full-stack dashboard that fetches live market data, computes quantitative scores and financial ratios, and presents them in a clean, recruiter-friendly interface.</p>

            <h3 className="font-semibold mt-4">What it allows users to do</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>Search for tickers and view company profiles and market quotes</li>
              <li>Explore interactive historical charts and price performance</li>
              <li>View a multi-factor Analysis Score with component-level explanations</li>
              <li>Inspect Fundamental Analysis ratios with formulas and interpretations</li>
            </ul>
          </div>

          <aside className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Tech stack & APIs</h3>
            <p className="text-sm text-gray-700">React, TypeScript, Tailwind CSS, Node.js, Express, Chart.js. Data via Finnhub API.</p>
            <h4 className="font-semibold mt-4">Highlights</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>Realtime quotes and webhooks</li>
              <li>Defensible scoring logic with clear weights</li>
              <li>Fundamental ratio extractor and explainers</li>
            </ul>
          </aside>
        </div>

        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Scoring logic (simple explanation)</h3>
          <p className="text-sm text-gray-700 mb-2">The Analysis Score is a weighted average of multiple quantitative components: Price (30%), Momentum (25%), Volatility (20%), Market cap (15%), and Trend (10%). Each component is normalized to a 0-100 scale using clear thresholds. Missing data points are excluded and weights are redistributed proportionally.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold">Price Performance</h4>
              <p className="text-sm text-gray-700">Uses daily percent change with thresholds. E.g., &gt;5% day gain → 90 points, &gt;2% → 80 points, 0-2% → 65 points, etc.</p>
            </div>
            <div>
              <h4 className="font-semibold">Momentum</h4>
              <p className="text-sm text-gray-700">Position in day's trading range: (current - low)/(high - low) × 100. Higher values indicate stronger buying pressure.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Fundamental analysis (how ratios are calculated)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">P/E Ratio</h4>
              <p className="text-sm text-gray-700">Price per share ÷ Earnings per share. Shows market valuation relative to earnings.</p>
            </div>
            <div>
              <h4 className="font-semibold">ROE</h4>
              <p className="text-sm text-gray-700">Net income ÷ Shareholders' equity. Measures profitability vs capital invested.</p>
            </div>
            <div>
              <h4 className="font-semibold">Debt/Equity</h4>
              <p className="text-sm text-gray-700">Total debt ÷ shareholders' equity. Indicates leverage and financial risk.</p>
            </div>
            <div>
              <h4 className="font-semibold">Dividend Yield</h4>
              <p className="text-sm text-gray-700">Annual dividends per share ÷ price per share (as %). Useful for income-focused investors.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Data flow & architecture</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
            <li>Frontend calls backend API to request stock data (quote, historical, profile)</li>
            <li>Backend fetches raw data from Finnhub, computes scores and fundamental ratios</li>
            <li>Backend returns normalized JSON which frontend renders in charts and score components</li>
            <li>Webhooks provide near-realtime updates for critical events</li>
          </ol>
        </section>

        <section className="text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Notes for reviewers</h3>
          <p>See the source code for the detailed scoring functions and fundamental analysis service (backend/src/services).</p>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetails;
