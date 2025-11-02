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
    console.log('Generating Google Page Feed for DSA...');

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
    console.log(`Processing ${listings.length} listings for page feed`);

    const baseUrl = Deno.env.get('VITE_SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://yoursite.com';

    const xmlItems = listings.map((listing: any) => {
      const address = listing.address || {};
      const price = listing.listPrice || 0;
      
      const propertyUrl = `${baseUrl}/${[
        address.streetNumber,
        address.streetName,
        address.city,
        address.stateOrProvince,
        address.postalCode,
        listing.mlsId ? `MLS${listing.mlsId}` : ''
      ].filter(Boolean).join('-').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-')}/`;

      const title = `${address.streetNumber || ''} ${address.streetName || ''}, ${address.city || ''}, ${address.stateOrProvince || ''}`.trim();

      // Custom labels for targeting
      const customLabels = [
        listing.propertyType || 'Residential',
        address.city || 'Unknown',
        `${Math.floor(price / 100000)}00k`, // Price range
        `${listing.bedroomsTotal || 0}bed`,
        address.stateOrProvince || 'FL'
      ];

      return `  <url>
    <loc><![CDATA[${propertyUrl}]]></loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <pageMap>
      <DataObject type="property">
        <Attribute name="title">${title}</Attribute>
        <Attribute name="price">${price}</Attribute>
        <Attribute name="bedrooms">${listing.bedroomsTotal || 0}</Attribute>
        <Attribute name="bathrooms">${listing.bathroomsFull || 0}</Attribute>
        <Attribute name="sqft">${listing.livingArea || 0}</Attribute>
        <Attribute name="city">${address.city || ''}</Attribute>
        <Attribute name="state">${address.stateOrProvince || ''}</Attribute>
        <Attribute name="zip">${address.postalCode || ''}</Attribute>
        <Attribute name="property_type">${listing.propertyType || ''}</Attribute>
        <Attribute name="custom_label_0">${customLabels[0]}</Attribute>
        <Attribute name="custom_label_1">${customLabels[1]}</Attribute>
        <Attribute name="custom_label_2">${customLabels[2]}</Attribute>
        <Attribute name="custom_label_3">${customLabels[3]}</Attribute>
        <Attribute name="custom_label_4">${customLabels[4]}</Attribute>
      </DataObject>
    </pageMap>
  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:PageMap="http://www.google.com/schemas/sitemap-pagemap/1.0">
${xmlItems}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating page feed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
