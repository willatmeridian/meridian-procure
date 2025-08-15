// Pallet type data for the 3 standard pallet grades
// This data can be imported into Sanity Studio

export const palletData = [
  {
    name: "Grade A Pallets",
    slug: "grade-a",
    category: "grade-a",
    description: "Premium quality pallets made from the finest materials. Grade A pallets are perfect for high-value shipments and long-term storage applications. These pallets undergo rigorous quality control and are built to withstand multiple uses while maintaining structural integrity.",
    shortDescription: "Premium quality pallets for high-value shipments",
    basePrice: 25.00,
    dimensions: "48x40",
    weightCapacity: "4,600 lbs",
    specifications: [
      "Premium hardwood construction",
      "Heat-treated to ISPM-15 standards",
      "4-way entry design",
      "Reinforced corners and joints",
      "Moisture content below 19%",
      "Load capacity: 4,600 lbs"
    ],
    features: [
      "Exceptional durability",
      "Multiple reuse capability", 
      "International shipping approved",
      "Premium appearance",
      "Consistent dimensions",
      "Reinforced construction"
    ]
  },
  {
    name: "Grade B Pallets", 
    slug: "grade-b",
    category: "grade-b",
    description: "High-quality reconditioned pallets that offer excellent value and performance. Grade B pallets are thoroughly inspected, repaired as needed, and provide reliable service for most shipping and storage applications at a cost-effective price point.",
    shortDescription: "High-quality reconditioned pallets with excellent value",
    basePrice: 18.00,
    dimensions: "48x40",
    weightCapacity: "4,000 lbs", 
    specifications: [
      "Reconditioned hardwood construction",
      "Heat-treated to ISPM-15 standards",
      "4-way entry design",
      "Inspected and repaired",
      "Load capacity: 4,000 lbs",
      "Standard 48x40 dimensions"
    ],
    features: [
      "Cost-effective solution",
      "Environmentally friendly",
      "Reliable performance",
      "Quality inspected", 
      "Multiple use capability",
      "International shipping approved"
    ]
  },
  {
    name: "AAA Grade Pallets",
    slug: "aaa-grade", 
    category: "aaa-grade",
    description: "Ultra-premium pallets representing the highest quality available. AAA Grade pallets are made from select materials with superior craftsmanship, designed for the most demanding applications where appearance and performance are critical.",
    shortDescription: "Ultra-premium pallets for the most demanding applications",
    basePrice: 35.00,
    dimensions: "48x40",
    weightCapacity: "5,000 lbs",
    specifications: [
      "Select grade hardwood construction", 
      "Heat-treated to ISPM-15 standards",
      "4-way entry design",
      "Premium finish and appearance",
      "Reinforced with additional fasteners",
      "Load capacity: 5,000 lbs"
    ],
    features: [
      "Superior appearance",
      "Maximum durability",
      "Premium materials only",
      "Enhanced load capacity",
      "Perfect for display applications",
      "Long-term reuse capability"
    ]
  }
]

// Helper function to generate base pallet pricing for all cities
// This creates a template that can be customized per location
export function generatePalletPricingTemplate(cityData) {
  return palletData.map(pallet => ({
    _type: 'palletType',
    name: pallet.name,
    slug: {
      current: pallet.slug,
      _type: 'slug'  
    },
    description: pallet.description,
    shortDescription: pallet.shortDescription,
    basePrice: pallet.basePrice,
    category: pallet.category,
    dimensions: pallet.dimensions,
    weightCapacity: pallet.weightCapacity,
    specifications: pallet.specifications,
    features: pallet.features,
    // Generate location pricing for all cities with base pricing
    locationPricing: cityData.map(city => ({
      city: {
        _type: 'reference',
        _ref: `city-${city.slug}` // This would need to match actual Sanity document IDs
      },
      price: pallet.basePrice, // Base price - can be customized per location
      inStock: 100, // Default stock level
      minQuantity: 10 // Default minimum order
    }))
  }))
}