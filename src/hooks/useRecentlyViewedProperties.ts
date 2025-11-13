import { useState, useEffect } from 'react';

export interface RecentlyViewedProperty {
  id: string;
  mlsNumber: string;
  title: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  viewedAt: number;
}

const STORAGE_KEY = 'recentlyViewedProperties';
const MAX_ITEMS = 10;

export const useRecentlyViewedProperties = () => {
  const [recentProperties, setRecentProperties] = useState<RecentlyViewedProperty[]>([]);

  useEffect(() => {
    loadRecentProperties();
  }, []);

  const loadRecentProperties = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const properties = JSON.parse(stored) as RecentlyViewedProperty[];
        setRecentProperties(properties);
      }
    } catch (error) {
      console.error('Error loading recently viewed properties:', error);
    }
  };

  const addRecentlyViewed = (property: Omit<RecentlyViewedProperty, 'viewedAt'>) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let properties: RecentlyViewedProperty[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists
      properties = properties.filter(p => p.mlsNumber !== property.mlsNumber);

      // Add to beginning with timestamp
      properties.unshift({
        ...property,
        viewedAt: Date.now(),
      });

      // Keep only MAX_ITEMS
      properties = properties.slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
      setRecentProperties(properties);
    } catch (error) {
      console.error('Error saving recently viewed property:', error);
    }
  };

  const clearRecentlyViewed = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentProperties([]);
    } catch (error) {
      console.error('Error clearing recently viewed properties:', error);
    }
  };

  return {
    recentProperties,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
};
