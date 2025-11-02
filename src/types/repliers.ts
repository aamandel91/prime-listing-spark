/**
 * Repliers Real Estate API Type Definitions
 * Based on the Repliers API specification
 */

// ==================== Core Types ====================

export interface RepliersAPIResponse<T = any> {
  listings?: T[];
  data?: T[];
  count?: number;
  page?: number;
  numPages?: number;
  limit?: number;
  offset?: number;
}

export interface RepliersError {
  error: string;
  details?: string;
  status?: number;
}

// ==================== Property Types ====================

export interface RepliersProperty {
  mlsNumber: string;
  listPrice: number;
  originalPrice?: number;
  listDate?: string;
  standardStatus?: PropertyStatus;
  class?: PropertyClass;
  address: PropertyAddress;
  details: PropertyDetails;
  images: string[];
  map: PropertyCoordinates;
  lastStatus: string;
  daysOnMarket: number;
  lot?: PropertyLot;
  openHouse?: OpenHouseEvent[];
  agents?: PropertyAgent[];
  office?: PropertyOffice;
  condominium?: CondominiumInfo;
  nearby?: NearbyAmenities;
  taxes?: PropertyTaxes;
  rooms?: PropertyRoom[];
  avm?: AutomatedValuation;
  estimate?: PropertyEstimate;
  // Alternative property names used by some MLS systems (top-level)
  City?: string;
  StateOrProvince?: string;
  CountyOrParish?: string;
}

export interface PropertyAddress {
  streetNumber: string;
  streetName: string;
  streetSuffix: string;
  city: string;
  state: string;
  zip: string;
  neighborhood?: string;
  area?: string;
  fullAddress?: string;
  county?: string;
  // Alternative property names used by some MLS systems
  City?: string;
  StateOrProvince?: string;
  CountyOrParish?: string;
}

export interface PropertyDetails {
  numBedrooms: number;
  numBathrooms: number;
  sqft: string | number;
  yearBuilt: string | number;
  description: string;
  propertyType: PropertyType;
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
  pool?: boolean;
  waterfront?: boolean;
  basement?: string;
  stories?: number;
}

export interface PropertyCoordinates {
  latitude: number;
  longitude: number;
}

export interface PropertyLot {
  acres: number;
  squareFeet?: number;
  features?: string;
  legalDescription?: string;
  dimensions?: string;
}

export interface OpenHouseEvent {
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface PropertyAgent {
  name: string;
  phones?: string[];
  email?: string;
  licenseNumber?: string;
  brokerage?: {
    name: string;
    phone?: string;
  };
}

export interface PropertyOffice {
  brokerageName?: string;
  phone?: string;
  mlsId?: string;
}

export interface CondominiumInfo {
  fees?: {
    maintenance?: number;
    frequency?: string;
  };
  condoCorp?: string;
  parkingType?: string;
  lockerNumber?: string;
  exposures?: string[];
  amenities?: string[];
}

export interface NearbyAmenities {
  amenities?: string[];
  schools?: SchoolInfo[];
  distance?: {
    [key: string]: number;
  };
}

export interface SchoolInfo {
  name: string;
  type: string;
  distance?: number;
  rating?: number;
}

export interface PropertyTaxes {
  annualAmount?: number;
  assessmentYear?: string;
  taxYear?: string;
}

export interface PropertyRoom {
  description: string;
  features?: string;
  level?: string;
  dimensions?: string;
}

export interface AutomatedValuation {
  value: number;
  high: number;
  low: number;
  confidence?: number;
  date?: string;
}

export interface PropertyEstimate {
  date: string;
  high: number;
  low: number;
  confidence: number;
  value?: number;
}

// ==================== Enums and Union Types ====================

export type PropertyStatus = 
  | 'Active'
  | 'Pending'
  | 'Sold'
  | 'Closed'
  | 'Expired'
  | 'Withdrawn'
  | 'Coming Soon'
  | 'A'  // Active (short code)
  | 'P'  // Pending (short code)
  | 'S'  // Sold (short code)
  | string; // Allow other status codes

export type PropertyClass = 
  | 'Residential'
  | 'ResidentialLease'
  | 'Commercial'
  | 'CommercialLease'
  | 'Land'
  | 'MultiFamily';

export type PropertyType = 
  | 'Single Family'
  | 'Condominium'
  | 'Townhouse'
  | 'Multi-Family'
  | 'Land'
  | 'Commercial'
  | 'Mobile Home'
  | 'Cooperative'
  | string; // Allow other types

// ==================== Search Parameters ====================

export interface RepliersSearchParams {
  // Location filters
  city?: string;
  state?: string;
  county?: string;
  zip?: string;
  neighborhood?: string;
  area?: string;
  
  // Price filters
  minPrice?: number;
  maxPrice?: number;
  
  // Property characteristics
  bedrooms?: number;
  minBedrooms?: number;
  bathrooms?: number;
  minBathrooms?: number;
  propertyType?: PropertyType | PropertyType[];
  propertyTypeOrStyle?: string | string[];
  propertyClass?: PropertyClass;
  
  // Status filters
  status?: PropertyStatus;
  standardStatus?: PropertyStatus;
  
  // Size filters
  minSqft?: number;
  maxSqft?: number;
  minLotSizeSqft?: number;
  maxLotSizeSqft?: number;
  minAcres?: number;
  maxAcres?: number;
  
  // Features
  minGarageSpaces?: number;
  minParkingSpaces?: number;
  pool?: boolean;
  waterfront?: boolean;
  
  // Year built
  minYearBuilt?: number;
  maxYearBuilt?: number;
  
  // Pagination
  limit?: number;
  offset?: number;
  page?: number;
  
  // Sorting
  sort?: 'price' | '-price' | 'date' | '-date' | 'sqft' | '-sqft';
  
  // Geographic search
  latitude?: number;
  longitude?: number;
  radius?: number;
  
  // MLS specific
  mlsNumber?: string;
  officeId?: string;
  agentId?: string;
}

// ==================== Edge Function Types ====================

export interface RepliersProxyRequest {
  endpoint: string;
  params?: RepliersSearchParams | Record<string, any>;
  method?: 'GET' | 'POST';
}

export interface RepliersProxyResponse<T = RepliersProperty> {
  listings?: T[];
  data?: T[];
  count?: number;
  page?: number;
  numPages?: number;
  limit?: number;
  offset?: number;
  error?: string;
}

// ==================== Helper Types ====================

export type RepliersPropertyPartial = Partial<RepliersProperty>;

export interface PropertySearchResult {
  properties: RepliersProperty[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PropertyDetailResult {
  property: RepliersProperty | null;
  similarProperties?: RepliersProperty[];
  error?: string;
}

// ==================== Type Guards ====================

export function isRepliersProperty(obj: any): obj is RepliersProperty {
  return (
    obj &&
    typeof obj === 'object' &&
    'mlsNumber' in obj &&
    'address' in obj &&
    'details' in obj
  );
}

export function isRepliersAPIResponse(obj: any): obj is RepliersAPIResponse {
  return (
    obj &&
    typeof obj === 'object' &&
    ('listings' in obj || 'data' in obj)
  );
}

export function isRepliersError(obj: any): obj is RepliersError {
  return obj && typeof obj === 'object' && 'error' in obj;
}
