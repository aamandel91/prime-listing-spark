import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RepliersProperty {
  mlsNumber: string;
  listPrice: number;
  originalPrice?: number;
  listDate?: string;
  standardStatus?: string;
  class?: string;
  address: {
    streetNumber: string;
    streetName: string;
    streetSuffix: string;
    city: string;
    state: string;
    zip: string;
    neighborhood?: string;
    area?: string;
  };
  details: {
    numBedrooms: number;
    numBathrooms: number;
    sqft: string;
    yearBuilt: string;
    description: string;
    propertyType: string;
    style: string;
    airConditioning?: string;
    heating?: string;
    flooringType?: string;
    extras?: string;
    exteriorConstruction1?: string;
    roofMaterial?: string;
    foundationType?: string;
    patio?: string;
    sewer?: string;
    numGarageSpaces?: number;
    numParkingSpaces?: number;
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
    squareFeet?: number;
    features?: string;
    legalDescription?: string;
  };
  openHouse?: Array<any>;
  agents?: Array<{
    name: string;
    phones?: string[];
    email?: string;
    brokerage?: {
      name: string;
    };
  }>;
  office?: {
    brokerageName?: string;
  };
  condominium?: {
    fees?: {
      maintenance?: number;
    };
    condoCorp?: string;
    parkingType?: string;
  };
  nearby?: {
    amenities?: string[];
  };
  taxes?: {
    annualAmount?: number;
    assessmentYear?: string;
  };
  rooms?: Array<{
    description: string;
    features?: string;
    level?: string;
  }>;
  avm?: {
    value: number;
    high: number;
    low: number;
  };
  estimate?: {
    date: string;
    high: number;
    low: number;
    confidence: number;
  };
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
  minSqft?: number;
  maxSqft?: number;
  minYearBuilt?: number;
  maxYearBuilt?: number;
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
          endpoint: `/listings`,
          params: { mlsNumber: id },
        },
      });

      if (error) {
        console.error('Error fetching listing:', error);
        throw error;
      }

      // Extract first listing from response
      const listing = data?.listings?.[0] || data?.[0];
      return listing;
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

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching property details for MLS:', id);
        const data = await getListingById(id);
        console.log('Property detail data received:', data);
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
