import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PropertyEstimate {
  estimateId: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  estimatedValue: number;
  confidence: "high" | "medium" | "low";
  lastUpdated: string;
  valueRange?: {
    low: number;
    high: number;
  };
}

interface EstimatesResponse {
  estimates: PropertyEstimate[];
  total: number;
}

/**
 * Hook to manage property estimates via Repliers API
 */
export const useRepliersEstimates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get estimates by clientId or estimateId
   */
  const getEstimates = useCallback(async (params: {
    clientId?: number;
    estimateId?: number;
    pageNum?: number;
    resultsPerPage?: number;
  }): Promise<EstimatesResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {};
      if (params.clientId) queryParams.clientId = params.clientId.toString();
      if (params.estimateId) queryParams.estimateId = params.estimateId.toString();
      if (params.pageNum) queryParams.pageNum = params.pageNum.toString();
      if (params.resultsPerPage) queryParams.resultsPerPage = params.resultsPerPage.toString();

      const { data, error: supabaseError } = await supabase.functions.invoke(
        "repliers-proxy",
        {
          body: {
            endpoint: "estimates",
            params: queryParams,
          },
        }
      );

      if (supabaseError) throw supabaseError;

      return data as EstimatesResponse;
    } catch (err) {
      console.error("Error fetching estimates:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch estimates");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new estimate
   */
  const createEstimate = useCallback(async (estimateData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
  }): Promise<PropertyEstimate | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase.functions.invoke(
        "repliers-proxy",
        {
          body: {
            endpoint: "estimates",
            method: "POST",
            data: estimateData,
          },
        }
      );

      if (supabaseError) throw supabaseError;

      return data as PropertyEstimate;
    } catch (err) {
      console.error("Error creating estimate:", err);
      setError(err instanceof Error ? err.message : "Failed to create estimate");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing estimate
   */
  const updateEstimate = useCallback(async (
    estimateId: number,
    updateData: Partial<PropertyEstimate>
  ): Promise<PropertyEstimate | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase.functions.invoke(
        "repliers-proxy",
        {
          body: {
            endpoint: `estimates/${estimateId}`,
            method: "PUT",
            data: updateData,
          },
        }
      );

      if (supabaseError) throw supabaseError;

      return data as PropertyEstimate;
    } catch (err) {
      console.error("Error updating estimate:", err);
      setError(err instanceof Error ? err.message : "Failed to update estimate");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getEstimates,
    createEstimate,
    updateEstimate,
    loading,
    error,
  };
};
