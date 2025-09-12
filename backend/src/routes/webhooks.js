const express = require('express');
const router = express.Router();

// Store for webhook events (in production, use Redis or database)
const webhookEvents = [];
const MAX_EVENTS = 100;

// Middleware to verify Finnhub webhook secret
const verifyWebhookSecret = (req, res, next) => {
  const finnhubSecret = req.headers['x-finnhub-secret'];
  const expectedSecret = process.env.FINNHUB_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error('FINNHUB_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  if (finnhubSecret !== expectedSecret) {
    console.warn('Invalid webhook secret received:', finnhubSecret);
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  next();
};

// Finnhub webhook endpoint
router.post('/finnhub', verifyWebhookSecret, (req, res) => {
  try {
    // Acknowledge receipt immediately (as required by Finnhub)
    res.status(200).json({ received: true });

    const eventData = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      data: req.body,
      headers: {
        'x-finnhub-secret': req.headers['x-finnhub-secret'],
        'content-type': req.headers['content-type']
      }
    };

    // Store the event
    webhookEvents.unshift(eventData);
    
    // Keep only the latest events
    if (webhookEvents.length > MAX_EVENTS) {
      webhookEvents.splice(MAX_EVENTS);
    }

    console.log('📨 Webhook received:', {
      timestamp: eventData.timestamp,
      dataSize: JSON.stringify(req.body).length,
      type: req.body.type || 'unknown'
    });

    // Here you would typically:
    // 1. Process the webhook data
    // 2. Update your database
    // 3. Broadcast to connected clients via WebSocket
    // 4. Trigger notifications
    
    processWebhookData(req.body);
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to acknowledge receipt
    res.status(200).json({ received: true, error: 'Processing failed' });
  }
});

// Get recent webhook events (for debugging/monitoring)
router.get('/events', (req, res) => {
  const { limit = 20 } = req.query;
  const events = webhookEvents.slice(0, parseInt(limit));
  
  res.json({
    total: webhookEvents.length,
    events: events.map(event => ({
      id: event.id,
      timestamp: event.timestamp,
      type: event.data.type || 'unknown',
      dataKeys: Object.keys(event.data)
    }))
  });
});

// Get specific webhook event details
router.get('/events/:id', (req, res) => {
  const eventId = parseFloat(req.params.id);
  const event = webhookEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  res.json(event);
});

// Test webhook endpoint (for development)
router.post('/test', (req, res) => {
  console.log('🧪 Test webhook received:', req.body);
  
  const testEvent = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    data: { ...req.body, _test: true },
    headers: req.headers
  };
  
  webhookEvents.unshift(testEvent);
  
  if (webhookEvents.length > MAX_EVENTS) {
    webhookEvents.splice(MAX_EVENTS);
  }
  
  res.json({ received: true, testMode: true });
});

/**
 * Process webhook data from Finnhub
 * @param {Object} data - Webhook payload
 */
function processWebhookData(data) {
  try {
    // Different types of webhooks from Finnhub
    switch (data.type) {
      case 'trade':
        // Real-time trade data
        console.log('💰 Trade data received:', data.data?.length || 0, 'trades');
        break;
        
      case 'news':
        // News updates
        console.log('📰 News update received');
        break;
        
      default:
        console.log('📦 Unknown webhook type:', data.type);
    }

    // Here you could implement:
    // - Real-time price updates
    // - Alert notifications
    // - Data caching updates
    // - WebSocket broadcasts to frontend clients
    
  } catch (error) {
    console.error('Error processing webhook data:', error);
  }
}

// Health check for webhook endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    webhookSecret: !!process.env.FINNHUB_WEBHOOK_SECRET,
    eventsStored: webhookEvents.length,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
