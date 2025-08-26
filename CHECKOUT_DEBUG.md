# Checkout Error Debugging Guide

If you're getting "There was an error processing your checkout" on the buy-now page, follow these steps to diagnose the issue:

## 1. Check Browser Console

1. **Open Developer Tools**: Press F12 or right-click → Inspect
2. **Go to Console tab**
3. **Clear console** and try checkout again
4. **Look for error messages** that start with:
   - `Creating checkout session with:`
   - `Checkout API response status:`
   - `Checkout API error:`
   - `Checkout session error:`

## 2. Check Environment Variables

Make sure these are set in your **Vercel dashboard** (Settings → Environment Variables):

**Required:**
- `STRIPE_SECRET_KEY` = `sk_test_...` or `sk_live_...` (your Stripe secret key)
- `PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...` or `pk_live_...` (your Stripe publishable key)

**Optional (for Sanity):**
- `SANITY_READ_TOKEN` = (if using private Sanity dataset)

## 3. Test Stripe Configuration

In your browser console on the buy-now page, run:
```javascript
console.log('Stripe Key:', window.Stripe ? 'Loaded' : 'Missing');
```

## 4. Common Issues & Solutions

### Issue: "Stripe secret key is not configured"
- **Solution**: Add `STRIPE_SECRET_KEY` to Vercel environment variables
- Must start with `sk_test_` (test mode) or `sk_live_` (live mode)

### Issue: "Failed to create checkout session"
- **Solution**: Check Stripe secret key is valid and active
- Verify your Stripe account is properly set up

### Issue: Network/CORS errors
- **Solution**: Redeploy your site after adding environment variables
- Check that API routes are properly deployed

### Issue: Cart is empty
- **Solution**: First select a city and add items to cart before checkout

## 5. Testing Steps

1. **Select a city** (e.g., Atlanta)
2. **Add items to cart** (minimum 100 quantity)
3. **Open browser console** (F12)
4. **Click "Proceed to Checkout"**
5. **Check console for specific error messages**

## 6. If Still Not Working

Share the specific error message from the browser console, and we can debug further. The enhanced error logging will show exactly what's failing in the checkout process.