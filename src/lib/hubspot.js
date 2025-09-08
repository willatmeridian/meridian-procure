// HubSpot Forms API Integration
// This handles form submissions to HubSpot

export async function submitToHubSpot(formData, formId) {
  const hubspotPortalId = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID;
  const hubspotFormId = formId || import.meta.env.PUBLIC_HUBSPOT_FORM_ID;
  
  console.log('HubSpot Config:', { hubspotPortalId, hubspotFormId }); // Debug log
  
  if (!hubspotPortalId || !hubspotFormId) {
    const errorMsg = `Missing HubSpot configuration - Portal ID: ${hubspotPortalId}, Form ID: ${hubspotFormId}`;
    console.error(errorMsg);
    throw new Error('HubSpot Portal ID and Form ID are required. Please check your environment variables.');
  }

  // Use alternative API endpoint that's more reliable for client-side submissions
  const url = `https://forms.hubspot.com/uploads/form/v2/${hubspotPortalId}/${hubspotFormId}`;
  
  // Use form-encoded data for the v2 API
  const formEncodedData = new FormData();
  
  Object.entries(formData).forEach(([key, value]) => {
    // Handle different value types (string, boolean, number)
    if (value !== null && value !== undefined && value !== '') {
      const hubspotField = HUBSPOT_FIELD_MAPPING[key] || key;
      const stringValue = value.toString();
      // Only trim if it's originally a string, otherwise just convert to string
      const finalValue = typeof value === 'string' ? stringValue.trim() : stringValue;
      if (finalValue !== '') {
        console.log(`HubSpot mapping: ${key} -> ${hubspotField} = ${finalValue}`);
        formEncodedData.append(hubspotField, finalValue);
      }
    }
  });
  
  // Add HubSpot tracking data
  const hutk = getCookieValue('hubspotutk');
  if (hutk) {
    formEncodedData.append('hutk', hutk);
  }
  
  if (typeof window !== 'undefined') {
    formEncodedData.append('pageUri', window.location.href);
    formEncodedData.append('pageName', document.title || '');
  }

  // Debug: Log what we're actually sending
  const debugData = {};
  for (let [key, value] of formEncodedData.entries()) {
    debugData[key] = value;
  }
  console.log('Submitting to HubSpot v2 API:', { url, debugData }); // Debug log

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formEncodedData // No headers needed for FormData
    });

    console.log('HubSpot response status:', response.status); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HubSpot API error response:', errorText);
      throw new Error(`HubSpot API error: ${response.status} - ${errorText}`);
    }

    // HubSpot v2 API returns HTML on success, not JSON
    const result = await response.text();
    console.log('HubSpot success response:', result); // Debug log
    return { success: true, data: result };
  } catch (error) {
    console.error('HubSpot submission error:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to get cookie value
function getCookieValue(name) {
  if (typeof document === 'undefined') return null;
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Field mapping for HubSpot form
export const HUBSPOT_FIELD_MAPPING = {
  // Basic contact fields
  firstName: 'firstname',
  lastName: 'lastname', 
  email: 'email',
  phone: 'phone',
  company: 'company',
  message: 'message',
  description: 'message', // Alternative field name maps to message
  
  // Quote form specific fields
  deliveryPostalCode: 'zip',
  palletDimensions: 'pallet_dimensions',
  quantity: 'pallet_quantity',
  palletType: 'pallet_build',
  entryType: 'entry_type',
  lumberType: 'lumber_type',
  palletGrade: 'pallet_grade',
  heatTreated: 'heat_treatment',
  additionalDetails: 'rfq_details',
  
  // Google Ads tracking
  gclid: 'gclid_form'
};

// Transform form data using field mapping
export function transformFormData(formData) {
  const transformed = {};
  Object.entries(formData).forEach(([key, value]) => {
    // Skip empty values but allow false boolean values
    if (value !== null && value !== undefined && value !== '') {
      const hubspotField = HUBSPOT_FIELD_MAPPING[key] || key;
      transformed[hubspotField] = value;
    }
  });

  // For quote forms, also create a comprehensive message as backup
  if (formData.quantity || formData.palletType) {
    const quoteDetails = [
      'QUOTE REQUEST DETAILS:',
      formData.company ? `Company: ${formData.company}` : '',
      formData.deliveryPostalCode ? `Delivery Location: ${formData.deliveryPostalCode}` : '',
      formData.palletDimensions ? `Pallet Dimensions: ${formData.palletDimensions}` : '',
      formData.quantity ? `Quantity: ${formData.quantity}` : '',
      formData.palletType ? `Pallet Type: ${formData.palletType}` : '',
      formData.entryType ? `Entry Type: ${formData.entryType}` : '',
      formData.lumberType ? `Lumber Type: ${formData.lumberType}` : '',
      formData.palletGrade ? `Pallet Grade: ${formData.palletGrade}` : '',
      formData.heatTreated ? `Heat Treated: ${formData.heatTreated ? 'Yes' : 'No'}` : '',
      formData.additionalDetails ? `Additional Details: ${formData.additionalDetails}` : ''
    ].filter(line => line).join('\n');
    
    // Add to message field as backup
    if (!transformed.message) {
      transformed.message = quoteDetails;
    } else {
      transformed.message += '\n\n' + quoteDetails;
    }
  }

  return transformed;
}