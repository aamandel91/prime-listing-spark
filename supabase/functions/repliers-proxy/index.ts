import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple rate limiting using in-memory store (resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  
  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { 
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const apiKey = Deno.env.get('REPLIERS_API_KEY');
    
    if (!apiKey) {
      console.error('REPLIERS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get parameters from request body or URL
    let endpoint = '/listings';
    let queryParams: Record<string, any> = {};
    let httpMethod = 'GET';
    let bodyData: any = null;
    
    if (req.method === 'POST') {
      const body = await req.json();
      endpoint = body.endpoint || endpoint;
      queryParams = body.params || {};
      httpMethod = body.method || 'GET';
      bodyData = body.data || null;
    } else {
      const url = new URL(req.url);
      endpoint = url.searchParams.get('endpoint') || endpoint;
      url.searchParams.forEach((value, key) => {
        if (key !== 'endpoint') {
          queryParams[key] = value;
        }
      });
    }

    // Build search params, supporting array values by repeating keys
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const apiUrl = `https://api.repliers.io${endpoint}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    console.log('Fetching from Repliers API:', apiUrl, 'Method:', httpMethod);

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: httpMethod,
      headers: {
        'REPLIERS-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    };

    // Add body for POST/PUT requests
    if (bodyData && (httpMethod === 'POST' || httpMethod === 'PUT')) {
      fetchOptions.body = JSON.stringify(bodyData);
    }

    const response = await fetch(apiUrl, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Repliers API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'API request failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Log the response structure for debugging
    console.log('Repliers API response structure:', {
      isArray: Array.isArray(data),
      keys: typeof data === 'object' ? Object.keys(data) : 'not an object',
      hasListings: data?.listings ? `yes (${Array.isArray(data.listings) ? data.listings.length : 'not array'})` : 'no',
      hasData: data?.data ? `yes (${Array.isArray(data.data) ? data.data.length : 'not array'})` : 'no'
    });

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in repliers-proxy:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
