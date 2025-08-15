// Netlify function for submitting quote data to HubSpot CRM API
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const formData = JSON.parse(event.body);
    
    // Your HubSpot private API key (stored securely in Netlify environment variables)
    const HUBSPOT_API_KEY = process.env.HUBSPOT_PRIVATE_API_KEY;
    
    if (!HUBSPOT_API_KEY) {
      throw new Error('HubSpot API key not configured');
    }

    // Prepare the contact data for HubSpot CRM API
    const contactProperties = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      zip: formData.deliveryPostalCode,
      pallet_dimensions: formData.palletDimensions,
      pallet_quantity: formData.quantity,
      pallet_build: formData.palletType,
      entry_type: formData.entryType,
      lumber_type: formData.lumberType,
      pallet_grade: formData.palletGrade,
      heat_treatment: formData.heatTreated ? 'Yes' : 'No',
      rfq_details: formData.additionalDetails
    };

    // Remove empty values
    const cleanedProperties = {};
    Object.entries(contactProperties).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanedProperties[key] = value;
      }
    });

    console.log('Sending to HubSpot CRM API:', cleanedProperties);

    // Submit to HubSpot CRM API
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: cleanedProperties
      })
    });

    const result = await response.text();
    console.log('HubSpot CRM API response:', response.status, result);

    if (!response.ok) {
      throw new Error(`HubSpot CRM API error: ${response.status} - ${result}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: true, message: 'Quote submitted successfully' }),
    };

  } catch (error) {
    console.error('Quote submission error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
    };
  }
};