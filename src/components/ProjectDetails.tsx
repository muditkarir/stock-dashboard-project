import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProjectDetailsProps {
  onClose?: () => void;
}

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
    {children}
  </span>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-xs font-medium text-indigo-700">
    {children}
  </span>
);

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans text-base leading-7 text-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-8 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900">Stock Dashboard</h1>
            <p className="text-base text-gray-600 max-w-2xl mt-2">A polished, data-driven dashboard combining live market data, explainable scoring, and news-driven context to help investors prioritize research.</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge>React</Badge>
              <Badge>TypeScript</Badge>
              <Badge>Tailwind</Badge>
              <Badge>Node.js</Badge>
              <Badge>Finnhub</Badge>
              <Badge>Hugging Face</Badge>
            </div>
          </div>

          <div className="shrink-0">
            {onClose && (
              <button onClick={onClose} className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow rounded-md text-sm text-gray-700">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="md:flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
              <p className="text-gray-600 mt-2">Integrates market data, fundamental calculations, quant scoring, and a news + AI sentiment layer to give both numeric and narrative context for tickers.</p>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Project Motivation</h3>
                  <p className="text-base text-gray-700 mt-2">As a finance undergraduate, my goal was to bridge quantitative analysis with real-world market context. I wanted to create a dashboard that not only presents financial ratios and scores, but also interprets the market’s current narrative through news and sentiment.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Pill>Live quotes</Pill>
              <Pill>Fundamentals</Pill>
              <Pill>Sentiment</Pill>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <main className="lg:col-span-2 space-y-8">
            <section className="rounded-2xl p-6 bg-gradient-to-r from-white via-gray-50 to-white shadow border">
              <h3 className="text-xl font-semibold">Key Goals</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h4 className="font-medium">Fast insights</h4>
                  <p className="text-base text-gray-700 mt-1">Show the most actionable signals quickly with clear scoring and visual cues.</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h4 className="font-medium">Explainability</h4>
                  <p className="text-base text-gray-700 mt-1">Break down composite scores so users understand what drives each rating.</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h4 className="font-medium">Narrative context</h4>
                  <p className="text-base text-gray-700 mt-1">Augment numbers with recent news and AI-derived sentiment to highlight catalysts and risks.</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h4 className="font-medium">Recruiter-ready demo</h4>
                  <p className="text-base text-gray-700 mt-1">Clean UX, focused technical choices, and clear tradeoffs to showcase your engineering judgment.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow border">
              <h3 className="text-2xl font-semibold">Fundamental Calculations</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">P/E Ratio</h4>
                  <p className="text-base text-gray-700">Price per share ÷ EPS. Indicates valuation relative to earnings.</p>
                </div>
                <div>
                  <h4 className="font-medium">ROE</h4>
                  <p className="text-base text-gray-700">Net income ÷ shareholders' equity. Reflects efficiency of capital use.</p>
                </div>
                <div>
                  <h4 className="font-medium">Debt/Equity</h4>
                  <p className="text-base text-gray-700">Total debt ÷ equity. Higher values indicate higher leverage risk.</p>
                </div>
                <div>
                  <h4 className="font-medium">Dividend Yield</h4>
                  <p className="text-base text-gray-700">Annual dividends ÷ price (as %). For income-focused evaluation.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow border">
              <h3 className="text-2xl font-semibold">News & Sentiment — How it works</h3>
              <p className="text-gray-600 mt-3">A concise walkthrough showing how news is fetched, analyzed, and surfaced in the UI.</p>

              <ol className="list-decimal list-inside text-sm text-gray-700 mt-4 space-y-3">
                <li><strong>Fetch headlines:</strong> Backend uses Finnhub's Company News API to retrieve recent headlines for the selected ticker and window.</li>
                <li><strong>Clean & filter:</strong> Deduplicate and normalize headlines; drop low-relevance items.</li>
                <li><strong>Run sentiment:</strong> Send headlines to Hugging Face Inference API (example model: <code>nlptown/bert-base-multilingual-uncased-sentiment</code>) for per-headline sentiment.</li>
                <li><strong>Aggregate:</strong> Map labels to numeric scores and compute counts and a weighted average to summarize market tone.</li>
                <li><strong>Surface:</strong> Frontend shows per-headline badges, short excerpts, and an aggregated summary so recruiters and users see both narrative and score at a glance.</li>
              </ol>

              <p className="text-xs text-gray-500 mt-3">Implementation notes: the sentiment model is swappable; for production you may fine-tune or use a finance-specific model to increase precision.</p>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow border">
              <h3 className="text-2xl font-semibold">My learnings</h3>
              <p className="text-gray-600 mt-3">Key takeaways from building the dashboard, presented as short, digestible notes.</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium">Fundamental Analysis</h4>
                  <p className="text-sm text-gray-700 mt-1">Building the scoring logic and ratio calculations deepened my understanding of how valuation, profitability, and leverage interact. Metrics like P/E and ROE signal opportunity or risk only when interpreted in context (industry, peers, history).</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium">Sentiment Analysis</h4>
                  <p className="text-sm text-gray-700 mt-1">Integrating AI-driven sentiment showed how qualitative factors—news flow, headlines, and market tone—can influence investor behavior and short-term moves. Aggregation helped, but I observed model bias and headline ambiguity as limitations.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium">Data Integration</h4>
                  <p className="text-sm text-gray-700 mt-1">Combining market data, fundamentals, and news required careful normalization and error handling. I gained practical experience in API integration, data cleaning, and presenting insights in a user-friendly way.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium">Communication</h4>
                  <p className="text-sm text-gray-700 mt-1">Translating complex financial concepts into clear, actionable insights was a key challenge. Tooltips, interpretive notes, and summary sections helped make the dashboard accessible to non-experts.</p>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow border">
              <h4 className="font-semibold">Tech & APIs</h4>
              <p className="text-sm text-gray-600 mt-2">React · TypeScript · Tailwind · Node.js · Finnhub · Hugging Face</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Tailwind</Badge>
                <Badge>Node</Badge>
                <Badge>Finnhub</Badge>
                <Badge>Hugging Face</Badge>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <h4 className="font-semibold">Architecture</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 mt-2 space-y-1">
                <li>Frontend requests ticker data and news from backend API</li>
                <li>Backend fetches from Finnhub and enriches with sentiment from Hugging Face</li>
                <li>Frontend renders numeric scores, charts, and news cards with sentiment badges</li>
              </ol>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <h4 className="font-semibold">Why this matters</h4>
              <p className="text-sm text-gray-600 mt-2">Combines quantitative signals with market narrative to help users prioritize research and identify catalysts quickly.</p>
            </div>

            {/* Role & Reflection removed per request */}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
