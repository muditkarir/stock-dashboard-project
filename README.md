# Stock Dashboard Project

A modern, professional stock market dashboard that provides real-time stock data, analysis, and scoring for selected companies.

## Features

- **Stock Search & Analysis**: Search for any stock ticker and view latest price, trends, and key metrics
- **Smart Scoring**: Simple scoring system (Strong/Neutral/Weak) based on recent performance
- **Real-time Updates**: Webhook integration with Finnhub for live data updates
- **Professional UI**: Clean, modern design that works on desktop and mobile
- **Secure API Integration**: Secure handling of Finnhub API with proper authentication

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Chart.js
- **Backend**: Node.js with Express, secure API handling
- **Data Source**: Finnhub Stock API
- **Real-time**: Webhook support for live updates

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Integration

This app uses the Finnhub Stock API to fetch real-time stock data. The API key is securely handled on the backend to protect credentials.

## Webhook Support

The app supports Finnhub webhooks for real-time updates and alerts. The webhook endpoint is secured with the provided secret key.

## Architecture

```
stock-dashboard-project/
├── backend/           # Express.js API server
│   ├── src/
│   ├── routes/
│   └── services/
├── frontend/          # React TypeScript app
│   ├── src/
│   ├── components/
│   └── services/
└── README.md
```

## Deployment

The application is designed to be easily deployable to platforms like Vercel, Netlify, or Heroku for public sharing.
