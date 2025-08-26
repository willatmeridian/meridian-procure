# Stripe Promo Codes Setup Guide

I've added promo code functionality to your checkout with `allow_promotion_codes: true`. Now you need to create the actual promo codes in your Stripe Dashboard.

## ✅ **Code Changes Made:**
- Added `allow_promotion_codes: true` to your checkout session
- Customers will see a "Add promotion code" link during checkout
- Promo codes will automatically apply discounts to the order

## 🎯 **How to Create Promo Codes in Stripe Dashboard:**

### Step 1: Create Coupons First
1. Go to **Stripe Dashboard**
2. Navigate to **Products** → **Coupons**
3. Click **Create coupon**
4. Choose your discount type:

**Percentage Discount:**
- **Name**: `10% Off Pallets`
- **ID**: `PALLET10` (what customers will type)
- **Percent off**: `10`
- **Duration**: Choose option below

**Fixed Amount Discount:**
- **Name**: `$50 Off Orders`
- **ID**: `SAVE50`
- **Amount off**: `$50.00`
- **Currency**: `USD`

**Duration Options:**
- **Once**: Discount applies to one purchase only
- **Forever**: Discount applies to all purchases for this customer
- **Repeating**: Discount applies for X months

### Step 2: Set Usage Limits (Optional)
- **Max redemptions**: Total times this code can be used
- **Max redemptions per customer**: Limit per individual customer
- **Minimum order amount**: Require minimum purchase (e.g., $500)

### Step 3: Create Promotion Codes
1. After creating a coupon, go to **Products** → **Promotion codes**
2. Click **Create promotion code**
3. Select your coupon
4. Set the code customers will enter:
   - **Code**: `SAVE10`, `NEWCUSTOMER`, `BULK25`, etc.
5. Set expiration date if desired
6. Click **Create promotion code**

## 🎨 **Popular Promo Code Ideas for Your Business:**

### **Percentage Discounts:**
```
NEWCUSTOMER15 → 15% off first order
BULK20       → 20% off orders over 500 pallets
SAVE10       → 10% off any order
RETURN5      → 5% off for returning customers
```

### **Fixed Amount Discounts:**
```
SAVE50       → $50 off orders over $1000
WELCOME25    → $25 off first order
SHIPPING     → Free shipping ($300 off)
BULK100      → $100 off orders over 1000 pallets
```

### **Conditional Discounts:**
- **Minimum order amount**: Only apply to large orders
- **Usage limits**: Limited-time offers
- **Customer limits**: One per customer promos

## 🚀 **Customer Experience:**

After you deploy, customers will see:
1. **During checkout**: "Add promotion code" link
2. **Click to expand**: Promo code entry field appears
3. **Enter code**: Customer types code (e.g., "SAVE10")
4. **Auto-apply**: Discount immediately applies to order
5. **Updated total**: Order total updates with discount

## 📊 **Tracking & Analytics:**

In Stripe Dashboard, you can track:
- **Coupon usage**: How many times each code was used
- **Revenue impact**: Total discounts given
- **Customer behavior**: Which codes are most popular
- **Performance**: ROI of different discount strategies

## 🔧 **Advanced Options:**

### **Product-Specific Coupons:**
- Create coupons that only apply to specific products
- Example: 15% off Grade A pallets only

### **Time-Limited Campaigns:**
- Set expiration dates on promotion codes
- Create urgency with limited-time offers

### **Customer Segmentation:**
- Create different codes for different customer groups
- Track which segments respond to which offers

## 🎯 **Recommended First Promo Codes:**

1. **WELCOME10** → 10% off first order (encourage new customers)
2. **BULK15** → 15% off orders over 500 pallets (reward large orders)
3. **FREESHIP** → $300 off (equivalent to free shipping)

## 📝 **Next Steps:**
1. **Deploy the code changes** (promo codes enabled)
2. **Create your first coupon** in Stripe Dashboard
3. **Create promotion codes** for that coupon
4. **Test checkout** to see promo code field
5. **Share codes** with customers in marketing materials

The promo code functionality is now ready - you just need to create the actual codes in your Stripe Dashboard!