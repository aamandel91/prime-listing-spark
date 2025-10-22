import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const FUB_API_KEY = Deno.env.get('FOLLOWUP_BOSS_API_KEY');
const FUB_API_URL = 'https://api.followupboss.com/v1/events';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const eventData: FUBEventRequest = await req.json();
    console.log('Event data received:', JSON.stringify(eventData, null, 2));

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

    // Send event to Follow Up Boss
    const response = await fetch(FUB_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(FUB_API_KEY + ':')}`,
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
