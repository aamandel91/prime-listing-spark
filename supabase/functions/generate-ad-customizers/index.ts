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
    console.log('Generating Ad Customizers feed...');

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
    console.log(`Processing ${listings.length} listings for ad customizers`);

    // Group listings by city for counts and price ranges
    const cityStats = listings.reduce((acc: any, listing: any) => {
      const city = listing.address?.city || 'Unknown';
      if (!acc[city]) {
        acc[city] = {
          count: 0,
          prices: [],
          beds: [],
          propertyTypes: {},
        };
      }
      acc[city].count++;
      acc[city].prices.push(listing.listPrice || 0);
      acc[city].beds.push(listing.bedroomsTotal || 0);
      
      const propType = listing.propertyType || 'Residential';
      acc[city].propertyTypes[propType] = (acc[city].propertyTypes[propType] || 0) + 1;
      
      return acc;
    }, {});

    // Generate CSV rows for ad customizers
    const csvRows = Object.entries(cityStats).map(([city, stats]: [string, any]) => {
      const avgPrice = Math.round(stats.prices.reduce((a: number, b: number) => a + b, 0) / stats.prices.length);
      const minPrice = Math.min(...stats.prices);
      const maxPrice = Math.max(...stats.prices);
      const mostCommonType = Object.entries(stats.propertyTypes)
        .sort(([, a]: any, [, b]: any) => b - a)[0]?.[0] || 'Home';

      return [
        city,                           // Target location
        stats.count,                    // Property count
        `$${Math.round(avgPrice / 1000)}K`,  // Average price formatted
        `$${Math.round(minPrice / 1000)}K`,  // Min price
        `$${Math.round(maxPrice / 1000)}K`,  // Max price
        mostCommonType,                 // Most common property type
        new Date().toISOString().split('T')[0], // Last updated
      ].join('\t');
    });

    // Add header row
    const csv = [
      'Target location\tProperty Count\tAverage Price\tMin Price\tMax Price\tProperty Type\tLast Updated',
      ...csvRows
    ].join('\n');

    return new Response(csv, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/tab-separated-values',
        'Content-Disposition': 'attachment; filename="ad-customizers.tsv"',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating ad customizers:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
