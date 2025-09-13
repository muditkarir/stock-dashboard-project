const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (parsedUrl.pathname === '/test') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Simple HTTP server working!' }));
  } else if (parsedUrl.pathname === '/api/stocks/search') {
    const query = parsedUrl.query.q;
    res.writeHead(200);
    res.end(JSON.stringify({ 
      query: query,
      message: 'Search endpoint working!',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 5001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple HTTP server running on port ${PORT}`);
  console.log(`Test: http://localhost:${PORT}/test`);
  
  setInterval(() => {
    console.log('HTTP Server heartbeat:', new Date().toISOString());
  }, 5000);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});