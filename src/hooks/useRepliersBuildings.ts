import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Building {
  id: string;
  name: string;
  address: {
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zip?: string;
    fullAddress?: string;
  };
  propertyType?: string;
  units?: number;
  metadata?: Record<string, any>;
}

interface BuildingsResponse {
  buildings: Building[];
  count: number;
}

interface BuildingsSearchParams {
  name?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  limit?: number;
}

/**
 * Hook to search for buildings (condos, apartments) using Repliers API
 */
export const useRepliersBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBuildings = async (params: BuildingsSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase.functions.invoke(
        "repliers-proxy",
        {
          body: {
            endpoint: "/buildings",
            params: {
              name: params.name,
              city: params.city,
              state: params.state,
              propertyType: params.propertyType,
              limit: params.limit || 20,
            },
          },
        }
      );

      if (supabaseError) throw supabaseError;

      const response = data as BuildingsResponse;
      setBuildings(response.buildings || []);
      return response.buildings || [];
    } catch (err) {
      console.error("Error searching buildings:", err);
      setError(err instanceof Error ? err.message : "Failed to search buildings");
      setBuildings([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { buildings, loading, error, searchBuildings };
};
