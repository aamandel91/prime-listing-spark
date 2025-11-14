import type { RepliersProperty } from '@/types/repliers';

export interface NormalizedProperty {
  // Core identification
  mlsNumber: string;
  listingId: string;
  
  // Pricing
  price: number;
  priceFormatted: string;
  originalPrice?: number;
  pricePerSqft?: number;
  
  // Address (normalized)
  address: {
    full: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    county?: string;
    neighborhood?: string;
  };
  
  // Key stats
  beds: number;
  baths: number;
  sqft: number;
  lotSize?: number;
  lotSizeSqft?: number;
  acres?: number;
  yearBuilt?: number;
  
  // Property details
  propertyType: string;
  propertyClass: string;
  status: string;
  standardStatus?: string;
  daysOnMarket: number;
  listDate?: string;
  
  // Media
  images: string[];
  virtualTourUrl?: string;
  
  // Rich data
  description: string;
  
  // Features
  features: {
    interior: Record<string, any>;
    exterior: Record<string, any>;
    utilities: Record<string, any>;
    parking: Record<string, any>;
  };
  
  // Location
  location: {
    latitude: number;
    longitude: number;
    county?: string;
    neighborhood?: string;
  };
  
  // HOA
  hoa?: {
    fees?: number;
    frequency?: string;
    amenities?: string[];
  };
  
  // Agent info
  agent?: {
    name: string;
    phone?: string;
    email?: string;
    brokerage?: string;
  };
  
  // Open house
  openHouse?: Array<{
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
  }>;
  
  // Taxes
  taxes?: {
    annualAmount?: number;
    assessmentYear?: string;
  };
  
  // Raw API data (for edge cases)
  _raw: RepliersProperty;
}

/**
 * Normalize a Repliers API property into a consistent internal format
 */
export function normalizeProperty(raw: RepliersProperty): NormalizedProperty {
  // Calculate derived values
  const sqft = parseFloat(String(raw.details?.sqft || 0));
  const price = raw.listPrice || 0;
  const pricePerSqft = sqft > 0 ? Math.round(price / sqft) : undefined;
  
  // Build full address
  const streetNumber = raw.address?.streetNumber || '';
  const streetName = raw.address?.streetName || '';
  const streetSuffix = raw.address?.streetSuffix || '';
  const street = `${streetNumber} ${streetName} ${streetSuffix}`.trim();
  const city = raw.address?.city || raw.address?.City || raw.City || '';
  const state = raw.address?.state || raw.address?.StateOrProvince || raw.StateOrProvince || '';
  const zip = raw.address?.zip || '';
  const fullAddress = `${street}, ${city}, ${state} ${zip}`;
  
  // Get county from multiple possible locations
  const county = raw.address?.county || raw.address?.CountyOrParish || raw.CountyOrParish;
  
  // Extract features
  const interior: Record<string, any> = {
    bedrooms: raw.details?.numBedrooms || 0,
    bathrooms: raw.details?.numBathrooms || 0,
    sqft: sqft,
    yearBuilt: raw.details?.yearBuilt,
    stories: raw.details?.stories,
    basement: raw.details?.basement,
    flooring: raw.details?.flooringType,
    heating: raw.details?.heating,
    cooling: raw.details?.airConditioning,
  };
  
  const exterior: Record<string, any> = {
    lotSize: raw.lot?.acres,
    lotSizeSqft: raw.lot?.squareFeet,
    construction: raw.details?.exteriorConstruction1,
    roof: raw.details?.roofMaterial,
    foundation: raw.details?.foundationType,
    patio: raw.details?.patio,
    pool: raw.details?.pool,
    waterfront: raw.details?.waterfront,
  };
  
  const utilities: Record<string, any> = {
    sewer: raw.details?.sewer,
  };
  
  const parking: Record<string, any> = {
    garageSpaces: raw.details?.numGarageSpaces,
    parkingSpaces: raw.details?.numParkingSpaces,
  };
  
  // Extract HOA info
  const hoa = raw.condominium?.fees ? {
    fees: raw.condominium.fees.maintenance,
    frequency: raw.condominium.fees.frequency,
    amenities: raw.condominium.amenities,
  } : undefined;
  
  // Extract agent info
  const primaryAgent = raw.agents?.[0];
  const agent = primaryAgent ? {
    name: primaryAgent.name,
    phone: primaryAgent.phones?.[0],
    email: primaryAgent.email,
    brokerage: primaryAgent.brokerage?.name || raw.office?.brokerageName,
  } : undefined;
  
  return {
    mlsNumber: raw.mlsNumber,
    listingId: raw.mlsNumber,
    
    price,
    priceFormatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price),
    originalPrice: raw.originalPrice,
    pricePerSqft,
    
    address: {
      full: fullAddress,
      street,
      city,
      state,
      zip,
      county,
      neighborhood: raw.address?.neighborhood,
    },
    
    beds: raw.details?.numBedrooms || 0,
    baths: raw.details?.numBathrooms || 0,
    sqft,
    lotSize: raw.lot?.acres,
    lotSizeSqft: raw.lot?.squareFeet,
    acres: raw.lot?.acres,
    yearBuilt: raw.details?.yearBuilt ? parseInt(String(raw.details.yearBuilt)) : undefined,
    
    propertyType: raw.details?.propertyType || 'Unknown',
    propertyClass: raw.class || 'Unknown',
    status: raw.lastStatus || 'Unknown',
    standardStatus: raw.standardStatus,
    daysOnMarket: raw.daysOnMarket || 0,
    listDate: raw.listDate,
    
    images: raw.images || [],
    
    description: raw.details?.description || '',
    
    features: {
      interior,
      exterior,
      utilities,
      parking,
    },
    
    location: {
      latitude: raw.map?.latitude || 0,
      longitude: raw.map?.longitude || 0,
      county,
      neighborhood: raw.address?.neighborhood,
    },
    
    hoa,
    agent,
    openHouse: raw.openHouse,
    
    taxes: raw.taxes ? {
      annualAmount: raw.taxes.annualAmount,
      assessmentYear: raw.taxes.assessmentYear,
    } : undefined,
    
    _raw: raw,
  };
}
