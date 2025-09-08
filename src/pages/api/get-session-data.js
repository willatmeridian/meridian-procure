import Stripe from 'stripe';

export const prerender = false;

export async function GET({ request, url }) {
  try {
    const sessionId = url.searchParams.get('session_id');
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || import.meta.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not configured');
    }

    const stripe = new Stripe(stripeSecretKey);

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract relevant data for the success page
    const sessionData = {
      id: session.id,
      paymentStatus: session.payment_status,
      amount: session.amount_total / 100, // Convert from cents to dollars
      currency: session.currency.toUpperCase(),
      customerEmail: session.customer_email || session.customer_details?.email || null,
      customerName: session.customer_details?.name || null,
      customerPhone: session.customer_details?.phone || null,
      
      // Custom metadata we stored
      gclid: session.metadata?.gclid || null,
      customerLocation: session.metadata?.customerLocation || null,
      totalPallets: session.metadata?.totalPallets || null,
      orderType: session.metadata?.orderType || null,
      
      // Useful for conversion tracking
      createdAt: new Date(session.created * 1000).toISOString(),
      
      // Success state
      success: session.payment_status === 'paid'
    };

    console.log('Session data retrieved for:', sessionId);

    return new Response(
      JSON.stringify(sessionData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache' // Don't cache session data
        }
      }
    );

  } catch (error) {
    console.error('Error retrieving session data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to retrieve session data',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}