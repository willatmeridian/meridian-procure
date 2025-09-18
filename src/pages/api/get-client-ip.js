export const prerender = false;

export async function GET({ request, clientAddress }) {
  try {
    // Try to get IP from various sources
    let clientIP = null;

    // Method 1: Astro's built-in clientAddress (available in SSR)
    if (clientAddress && clientAddress !== '::1' && clientAddress !== '127.0.0.1') {
      clientIP = clientAddress;
    }

    // Method 2: Check request headers for forwarded IP
    if (!clientIP) {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIP = request.headers.get('x-real-ip');
      const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
      
      clientIP = forwardedFor?.split(',')[0]?.trim() || 
                realIP || 
                cfConnectingIP || 
                request.headers.get('remote-addr');
    }

    // Method 3: Fallback to external service if still no IP
    if (!clientIP || clientIP === '::1' || clientIP === '127.0.0.1') {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        clientIP = data.ip;
      } catch (error) {
        console.warn('Could not fetch IP from external service:', error);
      }
    }

    return new Response(
      JSON.stringify({ 
        ip: clientIP,
        source: 'server-detected',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );

  } catch (error) {
    console.error('Error getting client IP:', error);
    
    return new Response(
      JSON.stringify({ 
        ip: null,
        error: 'Could not determine IP address',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200, // Still return 200 since this is expected behavior
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}