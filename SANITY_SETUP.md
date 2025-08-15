# Sanity CMS Setup Instructions

Your cart checkout is getting a 403 Forbidden error because your Sanity dataset is private. You have two options to fix this:

## Option 1: Get a Sanity Read Token (Recommended)

1. **Go to your Sanity project dashboard:**
   - Visit: https://sanity.io/manage
   - Select your project: `meridian-lp-cms`

2. **Create a Read Token:**
   - Go to **API** tab
   - Click **Tokens** 
   - Click **Add API token**
   - Name it: `Website Read Token`
   - Set permissions to: `Viewer` (read-only)
   - Copy the generated token

3. **Add token to your environment:**
   - In your local `.env` file, add:
     ```
     SANITY_READ_TOKEN=your_actual_token_here
     ```
   - In Vercel dashboard, add the same environment variable

## Option 2: Make Dataset Public (Alternative)

1. **Go to your Sanity project dashboard:**
   - Visit: https://sanity.io/manage  
   - Select your project: `meridian-lp-cms`

2. **Make dataset public:**
   - Go to **API** tab
   - Click **CORS origins**
   - Add your domain (e.g., `https://your-site.vercel.app`)
   - Check "Allow credentials"

3. **Update dataset settings:**
   - Go to **Datasets** tab
   - Select your `production` dataset
   - Change visibility to **Public**

## Which Option to Choose?

- **Option 1 (Token)**: More secure, recommended for production
- **Option 2 (Public)**: Simpler setup, but data is publicly readable

Both options will fix the 403 error and allow your cart checkout to display pallet types.

## After Setup

1. Redeploy your site to Vercel
2. Test cart checkout by selecting a city
3. You should see 3 pallet types appear (AAA Grade, Grade A, Grade B)