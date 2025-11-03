import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RepliersProperty } from "@/types/repliers";

interface SimilarListingsResponse {
  listings: RepliersProperty[];
  count: number;
}

/**
 * Hook to fetch similar listings for a given property using Repliers API
 */
export const useRepliersSimilar = (mlsNumber?: string) => {
  const [listings, setListings] = useState<RepliersProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mlsNumber) {
      setListings([]);
      return;
    }

    const fetchSimilarListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase.functions.invoke(
          "repliers-proxy",
          {
            body: {
              endpoint: `/similar/${mlsNumber}`,
              params: {},
            },
          }
        );

        if (supabaseError) throw supabaseError;

        const response = data as SimilarListingsResponse;
        setListings(response.listings || []);
      } catch (err) {
        console.error("Error fetching similar listings:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch similar listings");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarListings();
  }, [mlsNumber]);

  return { listings, loading, error };
};
