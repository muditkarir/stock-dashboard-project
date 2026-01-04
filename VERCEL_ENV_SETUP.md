# Vercel Environment Variables Setup

## Problem Fixed
Your calculations weren't showing on Vercel because:
1. The app was trying to connect to a local backend that doesn't exist in production
2. Environment variables weren't configured in Vercel
3. The API client needed updating to work properly in production

## Solution Implemented
Updated the API configuration to:
- ✅ Automatically detect Vercel deployment
- ✅ Use direct Finnhub API calls in production (no backend needed)
- ✅ Calculate stock scores and fundamentals in the frontend
- ✅ Add detailed console logging for debugging

## Required: Set Environment Variables in Vercel

### Step 1: Get Your Finnhub API Key
1. Go to https://finnhub.io/
2. Sign up for a free account (if you haven't already)
3. Copy your API key from the dashboard

### Step 2: Configure Vercel Environment Variables
1. Go to your Vercel dashboard: https://vercel.com/
2. Select your stock-dashboard project
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

   **Name:** `REACT_APP_FINNHUB_API_KEY`
   **Value:** `your_finnhub_api_key_here`
   **Environment:** Check all (Production, Preview, Development)

5. Click **Save**

### Step 3: Redeploy Your Application
After adding the environment variable, you need to trigger a new deployment:

**Option 1: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the "..." menu on your latest deployment
3. Select **Redeploy**

**Option 2: Push a new commit**
```bash
git add .
git commit -m "Add Vercel environment variable support"
git push origin main
```

Vercel will automatically rebuild and deploy with the new environment variables.

## Verification

After redeployment, your app should:
1. ✅ Show stock calculations (Price Performance, Momentum, etc.)
2. ✅ Display score breakdowns with all metrics
3. ✅ Show fundamental analysis
4. ✅ Have working search functionality

### Check Browser Console
Open browser developer tools (F12) and look for these success messages:
- `🔍 Fetching data directly from Finnhub for [SYMBOL]...`
- `✅ Successfully fetched data for [SYMBOL], calculating scores...`
- `📊 Calculations complete - Score: XX/100`

## Important Notes

1. **API Key Security**: Never commit your actual API key to Git. Only set it in Vercel's environment variables.

2. **Free Tier Limits**: Finnhub free tier has rate limits:
   - 60 API calls/minute
   - 30 calls/second
   - If you hit limits, you'll see rate limit errors

3. **Environment Variable Format**: Must be exactly `REACT_APP_FINNHUB_API_KEY` (React requires the `REACT_APP_` prefix)

4. **Build-time vs Runtime**: In React, environment variables are embedded at build time, so you must redeploy after adding/changing them.

## Troubleshooting

### Still not seeing calculations?
1. **Check environment variable name**: Must be `REACT_APP_FINNHUB_API_KEY` exactly
2. **Check API key validity**: Test at https://finnhub.io/dashboard
3. **Check browser console**: Look for error messages
4. **Verify redeploy**: Make sure Vercel rebuilt after adding the variable

### API Key not working?
- Verify the key is active in your Finnhub dashboard
- Make sure you haven't exceeded the free tier limits
- Try generating a new API key

### Search not working?
- Same environment variable is used for search
- Check browser console for specific error messages

## Local Development

For local development, create a `.env` file in the root directory:

```env
REACT_APP_FINNHUB_API_KEY=your_api_key_here
```

**Note:** Never commit `.env` to Git. It's already in `.gitignore`.

## Support

If you continue to have issues after following these steps:
1. Check the browser console (F12) for specific error messages
2. Check Vercel deployment logs
3. Verify the environment variable is set correctly in Vercel settings
