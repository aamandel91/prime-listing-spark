import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MarketStats {
  activeListings: number;
  newListings: number;
  avgDaysOnMarket30d: number;
  avgDaysOnMarket90d: number;
  avgDaysOnMarket1y: number;
  soldCount30d: number;
  soldCount90d: number;
  soldCount1y: number;
  medianPrice30d: number;
  medianPrice90d: number;
  medianPrice1y: number;
  priceChange30d: number;
  priceChange90d: number;
  priceChange1y: number;
}

interface MarketStatsParams {
  city?: string;
  state?: string;
  neighborhood?: string;
  propertyType?: string;
}

/**
 * Hook to fetch market statistics for a location
 */
export const useRepliersMarketStats = (params: MarketStatsParams) => {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.city && !params.state && !params.neighborhood) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase.functions.invoke(
          "repliers-market-stats",
          {
            body: {
              city: params.city,
              state: params.state,
              neighborhood: params.neighborhood,
              propertyType: params.propertyType,
            },
          }
        );

        if (supabaseError) throw supabaseError;

        setStats(data as MarketStats);
      } catch (err) {
        console.error("Error fetching market stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch market statistics");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [params.city, params.state, params.neighborhood, params.propertyType]);

  return { stats, loading, error };
};
