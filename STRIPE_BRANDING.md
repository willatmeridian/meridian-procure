# Stripe Checkout Customization Guide

I've added the following customizations to your checkout session:

## ✅ Code Customizations Added:

### 1. **Required Company Name Field**
- Custom field that requires customers to enter their company name
- Validates minimum 2 characters, maximum 100 characters
- Field is required (cannot be skipped)

### 2. **Phone Number Collection**
- Enables phone number collection during checkout
- Required for better customer communication

### 3. **Custom Messaging with Contact Info**
- **Shipping address message**: Explains delivery coordination
- **Submit button message**: Includes your phone (214) 444-8963 and email
- **Terms message**: References your terms of service

### 4. **Enhanced Success Page**
- Updated button colors to match your brand (#1e308e / #0f1a4d)
- Clear next steps for customers
- Contact information prominently displayed
- Return buttons to homepage and buy-now page

## 🎨 Additional Branding (Stripe Dashboard Settings):

To add your company branding to the checkout page, go to your **Stripe Dashboard**:

### 1. **Upload Your Logo**
1. Go to **Settings** → **Branding**
2. Upload your Meridian Procure logo
3. Set brand colors:
   - **Primary color**: `#1e308e` (your blue)
   - **Secondary color**: `#0f1a4d` (your dark blue)

### 2. **Customize Checkout Appearance**
1. Go to **Settings** → **Checkout and Payment Forms**
2. Under "Checkout appearance":
   - **Logo**: Will appear at the top of checkout
   - **Colors**: Match your website theme
   - **Typography**: Choose fonts that match your brand

### 3. **Business Information**
1. Go to **Settings** → **Business settings**
2. Add your business details:
   - **Business name**: "Meridian Procure"
   - **Support phone**: "(214) 444-8963"
   - **Support email**: "info@meridianprocure.com"
   - **Website**: Your domain

## 📱 Mobile Optimization:
- All customizations are mobile-responsive
- Phone number collection works well on mobile
- Custom fields adapt to screen size

## 🔧 Advanced Customizations Available:
- **Custom CSS**: For more detailed styling (Enterprise feature)
- **Custom payment method text**
- **Localization** for different languages
- **Tax collection** if needed

## 🚀 Next Steps:
1. **Deploy the code changes** (already committed)
2. **Set up Stripe Dashboard branding** (upload logo, set colors)
3. **Test checkout flow** to see all customizations
4. **Verify success page** shows correct return buttons

Your checkout will now collect company name, phone number, and display your contact information prominently!