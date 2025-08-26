# Stripe Link vs Checkout Session Debug Guide

You're seeing a Link checkout URL instead of a proper Checkout Session. Here's how to diagnose and fix this:

## 🔍 **Current Issue Analysis:**

Your URL structure: `https://checkout.stripe.com/c/pay/cs_live_b1...`
- The `cs_live_` prefix indicates it IS a Checkout Session (not a Payment Link)
- However, you're not seeing your customizations

## 🚨 **Most Likely Causes:**

### 1. **Live vs Test Environment Mismatch**
- You're using **live Stripe keys** (`sk_live_` and `pk_live_`)
- Your customizations might be configured in **test mode** only
- Live and test environments have separate configurations

### 2. **Stripe Dashboard Settings Not Applied**
- Branding settings need to be configured separately for live mode
- Custom checkout appearance may not be set up in live account

## 🔧 **Debugging Steps:**

### Step 1: Check Your Environment
1. **Open browser console** during checkout
2. Look for these new debug messages:
   - `Creating checkout session with Stripe key type: LIVE` or `TEST`
   - `Session ID: cs_live_...` or `cs_test_...`
   - `Session URL: https://checkout.stripe.com/...`

### Step 2: Verify Stripe Dashboard Settings
1. **Go to your Stripe Dashboard**
2. **Switch to LIVE mode** (toggle in top-left)
3. **Check Settings → Branding**:
   - Upload your logo for LIVE mode
   - Set brand colors for LIVE mode
4. **Check Settings → Checkout and Payment Forms**:
   - Verify checkout appearance settings for LIVE mode

### Step 3: Test Mode vs Live Mode
If you want to test with customizations first:

**Option A: Use Test Mode (Recommended for Testing)**
- Set `STRIPE_SECRET_KEY=sk_test_...` (your test key)
- Set `PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...` (your test key)
- Configure branding in TEST mode in Stripe dashboard

**Option B: Configure Live Mode**
- Keep live keys but set up branding in live mode Stripe dashboard

## 🎯 **Expected Behavior After Fix:**

With proper checkout session, you should see:
- Your logo at the top of checkout page
- Company name field (required)
- Phone number field (required)
- Contact info in submit button message
- Terms of service acceptance checkbox
- Your brand colors throughout

## 🔧 **Quick Fix Options:**

### Option 1: Switch to Test Mode for Development
```env
STRIPE_SECRET_KEY=sk_test_your_test_key_here
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
```

### Option 2: Configure Live Mode Branding
1. Stripe Dashboard → **Switch to Live**
2. Settings → Branding → Upload logo and set colors
3. Settings → Checkout → Configure appearance

## 📝 **Next Steps:**
1. Deploy the enhanced logging
2. Test checkout and check browser console
3. Share the debug messages to identify the exact issue
4. Configure branding in the appropriate mode (test or live)