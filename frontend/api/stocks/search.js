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

  const { q: query } = req.query;

  if (!query || typeof query !== 'string' || query.trim().length < 1) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
    
    if (!FINNHUB_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query.trim())}&token=${FINNHUB_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}