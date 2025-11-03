const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating listings sitemap...');

    const apiKey = Deno.env.get('REPLIERS_API_KEY');
    if (!apiKey) {
      throw new Error('REPLIERS_API_KEY not configured');
    }

    const baseUrl = req.headers.get('origin') || 'https://yourdomain.com';

    // Fetch active listings from Repliers API
    const response = await fetch('https://api.repliers.io/listings?limit=5000&standardStatus=A', {
      headers: {
        'REPLIERS-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Repliers API error: ${response.status}`);
    }

    const data = await response.json();
    const listings = data.listings || [];

    console.log(`Found ${listings.length} active listings`);

    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    listings.forEach((listing: any) => {
      const mlsNumber = listing.mlsNumber || listing.id;
      if (!mlsNumber) return;

      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/property/${mlsNumber}</loc>\n`;
      
      // Use list date if available
      if (listing.listDate) {
        const date = new Date(listing.listDate).toISOString().split('T')[0];
        xml += `    <lastmod>${date}</lastmod>\n`;
      }
      
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    console.log(`Generated listings sitemap with ${listings.length} URLs`);

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating listings sitemap:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
