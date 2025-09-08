import Stripe from 'stripe';

export const prerender = false;

// Raw body parser for Stripe webhooks
export async function POST({ request }) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || import.meta.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || import.meta.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Get raw body and signature
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!endpointSecret) {
      console.error('Stripe webhook secret is not configured');
      return new Response('Webhook secret not configured', { status: 400 });
    }

    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log('Webhook event received:', event.type);

  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      
      // Extract conversion data
      const conversionData = {
        sessionId: session.id,
        amount: session.amount_total / 100, // Convert from cents to dollars
        currency: session.currency,
        gclid: session.metadata?.gclid || null,
        customerLocation: session.metadata?.customerLocation || '',
        totalPallets: session.metadata?.totalPallets || '0',
        timestamp: new Date().toISOString(),
        orderType: session.metadata?.orderType || 'online_purchase'
      };

      console.log('Conversion data extracted:', conversionData);

      // If GCLID is present, prepare for Google Ads conversion tracking
      if (conversionData.gclid) {
        try {
          // Here you would send the conversion to Google Ads
          // For now, we'll log it and store it for manual processing
          await logConversionForGoogleAds(conversionData);
          console.log('Conversion logged for Google Ads tracking');
        } catch (error) {
          console.error('Error logging conversion for Google Ads:', error);
        }
      }

      // You could also send this to your CRM, analytics, etc.
      await processSuccessfulPayment(conversionData);
      
      break;

    case 'checkout.session.expired':
      console.log('Checkout session expired:', event.data.object.id);
      break;

    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response('Webhook received', { status: 200 });
}

// Function to log conversion data for Google Ads (placeholder for your implementation)
async function logConversionForGoogleAds(conversionData) {
  // TODO: Implement Google Ads Conversion API call
  // This is where you'll send the conversion to Google Ads
  
  console.log('=== GOOGLE ADS CONVERSION DATA ===');
  console.log('GCLID:', conversionData.gclid);
  console.log('Conversion Value:', conversionData.amount);
  console.log('Currency:', conversionData.currency);
  console.log('Timestamp:', conversionData.timestamp);
  console.log('Customer Location:', conversionData.customerLocation);
  console.log('Total Pallets:', conversionData.totalPallets);
  console.log('================================');

  // For now, you could store this in a database or send to a third-party service
  // Later, you'll replace this with actual Google Ads API calls
  
  try {
    // Example: Store in a simple log file or database
    // You might want to store this data so you can process conversions later
    const logEntry = {
      timestamp: conversionData.timestamp,
      gclid: conversionData.gclid,
      conversionValue: conversionData.amount,
      currency: conversionData.currency,
      location: conversionData.customerLocation,
      pallets: conversionData.totalPallets,
      sessionId: conversionData.sessionId,
      processed: false // Flag for Google Ads API processing
    };
    
    // Store this data (you could use a database, file, or external service)
    console.log('Conversion ready for Google Ads API:', logEntry);
    
  } catch (error) {
    console.error('Error preparing conversion data:', error);
    throw error;
  }
}

// Function to process successful payments (send to CRM, etc.)
async function processSuccessfulPayment(conversionData) {
  try {
    // Send to HubSpot, update inventory, send confirmation emails, etc.
    console.log('Processing successful payment:', conversionData.sessionId);
    
    // Example: You could update your CRM with the purchase
    // or trigger other business processes
    
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}