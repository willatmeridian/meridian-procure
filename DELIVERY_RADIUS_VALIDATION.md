# Delivery Location & Radius Validation Guide

I've enhanced your Stripe checkout to better capture and display delivery location information. Here's what's been implemented and additional options:

## ✅ **Current Enhancements:**

### 1. **Product Names Include Location**
- Products now show: `"Grade A 48x40 Pallets - Delivery: Atlanta, GA"`
- Product descriptions: `"Pallet delivery to Atlanta, GA"`
- Clear visibility in Stripe Dashboard and receipts

### 2. **Enhanced Metadata**
- `delivery_location`: Full location string
- `delivery_type`: "pallet_delivery"
- `customerLocation`: In session metadata
- `totalPallets`: Quantity information

### 3. **Custom Field for Location Confirmation**
- New required field: "Selected Delivery Location"  
- Pre-filled with chosen location
- Customer must confirm before checkout

### 4. **Updated Messaging**
- Mentions 50-mile delivery radius
- Clear delivery coordination messaging
- Service area restrictions in terms

## 🎯 **Current Delivery Information Flow:**

1. **Customer selects city** → Stored in cart
2. **Product names include location** → Visible in checkout
3. **Custom field confirms location** → Customer verifies
4. **Shipping address collected** → Exact delivery address
5. **Metadata stored** → All info saved to Stripe transaction

## 🚀 **Advanced Delivery Radius Validation Options:**

### Option 1: State-Level Restrictions (Simple)
Currently allowing all US states. To restrict to specific states:

```javascript
shipping_address_collection: {
  allowed_countries: ['US'],
  // Add state restrictions in Stripe Dashboard
}
```

### Option 2: Webhook-Based Validation (Advanced)
Create a webhook to validate addresses after checkout:

1. **Stripe Webhook** receives checkout completed
2. **Geocoding API** (Google Maps) gets coordinates  
3. **Distance calculation** from service locations
4. **Auto-refund** if outside delivery area
5. **Customer notification** of delivery restriction

### Option 3: Pre-Checkout Validation (Most Advanced)
Add address validation before Stripe checkout:

1. **Address input** on your cart page
2. **Real-time validation** using maps API
3. **Block checkout** if outside radius
4. **Show delivery fee** based on distance

## 📍 **Service Locations for Distance Calculation:**

Based on your cities, here are the approximate coordinates for radius validation:

```javascript
const serviceLocations = [
  { city: 'Atlanta, GA', lat: 33.7490, lng: -84.3880 },
  { city: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
  { city: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
  // ... all 20 locations
];
```

## 🛠 **Implementation Examples:**

### Webhook Address Validation:
```javascript
// In a Stripe webhook
const customerAddress = session.shipping_details.address;
const deliveryDistance = calculateDistance(
  customerAddress, 
  nearestServiceLocation
);

if (deliveryDistance > 50) {
  // Refund and notify customer
  await stripe.refunds.create({
    payment_intent: session.payment_intent,
    reason: 'requested_by_customer',
    metadata: { reason: 'outside_delivery_area' }
  });
}
```

### Pre-Checkout Validation:
```javascript
// Before allowing checkout
const isWithinRadius = await validateDeliveryAddress(
  shippingAddress,
  selectedServiceLocation,
  50 // miles
);

if (!isWithinRadius) {
  alert('Sorry, we don\'t deliver to that address. Please try a location within 50 miles.');
  return;
}
```

## 📊 **Current Information Captured:**

After checkout completion, you'll have:
- **Selected service location** (Atlanta, Chicago, etc.)
- **Exact delivery address** (shipping address)
- **Company name** (custom field)
- **Phone number** (required)
- **Email** (required)
- **Pallet quantities** (line items)

## 🎯 **Recommended Next Steps:**

1. **Test current implementation** - Deploy and verify location info appears
2. **Monitor delivery requests** - See how many are outside desired radius  
3. **Implement webhook validation** - Auto-refund if outside area
4. **Add distance-based pricing** - Charge more for far deliveries

## 🔧 **Quick Customizations:**

**Change delivery radius messaging:**
```javascript
message: 'We deliver within a 25-mile radius of our service locations.'
```

**Add specific state restrictions:**
```javascript
// In Stripe Dashboard → Checkout Settings
// Or implement custom validation
```

**Enhanced product descriptions:**
```javascript
name: `${item.name} - ${item.quantity} pallets to ${location}`
```

Your checkout now clearly shows delivery location throughout the entire process!