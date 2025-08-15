import { createClient } from '@sanity/client'

// Configuration for Sanity client
// These environment variables should be set in your .env file or deployment environment
export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '9csl81p9', // Your actual Sanity project ID
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: import.meta.env.PROD, // Use CDN for production builds
  apiVersion: '2024-08-07', // Use current date or a stable API version
})

// Helper function to fetch city data
export async function getCityData(citySlug) {
  try {
    const query = `*[_type == "city" && slug.current == $citySlug][0]{
      cityName,
      cityDescription,
      "cityImageUrl": cityImage.asset->url,
      heroTitle,
      heroSubtitle,
      slug
    }`
    
    return await client.fetch(query, { citySlug })
  } catch (error) {
    console.error('Error fetching city data:', error)
    return null
  }
}

// Helper function to fetch pallet type data
export async function getPalletTypeData(palletTypeSlug) {
  try {
    const query = `*[_type == "palletType" && slug.current == $palletTypeSlug][0]{
      name,
      description,
      shortDescription,
      "imageUrl": mainImage.asset->url,
      basePrice,
      locationPricing[]{
        city->{
          cityName,
          "slug": slug.current
        },
        price,
        inStock,
        minQuantity
      },
      specifications,
      features,
      category,
      dimensions,
      weightCapacity,
      slug
    }`
    
    return await client.fetch(query, { palletTypeSlug })
  } catch (error) {
    console.error('Error fetching pallet type data:', error)
    return null
  }
}

// Helper function to fetch all cities for static paths
export async function getAllCities() {
  try {
    const query = `*[_type == "city"]{
      "slug": slug.current,
      cityName
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching all cities:', error)
    return []
  }
}

// Helper function to fetch all pallet types for static paths
export async function getAllPalletTypes() {
  try {
    const query = `*[_type == "palletType"]{
      "slug": slug.current,
      name
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching all pallet types:', error)
    return []
  }
}

// Helper function to fetch hero section content based on page type
export async function getHeroContent(pageType, slug = null) {
  try {
    let query = `*[_type == "heroContent" && pageType == $pageType`
    let params = { pageType }
    
    if (slug) {
      query += ` && (slug.current == $slug || isDefault == true)][0]`
      params.slug = slug
    } else {
      query += `][0]`
    }
    
    query += `{
      title,
      subtitle,
      "backgroundImageUrl": backgroundImage.asset->url,
      ctaButtons
    }`
    
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Error fetching hero content:', error)
    return null
  }
}

// Helper function to fetch city-specific pallet pricing
export async function getCityPalletPricing(citySlug) {
  try {
    // First, let's see all the raw location pricing data for debugging
    const debugQuery = `*[_type == "palletType"]{
      name,
      "slug": slug.current,
      category,
      locationPricing[]{
        "cityName": city->cityName,
        "citySlug": city->slug.current,
        price,
        inStock,
        minQuantity
      }
    }`
    
    const debugData = await client.fetch(debugQuery)
    console.log('=== ALL PALLET PRICING DATA ===')
    debugData.forEach(pallet => {
      console.log(`${pallet.name} (${pallet.category}):`)
      pallet.locationPricing.forEach(loc => {
        if (loc.citySlug === citySlug) {
          console.log(`  ✓ ${loc.cityName} (${loc.citySlug}): $${loc.price}`)
        }
      })
    })
    
    // Now the corrected query using the suggested syntax
    const query = `*[_type == "palletType"]{
      name,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      basePrice,
      category,
      shortDescription,
      description,
      "cityPricing": locationPricing[city->slug.current == $citySlug][0]{
        price,
        inStock,
        minQuantity,
        "cityName": city->cityName
      }
    }[defined(cityPricing)]`
    
    const data = await client.fetch(query, { citySlug })
    console.log('=== FILTERED CMS DATA FOR', citySlug.toUpperCase(), '===')
    data.forEach(pallet => {
      console.log(`${pallet.name}: $${pallet.cityPricing.price}`)
    })
    
    return data
  } catch (error) {
    console.error('Error fetching city pallet pricing:', error)
    return []
  }
}