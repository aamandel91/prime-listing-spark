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
    const { city, state, neighborhood, propertyType } = await req.json();
    const REPLIERS_API_KEY = Deno.env.get('REPLIERS_API_KEY');

    if (!REPLIERS_API_KEY) {
      throw new Error('REPLIERS_API_KEY not configured');
    }

    // Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Build query params
    const baseParams = new URLSearchParams();
    if (city) baseParams.set('city', city);
    if (state) baseParams.set('state', state);
    if (neighborhood) baseParams.set('neighborhood', neighborhood);
    if (propertyType) baseParams.set('propertyTypeOrStyle', propertyType);

    // Fetch active listings
    const activeParams = new URLSearchParams(baseParams);
    activeParams.set('status', 'A');
    const activeResponse = await fetch(
      `https://api.repliers.io/listings?${activeParams.toString()}`,
      {
        headers: {
          'REPLIERS-API-KEY': REPLIERS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const activeData = await activeResponse.json();

    // Fetch new listings (last 7 days)
    const newParams = new URLSearchParams(baseParams);
    newParams.set('status', 'A');
    newParams.set('listDate', `${formatDate(sevenDaysAgo)}..${formatDate(now)}`);
    const newResponse = await fetch(
      `https://api.repliers.io/listings?${newParams.toString()}`,
      {
        headers: {
          'REPLIERS-API-KEY': REPLIERS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const newData = await newResponse.json();

    // Fetch sold listings - 30 days
    const sold30Params = new URLSearchParams(baseParams);
    sold30Params.set('status', 'S');
    sold30Params.set('closeDate', `${formatDate(thirtyDaysAgo)}..${formatDate(now)}`);
    const sold30Response = await fetch(
      `https://api.repliers.io/listings?${sold30Params.toString()}`,
      {
        headers: {
          'REPLIERS-API-KEY': REPLIERS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const sold30Data = await sold30Response.json();

    // Fetch sold listings - 90 days
    const sold90Params = new URLSearchParams(baseParams);
    sold90Params.set('status', 'S');
    sold90Params.set('closeDate', `${formatDate(ninetyDaysAgo)}..${formatDate(now)}`);
    const sold90Response = await fetch(
      `https://api.repliers.io/listings?${sold90Params.toString()}`,
      {
        headers: {
          'REPLIERS-API-KEY': REPLIERS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const sold90Data = await sold90Response.json();

    // Fetch sold listings - 1 year
    const sold1yParams = new URLSearchParams(baseParams);
    sold1yParams.set('status', 'S');
    sold1yParams.set('closeDate', `${formatDate(oneYearAgo)}..${formatDate(now)}`);
    const sold1yResponse = await fetch(
      `https://api.repliers.io/listings?${sold1yParams.toString()}`,
      {
        headers: {
          'REPLIERS-API-KEY': REPLIERS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const sold1yData = await sold1yResponse.json();

    // Calculate statistics
    const calculateAvgDaysOnMarket = (listings: any[]) => {
      if (!listings || listings.length === 0) return 0;
      const validListings = listings.filter((l: any) => l.daysOnMarket > 0);
      if (validListings.length === 0) return 0;
      return Math.round(validListings.reduce((sum: number, l: any) => sum + l.daysOnMarket, 0) / validListings.length);
    };

    const calculateMedianPrice = (listings: any[]) => {
      if (!listings || listings.length === 0) return 0;
      const prices = listings
        .filter((l: any) => l.closePrice || l.listPrice)
        .map((l: any) => l.closePrice || l.listPrice)
        .sort((a: number, b: number) => a - b);
      if (prices.length === 0) return 0;
      const mid = Math.floor(prices.length / 2);
      return prices.length % 2 === 0 ? (prices[mid - 1] + prices[mid]) / 2 : prices[mid];
    };

    const avgDaysOnMarket30d = calculateAvgDaysOnMarket(sold30Data.listings || []);
    const avgDaysOnMarket90d = calculateAvgDaysOnMarket(sold90Data.listings || []);
    const avgDaysOnMarket1y = calculateAvgDaysOnMarket(sold1yData.listings || []);

    const medianPrice30d = calculateMedianPrice(sold30Data.listings || []);
    const medianPrice90d = calculateMedianPrice(sold90Data.listings || []);
    const medianPrice1y = calculateMedianPrice(sold1yData.listings || []);

    // Calculate price changes
    const priceChange30d = medianPrice90d > 0 ? ((medianPrice30d - medianPrice90d) / medianPrice90d) * 100 : 0;
    const priceChange90d = medianPrice1y > 0 ? ((medianPrice90d - medianPrice1y) / medianPrice1y) * 100 : 0;
    const priceChange1y = medianPrice1y > 0 ? 0 : 0; // Would need historical data

    const stats = {
      activeListings: activeData.count || 0,
      newListings: newData.count || 0,
      avgDaysOnMarket30d,
      avgDaysOnMarket90d,
      avgDaysOnMarket1y,
      soldCount30d: sold30Data.count || 0,
      soldCount90d: sold90Data.count || 0,
      soldCount1y: sold1yData.count || 0,
      medianPrice30d: Math.round(medianPrice30d),
      medianPrice90d: Math.round(medianPrice90d),
      medianPrice1y: Math.round(medianPrice1y),
      priceChange30d: Math.round(priceChange30d * 10) / 10,
      priceChange90d: Math.round(priceChange90d * 10) / 10,
      priceChange1y: Math.round(priceChange1y * 10) / 10,
    };

    console.log('Market stats calculated:', stats);

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
