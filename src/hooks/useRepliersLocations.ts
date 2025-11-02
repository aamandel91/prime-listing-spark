import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LocationSuggestion {
  id: string;
  name: string;
  type: "area" | "city" | "neighborhood";
  state: string;
  fullName: string;
  metadata?: {
    city?: string;
    area?: string;
    county?: string;
  };
}

interface LocationsAutocompleteResponse {
  locations: LocationSuggestion[];
  count: number;
}

/**
 * Hook to search locations using Repliers Autocomplete API
 */
export const useRepliersLocationsAutocomplete = (query: string, limit: number = 10) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const searchLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase.functions.invoke(
          "repliers-proxy",
          {
            body: {
              endpoint: "locations-autocomplete",
              params: {
                q: query,
                limit: limit.toString(),
              },
            },
          }
        );

        if (supabaseError) throw supabaseError;

        const response = data as LocationsAutocompleteResponse;
        setSuggestions(response.locations || []);
      } catch (err) {
        console.error("Error fetching location suggestions:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch suggestions");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, limit]);

  return { suggestions, loading, error };
};

/**
 * Hook to get detailed location information
 */
export const useRepliersLocations = (params: {
  type?: ("area" | "city" | "neighborhood")[];
  state?: string[];
  city?: string[];
  neighborhood?: string[];
  locationId?: string[];
}) => {
  const [locations, setLocations] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams: Record<string, string> = {};
        
        if (params.type) queryParams.type = params.type.join(",");
        if (params.state) queryParams.state = params.state.join(",");
        if (params.city) queryParams.city = params.city.join(",");
        if (params.neighborhood) queryParams.neighborhood = params.neighborhood.join(",");
        if (params.locationId) queryParams.locationId = params.locationId.join(",");

        const { data, error: supabaseError } = await supabase.functions.invoke(
          "repliers-proxy",
          {
            body: {
              endpoint: "locations",
              params: queryParams,
            },
          }
        );

        if (supabaseError) throw supabaseError;

        setLocations(data.locations || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [JSON.stringify(params)]);

  return { locations, loading, error };
};
