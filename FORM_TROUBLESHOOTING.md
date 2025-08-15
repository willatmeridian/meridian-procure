# Form Submission Troubleshooting Guide

If you're experiencing errors when submitting forms, follow these steps to diagnose and fix the issue.

## 🔍 **Step 1: Check Browser Console**

1. **Open your website** in Chrome or Safari
2. **Right-click** → **Inspect** → **Console** tab
3. **Submit a form** and look for error messages
4. **Look for these debug logs:**
   - "HubSpot Config: {hubspotPortalId: '...', hubspotFormId: '...'}"
   - "Submitting to HubSpot: {url: '...', hubspotData: {...}}"
   - "HubSpot response status: ..."

## 🎯 **Common Issues & Solutions**

### Issue 1: "Missing HubSpot configuration"
**Solution:** Environment variables not set properly
- **Check Netlify:** Site Settings → Environment Variables
- **Verify variables exist:**
  - `PUBLIC_HUBSPOT_PORTAL_ID` = `23919538`
  - `PUBLIC_HUBSPOT_FORM_ID` = `6303870c-dc71-479e-bfcd-3c1085735394`
- **Redeploy** your site after adding variables

### Issue 2: "HubSpot API error: 403"
**Solution:** Form not properly configured in HubSpot
- **Go to HubSpot** → Marketing → Lead Capture → Forms
- **Check your form ID:** `6303870c-dc71-479e-bfcd-3c1085735394`
- **Verify form fields match exactly:**
  - `firstname` (Single line text)
  - `lastname` (Single line text)
  - `email` (Email)
  - `phone` (Phone number)
  - `name` (Single line text - for Company Name)
  - `message` (Multi-line text)

### Issue 3: "HubSpot API error: 400"
**Solution:** Field mapping issue
- **Check form field names** in HubSpot are lowercase
- **Make sure no required fields are missing** in your HubSpot form

### Issue 4: CORS or Network Errors
**Solution:** Use alternative submission method
- **Replace HubSpotContactForm** with **SimpleContactForm** temporarily
- This uses Netlify's built-in form handling as backup

## 🛠 **Quick Fix: Switch to Netlify Forms**

If HubSpot continues to have issues, you can use Netlify's form handling:

### Step 1: Replace Form Components
Update your `GetInTouchSection.astro`:

```astro
---
import SimpleContactForm from "../SimpleContactForm.jsx";
---

<!-- Contact Form - Right Column -->
<div class="flex-1">
  <SimpleContactForm client:load />
</div>
```

### Step 2: Enable Netlify Forms
- Forms will automatically be detected by Netlify
- Submissions will appear in your Netlify dashboard
- You can set up email notifications in Netlify settings

## 🔧 **Testing Steps**

1. **Deploy updated site** with debugging enabled
2. **Open browser console** before submitting
3. **Fill out form** with test data
4. **Submit form** and watch console logs
5. **Check for errors** and debug messages

## 📋 **Debug Checklist**

- [ ] Environment variables set in Netlify
- [ ] Site redeployed after adding variables  
- [ ] HubSpot form exists with correct ID
- [ ] HubSpot form fields match required names
- [ ] Browser console shows debug logs
- [ ] No CORS or network errors in console

## 🆘 **If Nothing Works**

1. **Use SimpleContactForm** component instead
2. **Enable Netlify form notifications:**
   - Site Settings → Forms → Form notifications
   - Add your email for new submissions
3. **Manually export** Netlify submissions to HubSpot later

## 📞 **Next Steps**

Once forms are working:
1. **Remove console.log** statements from production
2. **Set up automated** Netlify → HubSpot integration via Zapier
3. **Test form submissions** end-to-end
4. **Set up email notifications** for new leads