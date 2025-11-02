import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface NearbyPlace {
  name: string;
  category: string;
  distance: number; // in meters
  rating?: number;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface PlacesResponse {
  places: NearbyPlace[];
  center: {
    lat: number;
    lng: number;
  };
}

/**
 * Hook to fetch nearby places/amenities for a location
 */
export const useRepliersPlaces = (latitude?: number, longitude?: number) => {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) {
      setPlaces([]);
      return;
    }

    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase.functions.invoke(
          "repliers-proxy",
          {
            body: {
              endpoint: "places",
              params: {
                lat: latitude.toString(),
                long: longitude.toString(),
              },
            },
          }
        );

        if (supabaseError) throw supabaseError;

        const response = data as PlacesResponse;
        setPlaces(response.places || []);
      } catch (err) {
        console.error("Error fetching nearby places:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch nearby places");
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [latitude, longitude]);

  return { places, loading, error };
};

/**
 * Group places by category for easier display
 */
export const groupPlacesByCategory = (places: NearbyPlace[]) => {
  return places.reduce((acc, place) => {
    const category = place.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(place);
    return acc;
  }, {} as Record<string, NearbyPlace[]>);
};
