# Sanity CMS Integration

This directory contains the Sanity CMS integration for the Meridian website.

## Setup Instructions

### 1. Install Sanity Studio (Optional)
If you want to run Sanity Studio locally:
```bash
npm install -g @sanity/cli
sanity init
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Sanity project details:
```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
```

### 3. Add Schemas to Sanity Studio
Copy the schemas from `schemas.js` into your Sanity Studio configuration.

## File Structure

- `client.js` - Sanity client configuration and helper functions
- `schemas.js` - Schema definitions for Sanity Studio
- `README.md` - This file

## Content Types

### City
Stores information about different cities/locations:
- Name and slug
- Description and hero image
- Features and delivery options
- Geographic coordinates

### Pallet Type
Stores information about different pallet types:
- Name, slug, and descriptions
- Images and pricing
- Specifications and features
- Category classification

### Hero Content
Manages hero section content for different pages:
- Title and subtitle text
- Background images
- Call-to-action buttons
- Page-specific or default content

### Location Pricing
Manages location-specific pricing:
- References to cities and pallet types
- Pricing per location
- Stock quantities
- Delivery fees and thresholds

## Usage in Pages

### Dynamic City Pages
The `[city].astro` template uses `getCityData()` to fetch city-specific content.

### Dynamic Pallet Type Pages
The `[pallet-type].astro` template uses `getPalletTypeData()` to fetch pallet-specific content.

### Hero Sections
Any page can use `getHeroContent()` to fetch customized hero section content.

### Shopping Cart
The cart section uses `getLocationPricing()` to show location-specific pricing.

## Next Steps

1. Set up your Sanity project at [sanity.io](https://sanity.io)
2. Configure the schemas in your Sanity Studio
3. Add your environment variables
4. Start creating content in Sanity Studio
5. Update the static data in the Astro pages to use the Sanity client functions

## Migration from Static Data

To migrate from the current static data:

1. Create corresponding documents in Sanity Studio
2. Update the `getStaticPaths()` functions to use `getAllCities()` and `getAllPalletTypes()`
3. Replace static props with Sanity data fetching in page components
4. Test thoroughly before deploying

## Development vs Production

- Development: Uses Sanity's real-time API
- Production: Uses Sanity's CDN for better performance
- The client automatically switches based on the environment