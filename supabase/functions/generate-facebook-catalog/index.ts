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
    console.log('Generating Facebook product catalog feed...');

    const REPLIERS_API_KEY = Deno.env.get('REPLIERS_API_KEY');
    if (!REPLIERS_API_KEY) {
      throw new Error('REPLIERS_API_KEY not configured');
    }

    // Fetch active listings from Repliers API
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
    console.log(`Processing ${listings.length} listings for Facebook catalog`);

    // Generate XML feed in Facebook catalog format
    const xmlItems = listings.map((listing: any) => {
      const address = listing.address || {};
      const price = listing.listPrice || 0;
      const images = listing.media?.filter((m: any) => m.mediaCategory === 'Photo') || [];
      const primaryImage = images[0]?.mediaURL || '';
      const additionalImages = images.slice(1, 10).map((img: any) => img.mediaURL).join(',');
      
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

      return `    <item>
      <id>${listing.mlsId || listing.listingId}</id>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description.substring(0, 5000)}]]></description>
      <availability>in stock</availability>
      <condition>new</condition>
      <price>${price} USD</price>
      <link><![CDATA[${propertyUrl}]]></link>
      <image_link><![CDATA[${primaryImage}]]></image_link>
      ${additionalImages ? `<additional_image_link><![CDATA[${additionalImages}]]></additional_image_link>` : ''}
      <brand>Real Estate</brand>
      <google_product_category>Real Estate</google_product_category>
      <property_type>${listing.propertyType || 'Residential'}</property_type>
      <listing_type>for_sale</listing_type>
      <address><![CDATA[${title}]]></address>
      <city>${address.city || ''}</city>
      <region>${address.stateOrProvince || ''}</region>
      <postal_code>${address.postalCode || ''}</postal_code>
      <num_beds>${listing.bedroomsTotal || 0}</num_beds>
      <num_baths>${listing.bathroomsFull || 0}</num_baths>
      <living_area>${listing.livingArea || 0} sqft</living_area>
      <year_built>${listing.yearBuilt || ''}</year_built>
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Property Listings</title>
    <link>https://yoursite.com</link>
    <description>Real estate property listings</description>
${xmlItems}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating Facebook catalog:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
