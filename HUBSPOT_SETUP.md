# HubSpot Forms Integration Setup Guide

This guide will help you connect your website forms to HubSpot CRM.

## Using HubSpot Forms API

### Step 1: Get Your HubSpot Portal ID
1. Log into your HubSpot account
2. Go to **Settings** (gear icon) → **Account Setup** → **Account Defaults**
3. Find your **Hub ID** (this is your Portal ID)

### Step 2: Create a Single Form in HubSpot
1. Go to **Marketing** → **Lead Capture** → **Forms**
2. Click **Create form**
3. Create one form that will handle all contact inquiries from your website

### Step 3: Get Form ID
1. In your HubSpot forms list, click on your form
2. Look at the URL: `https://app.hubspot.com/forms/[PORTAL-ID]/[FORM-ID]/edit`
3. Copy the **FORM-ID** from the URL

### Step 4: Configure Environment Variables
1. Your `.env` file should contain:

```env
# HubSpot Configuration
PUBLIC_HUBSPOT_PORTAL_ID=your-portal-id-here
PUBLIC_HUBSPOT_FORM_ID=your-form-id-here
```

### Step 5: Map HubSpot Form Fields
In HubSpot, make sure your form has these fields:

#### Required Form Fields:
- `firstname` (First Name)
- `lastname` (Last Name) 
- `email` (Email)
- `phone` (Phone Number)
- `name` (Company Name)
- `message` (Message/Comments - Multi-line text)

### Step 6: Deploy and Test
1. Build and deploy your site
2. Test form submissions
3. Check HubSpot contacts to verify submissions are coming through

## Option 2: Embed HubSpot Forms (Alternative)

If you prefer to use HubSpot's embedded forms instead:

### Step 1: Get Embed Code
1. In HubSpot, go to your form
2. Click **Actions** → **Embed**
3. Copy the JavaScript embed code

### Step 2: Update Components
Replace the current form components with the HubSpot embed code.

## Field Mapping Reference

The system automatically maps form fields to HubSpot properties:

### Website Field → HubSpot Property
- `firstName` → `firstname`
- `lastName` → `lastname`
- `email` → `email`
- `phone` → `phone`
- `company` → `company`
- `message` → `message`
- `description` → `quote_request_details`

## Troubleshooting

### Common Issues:

1. **Forms not submitting**
   - Check console for JavaScript errors
   - Verify Portal ID and Form ID are correct
   - Check CORS settings in HubSpot

2. **Missing form submissions**
   - Check HubSpot form field names match mapping
   - Verify form is published and active
   - Check spam filters

3. **Environment variables not working**
   - Prefix public variables with `PUBLIC_`
   - Restart development server after adding variables
   - Check `.env` file is in project root

### Testing Locally:
```bash
# Check environment variables are loaded
npm run dev
# Test form submission in browser console
console.log(import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID)
```

## Security Notes

- Never expose private API tokens in client-side code
- Use `PUBLIC_` prefix for environment variables used in the browser
- Consider implementing server-side form handling for sensitive data

## Support

- HubSpot API Documentation: https://developers.hubspot.com/docs/api/marketing/forms
- Form Submission API: https://developers.hubspot.com/docs/api/marketing/forms/form-submissions

## Next Steps

1. Set up lead scoring in HubSpot
2. Configure automated email responses
3. Set up deal creation workflows
4. Add form analytics and conversion tracking