import { useState, useEffect } from "react";
import { RepliersProperty } from "@/types/repliers";

const STORAGE_KEY = "property_comparison";
const MAX_PROPERTIES = 4;

export interface ComparisonProperty {
  mls: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt?: number;
  lotSize?: number;
  propertyType: string;
  status: string;
  daysOnMarket: number;
  images: string[];
  listDate: string;
  propertyClass?: string;
  hoaFee?: number;
  garageSpaces?: number;
  pool?: boolean;
  waterfront?: boolean;
}

export const usePropertyComparison = () => {
  const [selectedProperties, setSelectedProperties] = useState<ComparisonProperty[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSelectedProperties(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading comparison properties:", error);
      }
    }
  }, []);

  // Save to localStorage whenever properties change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProperties));
  }, [selectedProperties]);

  const addProperty = (property: RepliersProperty) => {
    if (selectedProperties.length >= MAX_PROPERTIES) {
      return false; // Can't add more
    }

    // Check if already added
    if (selectedProperties.some(p => p.mls === property.mlsNumber)) {
      return false;
    }

    const comparisonProperty: ComparisonProperty = {
      mls: property.mlsNumber,
      address: property.address.fullAddress || `${property.address.streetNumber} ${property.address.streetName}`,
      city: property.address.city,
      state: property.address.state,
      zipcode: property.address.zip,
      price: property.listPrice || 0,
      beds: property.details.numBedrooms || 0,
      baths: property.details.numBathrooms || 0,
      sqft: typeof property.details.sqft === 'string' ? parseInt(property.details.sqft) : (property.details.sqft || 0),
      yearBuilt: typeof property.details.yearBuilt === 'string' ? parseInt(property.details.yearBuilt) : property.details.yearBuilt,
      lotSize: property.lot?.squareFeet,
      propertyType: property.details.propertyType || "",
      status: property.lastStatus || "",
      daysOnMarket: property.daysOnMarket || 0,
      images: property.images || [],
      listDate: property.listDate || "",
      propertyClass: property.details.style,
      hoaFee: property.condominium?.fees?.maintenance,
      garageSpaces: property.details.numGarageSpaces,
      pool: property.details.pool || false,
      waterfront: property.details.waterfront || false,
    };

    setSelectedProperties([...selectedProperties, comparisonProperty]);
    return true;
  };

  const removeProperty = (mls: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.mls !== mls));
  };

  const clearAll = () => {
    setSelectedProperties([]);
  };

  const isPropertySelected = (mls: string) => {
    return selectedProperties.some(p => p.mls === mls);
  };

  const canAddMore = () => {
    return selectedProperties.length < MAX_PROPERTIES;
  };

  return {
    selectedProperties,
    addProperty,
    removeProperty,
    clearAll,
    isPropertySelected,
    canAddMore,
    maxProperties: MAX_PROPERTIES,
  };
};
