import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
    let queryParams: Record<string, string> = {};
    
    if (req.method === 'POST') {
      const body = await req.json();
      endpoint = body.endpoint || endpoint;
      queryParams = body.params || {};
    } else {
      const url = new URL(req.url);
      endpoint = url.searchParams.get('endpoint') || endpoint;
      url.searchParams.forEach((value, key) => {
        if (key !== 'endpoint') {
          queryParams[key] = value;
        }
      });
    }

    const searchParams = new URLSearchParams(queryParams);
    const apiUrl = `https://api.repliers.io${endpoint}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    console.log('Fetching from Repliers API:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'REPLIERS-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

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
