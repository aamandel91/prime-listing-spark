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
    const { city, citySlug, state } = await req.json();
    console.log(`Generating content for ${city}, ${state}`);

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    const REPLIERS_API_KEY = Deno.env.get('REPLIERS_API_KEY');

    // Fetch real property data from Repliers API
    console.log('Fetching property data from Repliers...');
    const repliersUrl = `https://api.repliers.io/listings?key=${REPLIERS_API_KEY}&city=${encodeURIComponent(city)}&state=${state}&limit=100`;
    
    const repliersResponse = await fetch(repliersUrl);
    const repliersData = await repliersResponse.json();
    
    const properties = repliersData.results || [];
    console.log(`Found ${properties.length} properties`);

    // Calculate real statistics
    const activeListings = properties.filter((p: any) => p.status === 'A').length;
    const prices = properties.map((p: any) => p.price).filter((p: number) => p > 0);
    const medianPrice = prices.length > 0 
      ? prices.sort((a: number, b: number) => a - b)[Math.floor(prices.length / 2)]
      : 0;

    // Extract neighborhoods
    const neighborhoodMap = new Map();
    properties.forEach((p: any) => {
      if (p.neighborhood) {
        if (!neighborhoodMap.has(p.neighborhood)) {
          neighborhoodMap.set(p.neighborhood, { prices: [], count: 0 });
        }
        const hood = neighborhoodMap.get(p.neighborhood);
        if (p.price > 0) hood.prices.push(p.price);
        hood.count++;
      }
    });

    const topNeighborhoods = Array.from(neighborhoodMap.entries())
      .filter(([_, data]: any) => data.count >= 3)
      .sort((a: any, b: any) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]: any) => {
        const avgPrice = data.prices.length > 0
          ? Math.round(data.prices.reduce((a: number, b: number) => a + b, 0) / data.prices.length)
          : 0;
        return {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          avgPrice: `$${Math.round(avgPrice / 1000)}K`,
        };
      });

    // Property types
    const propertyTypes = properties.reduce((acc: any, p: any) => {
      const type = p.propertyType || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const propertyTypesList = Object.entries(propertyTypes)
      .map(([type, count]) => ({ type, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 4);

    // Use Firecrawl to scrape competitor content for inspiration (if API key exists)
    let competitorInsights = '';
    if (FIRECRAWL_API_KEY) {
      try {
        console.log('Scraping competitor for insights...');
        const competitorUrl = `https://www.zillow.com/${city.toLowerCase()}-${state.toLowerCase()}/`;
        
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: competitorUrl,
            formats: ['markdown'],
          }),
        });

        if (firecrawlResponse.ok) {
          const firecrawlData = await firecrawlResponse.json();
          competitorInsights = firecrawlData.markdown?.substring(0, 1000) || '';
          console.log('Got competitor insights');
        }
      } catch (error) {
        console.log('Could not fetch competitor data:', error);
      }
    }

    // Generate unique description
    const description = `${city} is a dynamic city in ${state}, offering diverse real estate opportunities. ` +
      `With ${activeListings} active listings and a median price of $${Math.round(medianPrice / 1000)}K, ` +
      `${city} presents options for every buyer. Popular neighborhoods include ${topNeighborhoods.slice(0, 3).map((n: any) => n.name).join(', ')}. ` +
      `The market features ${propertyTypesList[0]?.type || 'residential'} properties as the primary type, ` +
      `with ${propertyTypesList.length} different property categories available.`;

    const result = {
      city,
      citySlug,
      state,
      description,
      stats: {
        medianPrice: `$${Math.round(medianPrice / 1000)}K`,
        activeListings,
        avgDaysOnMarket: 30, // Default value
        schools: '7.5/10', // Default value
      },
      neighborhoods: topNeighborhoods,
      propertyTypes: propertyTypesList,
      heroImage: `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80`,
      rawPropertyCount: properties.length,
      competitorInsights: competitorInsights ? 'Used competitor insights' : 'No competitor data',
    };

    console.log('Content generation complete');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating city content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
