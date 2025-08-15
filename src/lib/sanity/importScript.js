// Script to import city data into Sanity
// Run this script to populate your Sanity Studio with all 20 cities
// Usage: node src/lib/sanity/importScript.js

import { client } from './client.js'
import { cityData } from './cityData.js'

async function importCities() {
  console.log('Starting city import...')
  
  try {
    // Prepare documents for import
    const documents = cityData.map(city => ({
      _type: 'city',
      cityName: city.cityName,
      slug: {
        current: city.slug,
        _type: 'slug'
      },
      cityDescription: city.cityDescription,
      heroTitle: city.heroTitle,
      heroSubtitle: city.heroSubtitle,
      // Note: cityImage will need to be added manually in Sanity Studio
      // or you can upload images and reference them here
    }))

    // Import documents
    const result = await client.createOrReplace(documents)
    console.log(`Successfully imported ${documents.length} cities`)
    console.log('Cities imported:', documents.map(doc => doc.cityName).join(', '))
    
  } catch (error) {
    console.error('Error importing cities:', error)
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importCities()
}

export { importCities }