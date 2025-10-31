import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RepliersProperty {
  mlsNumber: string;
  listPrice: number;
  address: {
    streetNumber: string;
    streetName: string;
    streetSuffix: string;
    city: string;
    state: string;
    zip: string;
    neighborhood?: string;
  };
  details: {
    numBedrooms: number;
    numBathrooms: number;
    sqft: string;
    yearBuilt: string;
    description: string;
    propertyType: string;
    style: string;
  };
  images: string[];
  map: {
    latitude: number;
    longitude: number;
  };
  lastStatus: string;
  daysOnMarket: number;
  lot?: {
    acres: number;
  };
  openHouse?: Array<any>;
}

export interface RepliersSearchParams {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const useRepliers = () => {
  const searchListings = async (params: RepliersSearchParams = {}) => {
    try {
      const { data, error } = await supabase.functions.invoke('repliers-proxy', {
        body: {
          endpoint: '/listings',
          params: Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
          ),
        },
      });

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in searchListings:', error);
      throw error;
    }
  };

  const getListingById = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('repliers-proxy', {
        body: {
          endpoint: `/listing/${id}`,
          params: {},
        },
      });

      if (error) {
        console.error('Error fetching listing:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getListingById:', error);
      throw error;
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

  return { listings, loading, error };
};

export const useRepliersListing = (id: string) => {
  const [listing, setListing] = useState<RepliersProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getListingById } = useRepliers();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  return { listing, loading, error };
};
