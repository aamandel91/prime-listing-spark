import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const FUB_API_KEY = Deno.env.get('FOLLOWUP_BOSS_API_KEY');
const FUB_API_URL = 'https://api.followupboss.com/v1/events';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-signature, x-request-timestamp',
};

// Simple rate limiting using in-memory store (resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 50; // requests per window
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

// Verify request signature to prevent abuse
async function verifyRequestSignature(req: Request, body: string): Promise<boolean> {
  const signature = req.headers.get('x-request-signature');
  const timestamp = req.headers.get('x-request-timestamp');
  
  if (!signature || !timestamp) {
    console.log('Missing signature or timestamp');
    return false;
  }
  
  // Check timestamp is within 5 minutes
  const requestTime = parseInt(timestamp);
  const now = Date.now();
  if (Math.abs(now - requestTime) > 300000) {
    console.log('Request timestamp too old');
    return false;
  }
  
  // Verify signature using API key as secret
  const apiKey = Deno.env.get('VITE_SUPABASE_ANON_KEY') || '';
  const message = `${timestamp}.${body}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiKey);
  const messageData = encoder.encode(message);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return signature === expectedSignature;
}

interface PersonData {
  firstName?: string;
  lastName?: string;
  emails?: Array<{ value: string }>;
  phones?: Array<{ value: string }>;
  addresses?: Array<{ street?: string; city?: string; state?: string; code?: string }>;
}

interface PropertyData {
  street?: string;
  city?: string;
  state?: string;
  code?: string;
  mlsNumber?: string;
  price?: number;
  forRent?: boolean;
  url?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  lot?: number;
}

interface PropertySearchData {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface FUBEventRequest {
  type: string;
  person?: PersonData;
  property?: PropertyData;
  propertySearch?: PropertySearchData;
  message?: string;
  description?: string;
  pageUrl?: string;
  pageTitle?: string;
  pageReferrer?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Follow Up Boss event request received');
    
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

    if (!FUB_API_KEY) {
      console.error('FOLLOWUP_BOSS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Follow Up Boss API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const bodyText = await req.text();
    const eventData: FUBEventRequest = JSON.parse(bodyText);
    
    // Verify request signature
    const isValidSignature = await verifyRequestSignature(req, bodyText);
    if (!isValidSignature) {
      console.warn('Invalid request signature from IP:', clientIP);
      return new Response(
        JSON.stringify({ error: 'Invalid request signature' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('Event data received:', JSON.stringify(eventData, null, 2));
    
    // Input validation
    if (!eventData.type || typeof eventData.type !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid event type' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build the FUB event payload
    const fubPayload: any = {
      source: new URL(req.headers.get('referer') || 'https://yourdomain.com').hostname.replace('www.', ''),
      system: 'PropertyListingWebsite',
      type: eventData.type,
    };

    // Add optional fields
    if (eventData.message) {
      fubPayload.message = eventData.message;
    }

    if (eventData.description) {
      fubPayload.description = eventData.description;
    }

    if (eventData.pageUrl) {
      fubPayload.pageUrl = eventData.pageUrl;
    }

    if (eventData.pageTitle) {
      fubPayload.pageTitle = eventData.pageTitle;
    }

    if (eventData.pageReferrer) {
      fubPayload.pageReferrer = eventData.pageReferrer;
    }

    // Add person data if provided
    if (eventData.person) {
      fubPayload.person = eventData.person;
    }

    // Add property data if provided
    if (eventData.property) {
      fubPayload.property = eventData.property;
    }

    // Add property search data if provided
    if (eventData.propertySearch) {
      fubPayload.propertySearch = eventData.propertySearch;
    }

    console.log('Sending to Follow Up Boss:', JSON.stringify(fubPayload, null, 2));

    // Send event to Follow Up Boss with proper Basic Auth
    // API key as username, blank password
    const apiKey = FUB_API_KEY.trim(); // Remove any whitespace
    const authString = btoa(`${apiKey}:`);
    
    const response = await fetch(FUB_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fubPayload),
    });

    const responseText = await response.text();
    console.log('FUB API response status:', response.status);
    console.log('FUB API response:', responseText);

    if (!response.ok) {
      console.error('Follow Up Boss API error:', response.status, responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send event to Follow Up Boss',
          status: response.status,
          details: responseText
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse response if not empty (204 responses have no body)
    const result = response.status === 204 ? { success: true, note: 'Lead flow archived/ignored' } : JSON.parse(responseText);

    console.log('Successfully sent event to Follow Up Boss');

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in followup-boss-event function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
