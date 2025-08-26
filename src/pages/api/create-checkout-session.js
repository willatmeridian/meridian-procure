import Stripe from 'stripe';

export const prerender = false;

export async function POST({ request, url }) {
  try {
    // Initialize Stripe inside the function to avoid build-time issues
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || import.meta.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not configured');
    }
    
    const stripe = new Stripe(stripeSecretKey);
    const { items, customerInfo } = await request.json();

    // Calculate line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image.startsWith('/') ? 
            `${url.origin}${item.image}` : item.image] : [],
          metadata: {
            type: 'pallet',
            category: item.category || 'standard'
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping if applicable
    const totalPallets = items.reduce((total, item) => total + item.quantity, 0);
    if (totalPallets < 550) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Fee',
            description: 'Delivery fee for orders under 550 pallets'
          },
          unit_amount: 30000, // $300 in cents
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${url.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}/buy-now`,
      // Only set customer_email if it's provided and valid, otherwise let Stripe collect it
      ...(customerInfo?.email && customerInfo.email.trim() !== '' ? { customer_email: customerInfo.email } : {}),
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      // Require company name for business purchases
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Company Name'
          },
          type: 'text',
          text: {
            maximum_length: 100,
            minimum_length: 2
          },
          optional: false // Required field
        }
      ],
      metadata: {
        customerLocation: customerInfo?.location || '',
        totalPallets: totalPallets.toString(),
        orderType: 'online_purchase'
      },
      // Customize the checkout page with branding and messaging
      custom_text: {
        shipping_address: {
          message: 'Please provide the delivery address for your pallet order. Our team will coordinate delivery details with you after purchase.'
        },
        submit: {
          message: 'Questions? Call us at 1-800-PALLETS or email info@meridianprocure.com. We\'ll process your order and contact you within 24 hours to confirm delivery details.'
        },
        terms_of_service_acceptance: {
          message: 'By completing your purchase, you agree to our terms of service and delivery policies.'
        }
      },
      // Add phone number to the checkout
      phone_number_collection: {
        enabled: true
      },
      // Required when using custom terms of service text
      consent_collection: {
        terms_of_service: 'required'
      }
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}