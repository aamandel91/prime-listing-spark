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
    console.log('Generating Google Real Estate feed...');

    const REPLIERS_API_KEY = Deno.env.get('REPLIERS_API_KEY');
    if (!REPLIERS_API_KEY) {
      throw new Error('REPLIERS_API_KEY not configured');
    }

    const apiUrl = `https://api.repliers.io/listings?status=A&limit=10000`;
    console.log('Fetching listings from:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${REPLIERS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Repliers API error: ${response.status}`);
    }

    const data = await response.json();
    const listings = data.listings || [];
    console.log(`Processing ${listings.length} listings for Google Real Estate feed`);

    const xmlItems = listings.map((listing: any) => {
      const address = listing.address || {};
      const price = listing.listPrice || 0;
      const images = listing.media?.filter((m: any) => m.mediaCategory === 'Photo') || [];
      
      const propertyUrl = `${Deno.env.get('VITE_SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://yoursite.com'}/${[
        address.streetNumber,
        address.streetName,
        address.city,
        address.stateOrProvince,
        address.postalCode,
        listing.mlsId ? `MLS${listing.mlsId}` : ''
      ].filter(Boolean).join('-').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-')}/`;

      const title = `${address.streetNumber || ''} ${address.streetName || ''}, ${address.city || ''}, ${address.stateOrProvince || ''}`.trim();
      const description = listing.publicRemarks || title;

      return `  <listing>
    <id>${listing.mlsId || listing.listingId}</id>
    <name><![CDATA[${title}]]></name>
    <description><![CDATA[${description.substring(0, 5000)}]]></description>
    <price currency="USD">${price}</price>
    <url><![CDATA[${propertyUrl}]]></url>
    <images>
      ${images.slice(0, 10).map((img: any) => `<image><url><![CDATA[${img.mediaURL}]]></url></image>`).join('\n      ')}
    </images>
    <property_type>${listing.propertyType || 'House'}</property_type>
    <listing_type>for_sale</listing_type>
    <address format="simple">
      <street_address><![CDATA[${address.streetNumber || ''} ${address.streetName || ''}]]></street_address>
      <city>${address.city || ''}</city>
      <state>${address.stateOrProvince || ''}</state>
      <postal_code>${address.postalCode || ''}</postal_code>
      <country>US</country>
    </address>
    <bedrooms>${listing.bedroomsTotal || 0}</bedrooms>
    <bathrooms>${listing.bathroomsFull || 0}</bathrooms>
    <living_area unit="sqft">${listing.livingArea || 0}</living_area>
    ${listing.yearBuilt ? `<year_built>${listing.yearBuilt}</year_built>` : ''}
  </listing>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<listings xmlns="http://www.google.com/schemas/realestate/1.0">
${xmlItems}
</listings>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating Google Real Estate feed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
