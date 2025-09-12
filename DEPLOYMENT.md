# Stock Dashboard Project - Deployment Guide

## Local Development

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will be available at `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will be available at `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
FINNHUB_API_KEY=d327lr1r01qn0gi2pa10d327lr1r01qn0gi2pa1g
FINNHUB_WEBHOOK_SECRET=d327lr1r01qn0gi2pa2g
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Production Deployment

### Option 1: Vercel (Recommended for Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Option 2: Heroku (Full-stack)
1. Create Heroku app: `heroku create stock-dashboard-app`
2. Set environment variables: `heroku config:set FINNHUB_API_KEY=...`
3. Deploy: `git push heroku main`

### Option 3: Netlify + Backend on Railway/Render
1. Deploy frontend to Netlify
2. Deploy backend to Railway or Render
3. Update API base URL in frontend

## Docker Deployment

### Build and run with Docker
```bash
# Backend
cd backend
docker build -t stock-dashboard-backend .
docker run -p 5000:5000 --env-file .env stock-dashboard-backend

# Frontend
cd frontend
docker build -t stock-dashboard-frontend .
docker run -p 3000:3000 stock-dashboard-frontend
```

## Public Access

The application is designed to be publicly accessible with these URLs:
- Frontend: `https://your-domain.com`
- Backend API: `https://api.your-domain.com`
- Webhook endpoint: `https://api.your-domain.com/api/webhooks/finnhub`

Remember to update CORS settings and environment variables for production domains.
