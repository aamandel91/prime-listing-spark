import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  RepliersProperty, 
  RepliersSearchParams, 
  RepliersAPIResponse,
  RepliersProxyRequest,
  isRepliersAPIResponse 
} from '@/types/repliers';

export const useRepliers = () => {
  const searchListings = async (params: RepliersSearchParams = {}): Promise<RepliersAPIResponse<RepliersProperty>> => {
    try {
      const requestBody: RepliersProxyRequest = {
        endpoint: '/listings',
        params: Object.fromEntries(
          Object.entries(params).filter(([key, value]) => {
            // Exclude undefined, null, and empty strings
            if (value === undefined || value === null || value === '') return false;
            // Exclude 0 for price fields (Repliers API requires minPrice > 0)
            if ((key === 'minPrice' || key === 'maxPrice') && value === 0) return false;
            return true;
          })
        ),
      };

      const { data, error } = await supabase.functions.invoke<RepliersAPIResponse<RepliersProperty>>(
        'repliers-proxy',
        { body: requestBody }
      );

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      return data as RepliersAPIResponse<RepliersProperty>;
    } catch (error) {
      console.error('Error in searchListings:', error);
      throw error;
    }
  };

  const getListingById = async (id: string): Promise<RepliersProperty | null> => {
    try {
      // Use the dedicated single listing endpoint for better performance
      const requestBody: RepliersProxyRequest = {
        endpoint: `/listings/${id}`,
        params: {},
      };

      const { data, error } = await supabase.functions.invoke(
        'repliers-proxy',
        { body: requestBody }
      );

      if (error) {
        console.error('Error fetching listing:', error);
        throw error;
      }

      // Single listing endpoint returns the listing object directly
      return data || null;
    } catch (error) {
      console.error('Error in getListingById:', error);
      return null;
    }
  };

  return {
    searchListings,
    getListingById,
  };
};

export const useRepliersListings = (params: RepliersSearchParams = {}) => {
  const [listings, setListings] = useState<RepliersProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { searchListings } = useRepliers();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchListings(params);
        console.log('Repliers API response:', data);
        
        // Handle different response structures
        const listingsArray = data?.listings || data?.data || data || [];
        console.log('Parsed listings array:', listingsArray);
        
        setListings(Array.isArray(listingsArray) ? listingsArray : []);
        setTotalCount(data?.count || 0);
        
        // Check if there are more pages
        const currentPage = data?.page || 1;
        const numPages = data?.numPages || 1;
        setHasMore(currentPage < numPages);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching listings:', err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [JSON.stringify(params)]);

  return { listings, loading, error, totalCount, hasMore };
};

export const useRepliersListing = (id: string) => {
  const [listing, setListing] = useState<RepliersProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getListingById } = useRepliers();

  const fetchListing = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching property details for MLS:', id);
      const data = await getListingById(id);
      console.log('Property detail data received:', data);
      setListing(data);
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError(err as Error);
      setListing(null);
    } finally {
      setLoading(false);
    }
  }, [id, getListingById]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const retry = useCallback(() => {
    fetchListing();
  }, [fetchListing]);

  return { listing, loading, error, retry };
};
