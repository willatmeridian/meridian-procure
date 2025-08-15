// Sanity Schema Definitions
// These schemas should be added to your Sanity Studio configuration

export const citySchema = {
  name: 'city',
  title: 'City',
  type: 'document',
  fields: [
    {
      name: 'cityName',
      title: 'City Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'cityName',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'cityDescription',
      title: 'City Description',
      type: 'text',
      description: 'Describe the pallet solutions available in this city'
    },
    {
      name: 'cityImage',
      title: 'City Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Main image for the city location'
    },
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Title displayed in the hero section for this city'
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle displayed in the hero section for this city'
    }
  ]
}

export const palletTypeSchema = {
  name: 'palletType',
  title: 'Pallet Type',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Pallet Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Detailed description of this pallet type'
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief description for cards and previews'
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'basePrice',
      title: 'Base Price',
      type: 'number',
      description: 'Base price per pallet (before location adjustments)'
    },
    {
      name: 'locationPricing',
      title: 'Location-Specific Pricing',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'city',
              title: 'City',
              type: 'reference',
              to: [{ type: 'city' }],
              validation: Rule => Rule.required()
            },
            {
              name: 'price',
              title: 'Price per Pallet',
              type: 'number',
              validation: Rule => Rule.required()
            },
            {
              name: 'inStock',
              title: 'In Stock Quantity',
              type: 'number',
              validation: Rule => Rule.min(0)
            },
            {
              name: 'minQuantity',
              title: 'Minimum Order Quantity',
              type: 'number',
              validation: Rule => Rule.min(1)
            }
          ],
          preview: {
            select: {
              cityName: 'city.cityName',
              price: 'price'
            },
            prepare({ cityName, price }) {
              return {
                title: cityName || 'Unknown City',
                subtitle: `$${price} per pallet`
              }
            }
          }
        }
      ]
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of technical specifications'
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key features and benefits'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Grade A', value: 'grade-a' },
          { title: 'Grade B', value: 'grade-b' },
          { title: 'AAA Grade', value: 'aaa-grade' }
        ]
      }
    },
    {
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'Standard dimensions (e.g., 48x40)'
    },
    {
      name: 'weightCapacity',
      title: 'Weight Capacity',
      type: 'string',
      description: 'Maximum weight capacity'
    }
  ]
}

export const heroContentSchema = {
  name: 'heroContent',
  title: 'Hero Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Hero Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text'
    },
    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'City', value: 'city' },
          { title: 'Pallet Type', value: 'pallet-type' },
          { title: 'About', value: 'about' },
          { title: 'Contact', value: 'contact' },
          { title: 'Buy Now', value: 'buy-now' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Specific Slug (optional)',
      type: 'slug',
      description: 'Leave empty for default content, or specify for page-specific content'
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'isDefault',
      title: 'Is Default',
      type: 'boolean',
      description: 'Use as default content when no specific content is found'
    },
    {
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Button Text' },
            { name: 'url', type: 'string', title: 'Button URL' },
            { name: 'style', type: 'string', title: 'Button Style', options: {
              list: ['primary', 'secondary']
            }}
          ]
        }
      ]
    }
  ]
}


// Export all schemas for easy import in Sanity Studio
export const schemas = [
  citySchema,
  palletTypeSchema,
  heroContentSchema
]