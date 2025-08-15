// Server-side HubSpot CRM API submission
export const prerender = false;

export async function POST({ request }) {
  try {
    const formData = await request.json();
    const privateApiKey = process.env.HUBSPOT_PRIVATE_API_KEY || import.meta.env.HUBSPOT_PRIVATE_API_KEY;
    
    if (!privateApiKey) {
      throw new Error('HubSpot private API key is not configured');
    }

    // Helper function to safely convert values
    const safeString = (value) => value ? String(value).trim() : '';
    const safeBooleanOption = (value) => value ? 'true' : 'false';
    
    // Create contact using CRM API
    const contactPayload = {
      properties: {
        // Basic fields (always include these)
        firstname: safeString(formData.firstName),
        lastname: safeString(formData.lastName),
        email: safeString(formData.email),
        phone: safeString(formData.phone),
        company: safeString(formData.company),
      }
    };

    // Add custom quote fields only if they have values
    if (formData.deliveryPostalCode) {
      contactPayload.properties.zip = safeString(formData.deliveryPostalCode);
    }
    if (formData.quantity) {
      contactPayload.properties.pallet_quantity = safeString(formData.quantity);
    }
    if (formData.palletType) {
      contactPayload.properties.pallet_build = safeString(formData.palletType);
    }
    if (formData.entryType) {
      contactPayload.properties.entry_type = safeString(formData.entryType);
    }
    if (formData.lumberType) {
      contactPayload.properties.lumber_type = safeString(formData.lumberType);
    }
    if (formData.palletGrade) {
      contactPayload.properties.pallet_grade = safeString(formData.palletGrade);
    }
    if (formData.heatTreated !== undefined && formData.heatTreated !== null) {
      contactPayload.properties.heat_treatment = safeBooleanOption(formData.heatTreated);
    }
    if (formData.additionalDetails) {
      contactPayload.properties.rfq_details = safeString(formData.additionalDetails);
    }
    if (formData.palletDimensions) {
      contactPayload.properties.pallet_dimensions = safeString(formData.palletDimensions);
    }

    // Also create a formatted message as backup
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
        formData.heatTreated !== undefined ? `Heat Treated: ${formData.heatTreated ? 'Yes' : 'No'}` : '',
        formData.additionalDetails ? `Additional Details: ${formData.additionalDetails}` : ''
      ].filter(line => line).join('\\n');
      
      contactPayload.properties.hs_lead_status = 'NEW';
      contactPayload.properties.lifecyclestage = 'lead';
      if (!contactPayload.properties.rfq_details) {
        contactPayload.properties.message = quoteDetails;
      }
    }

    console.log('Submitting to HubSpot CRM API:', contactPayload);

    // STEP 1: Submit to HubSpot CRM API for complete contact data
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${privateApiKey}`
      },
      body: JSON.stringify(contactPayload)
    });

    const responseData = await response.json();
    console.log('HubSpot CRM API response:', responseData);

    // Handle contact creation/update
    let contactResult = null;
    if (!response.ok) {
      // If contact already exists, try to update it
      if (response.status === 409) {
        console.log('Contact exists, attempting to update...');
        
        // Get existing contact by email
        const searchResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${privateApiKey}`
          },
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: formData.email
              }]
            }]
          })
        });

        const searchData = await searchResponse.json();
        
        if (searchData.results && searchData.results.length > 0) {
          const contactId = searchData.results[0].id;
          
          // Update existing contact
          const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${privateApiKey}`
            },
            body: JSON.stringify({ properties: contactPayload.properties })
          });

          if (updateResponse.ok) {
            contactResult = await updateResponse.json();
            console.log('Contact updated successfully');
          }
        }
      } else {
        throw new Error(`HubSpot CRM API error: ${responseData.message || 'Unknown error'}`);
      }
    } else {
      contactResult = responseData;
      console.log('Contact created successfully');
    }

    // STEP 2: Submit to HubSpot Forms API to register form submission
    const portalId = process.env.PUBLIC_HUBSPOT_PORTAL_ID || import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID;
    const formId = '60d74e04-e6b4-4d9f-910c-a20c0abba0f9'; // Your quote form ID
    
    if (portalId) {
      try {
        const formUrl = `https://forms.hubspot.com/uploads/form/v2/${portalId}/${formId}`;
        const formData2 = new FormData();
        
        // Add basic fields that exist on the form
        if (formData.firstName) formData2.append('firstname', safeString(formData.firstName));
        if (formData.lastName) formData2.append('lastname', safeString(formData.lastName));
        if (formData.email) formData2.append('email', safeString(formData.email));
        if (formData.phone) formData2.append('phone', safeString(formData.phone));
        if (formData.company) formData2.append('company', safeString(formData.company));
        
        // Add custom fields if they exist on the form
        if (formData.deliveryPostalCode) formData2.append('zip', safeString(formData.deliveryPostalCode));
        if (formData.quantity) formData2.append('pallet_quantity', safeString(formData.quantity));
        if (formData.palletType) formData2.append('pallet_build', safeString(formData.palletType));
        if (formData.entryType) formData2.append('entry_type', safeString(formData.entryType));
        if (formData.lumberType) formData2.append('lumber_type', safeString(formData.lumberType));
        if (formData.palletGrade) formData2.append('pallet_grade', safeString(formData.palletGrade));
        if (formData.heatTreated !== undefined) formData2.append('heat_treatment', safeBooleanOption(formData.heatTreated));
        if (formData.additionalDetails) formData2.append('rfq_details', safeString(formData.additionalDetails));
        if (formData.palletDimensions) formData2.append('pallet_dimensions', safeString(formData.palletDimensions));

        console.log('Submitting to HubSpot Forms API for form submission tracking...');
        
        const formResponse = await fetch(formUrl, {
          method: 'POST',
          body: formData2
        });
        
        if (formResponse.ok) {
          console.log('Form submission recorded successfully');
        } else {
          console.warn('Form submission tracking failed, but contact was still created/updated');
        }
      } catch (formError) {
        console.warn('Form submission tracking failed:', formError.message);
        // Don't throw error here - contact was still created/updated successfully
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Quote submitted successfully - contact created and form submission recorded',
      data: contactResult 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('HubSpot submission error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}