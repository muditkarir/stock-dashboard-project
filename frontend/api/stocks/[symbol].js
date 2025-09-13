export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string' || symbol.length === 0) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  const upperSymbol = symbol.toUpperCase();

  try {
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
    
    if (!FINNHUB_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Get all data in parallel
    const promises = [
      fetch(`https://finnhub.io/api/v1/quote?symbol=${upperSymbol}&token=${FINNHUB_API_KEY}`),
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${upperSymbol}&token=${FINNHUB_API_KEY}`).catch(() => null),
      fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${upperSymbol}&metric=all&token=${FINNHUB_API_KEY}`).catch(() => null)
    ];

    const [quoteResponse, profileResponse, financialsResponse] = await Promise.all(promises);

    if (!quoteResponse.ok) {
      throw new Error(`Quote API error: ${quoteResponse.status}`);
    }

    const quote = await quoteResponse.json();

    // Validate quote data
    if (!quote || typeof quote.c !== 'number') {
      return res.status(404).json({ error: 'Stock symbol not found or invalid' });
    }

    const profile = profileResponse ? await profileResponse.json().catch(() => null) : null;
    const financials = financialsResponse ? await financialsResponse.json().catch(() => null) : null;

    // Basic scoring logic (simplified)
    const score = Math.min(Math.max(
      (quote.dp > 0 ? 25 : 0) + // Price change
      (quote.c > 50 ? 25 : 0) + // Price level
      Math.floor(Math.random() * 50), // Random component for demo
      0
    ), 100);

    const result = {
      symbol: upperSymbol,
      quote,
      profile,
      financials: financials?.metric || null,
      score,
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(`Stock data error for ${upperSymbol}:`, error);
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}