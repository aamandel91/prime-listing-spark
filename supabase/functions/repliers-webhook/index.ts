import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.json();
    console.log('Received webhook:', payload);

    // Store webhook event
    const { data: webhookEvent, error: webhookError } = await supabaseClient
      .from('webhook_events')
      .insert({
        event_type: payload.event || 'unknown',
        payload: payload,
        processed: false
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Error storing webhook:', webhookError);
      throw webhookError;
    }

    // Process different webhook types
    const eventType = payload.event;
    
    if (eventType === 'listing.created' || eventType === 'listing.updated') {
      await processListingEvent(supabaseClient, payload);
    } else if (eventType === 'listing.price_changed') {
      await processPriceChangeEvent(supabaseClient, payload);
    }

    // Mark as processed
    await supabaseClient
      .from('webhook_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('id', webhookEvent.id);

    return new Response(
      JSON.stringify({ success: true, eventId: webhookEvent.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processListingEvent(supabaseClient: any, payload: any) {
  const listing = payload.data;
  
  // Find matching saved searches
  const { data: savedSearches } = await supabaseClient
    .from('saved_searches')
    .select('*, profiles!inner(email, phone)')
    .eq('is_active', true);

  if (!savedSearches) return;

  for (const search of savedSearches) {
    const criteria = search.search_criteria;
    
    // Check if listing matches search criteria
    const matches = matchesSearchCriteria(listing, criteria);
    
    if (matches) {
      console.log(`Listing matches saved search ${search.id}`);
      
      // Send notification via edge function
      await supabaseClient.functions.invoke('send-notification', {
        body: {
          userId: search.user_id,
          type: 'saved_search_match',
          email: search.email_notifications,
          sms: search.sms_notifications,
          data: {
            searchName: search.name,
            listing: listing
          }
        }
      });

      // Update last notified timestamp
      await supabaseClient
        .from('saved_searches')
        .update({ last_notified_at: new Date().toISOString() })
        .eq('id', search.id);
    }
  }
}

async function processPriceChangeEvent(supabaseClient: any, payload: any) {
  const { mlsNumber, oldPrice, newPrice } = payload.data;
  
  // Find users who favorited this property
  const { data: favorites } = await supabaseClient
    .from('favorite_properties')
    .select('*, profiles!inner(email, phone)')
    .eq('property_mls', mlsNumber)
    .eq('price_drop_alert', true);

  if (!favorites) return;

  for (const favorite of favorites) {
    // Only notify on price drops
    if (newPrice < oldPrice) {
      const priceDrop = oldPrice - newPrice;
      const percentDrop = ((priceDrop / oldPrice) * 100).toFixed(1);
      
      console.log(`Price drop for favorite property: ${mlsNumber}, ${percentDrop}% drop`);
      
      // Send notification
      await supabaseClient.functions.invoke('send-notification', {
        body: {
          userId: favorite.user_id,
          type: 'price_drop',
          email: true,
          sms: false,
          data: {
            property: favorite.property_data,
            oldPrice,
            newPrice,
            priceDrop,
            percentDrop
          }
        }
      });

      // Update current price
      await supabaseClient
        .from('favorite_properties')
        .update({ current_price: newPrice })
        .eq('id', favorite.id);
    }
  }
}

function matchesSearchCriteria(listing: any, criteria: any): boolean {
  // City/State match
  if (criteria.city && listing.city?.toLowerCase() !== criteria.city.toLowerCase()) {
    return false;
  }
  if (criteria.state && listing.state?.toLowerCase() !== criteria.state.toLowerCase()) {
    return false;
  }
  
  // Price range
  if (criteria.minPrice && listing.listPrice < criteria.minPrice) {
    return false;
  }
  if (criteria.maxPrice && listing.listPrice > criteria.maxPrice) {
    return false;
  }
  
  // Beds/Baths
  if (criteria.beds && listing.bedroomsTotal < criteria.beds) {
    return false;
  }
  if (criteria.baths && listing.bathroomsTotal < criteria.baths) {
    return false;
  }
  
  // Property type
  if (criteria.propertyType && listing.propertyType !== criteria.propertyType) {
    return false;
  }
  
  return true;
}
