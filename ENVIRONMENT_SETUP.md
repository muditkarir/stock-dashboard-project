# Environment Variables Setup for GitHub Compliance

This project now uses environment variables to handle API keys securely, making it compliant with GitHub's security policies.

## 🔧 Development Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to `.env`:**
   ```
   REACT_APP_FINNHUB_API_KEY=your_finnhub_api_key_here
   REACT_APP_NEWS_API_KEY=your_news_api_key_here
   REACT_APP_ENV=development
   ```

3. **Get your API keys:**
   - **Finnhub API**: Register at https://finnhub.io/register (free tier available)
   - **News API**: Register at https://newsapi.org/register (optional, for sentiment analysis)

## 🚀 Vercel Deployment

### Option 1: Using Vercel Dashboard
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `REACT_APP_FINNHUB_API_KEY` = your_actual_api_key
   - `REACT_APP_ENV` = production

### Option 2: Using Vercel CLI
```bash
vercel env add REACT_APP_FINNHUB_API_KEY
vercel env add REACT_APP_ENV
```

## 🔄 How It Works

The app uses a **three-tier fallback system**:

1. **Backend API** (if available): Uses your Express server
2. **Direct API calls** (if API key is provided): Calls Finnhub directly from the frontend
3. **Mock data** (fallback): Uses realistic demo data when APIs aren't available

## 🛡️ Security Features

- ✅ API keys stored in environment variables (not in code)
- ✅ `.env` file is gitignored (won't be committed)
- ✅ Frontend environment variables are prefixed with `REACT_APP_`
- ✅ Graceful fallback to mock data when keys aren't available
- ✅ GitHub compliant (no secrets in repository)

## 🧪 Testing

The app will work in three scenarios:

1. **With API keys**: Full functionality with real data
2. **Without API keys**: Demo mode with realistic mock data
3. **Mixed mode**: Backend down but frontend API keys available

## 📝 Notes

- Environment variables starting with `REACT_APP_` are embedded in the build
- The `.env` file is already configured for your development environment
- Production deployment requires setting environment variables in Vercel
- The app gracefully handles all error scenarios

## 🔗 Quick Deploy to Vercel

1. Make sure environment variables are set in Vercel dashboard
2. Push your changes to GitHub
3. Vercel will automatically deploy with the new environment configuration