import { useMemo } from 'react';
import addresser, { type IParsedAddress } from 'addresser';

export type ParsedAddress = IParsedAddress;

/**
 * Hook to parse address strings into structured components
 */
export const useAddressParser = () => {
  return useMemo(() => ({
    /**
     * Parse an address string into structured components
     * @param addressString - The address string to parse
     * @returns ParsedAddress object or null if parsing fails
     */
    parseAddress: (addressString: string): ParsedAddress | null => {
      if (!addressString || typeof addressString !== 'string') {
        return null;
      }

      try {
        const parsed = addresser.parseAddress(addressString.trim());
        return parsed || null;
      } catch (error) {
        console.error('Address parsing error:', error);
        return null;
      }
    },

    /**
     * Extract city from an address string
     * @param addressString - The address string to parse
     * @returns City name or null
     */
    extractCity: (addressString: string): string | null => {
      const parsed = addresser.parseAddress(addressString.trim());
      return parsed?.placeName || null;
    },

    /**
     * Extract state from an address string
     * @param addressString - The address string to parse
     * @returns State abbreviation or null
     */
    extractState: (addressString: string): string | null => {
      const parsed = addresser.parseAddress(addressString.trim());
      return parsed?.stateAbbreviation || null;
    },

    /**
     * Extract zip code from an address string
     * @param addressString - The address string to parse
     * @returns Zip code or null
     */
    extractZipCode: (addressString: string): string | null => {
      const parsed = addresser.parseAddress(addressString.trim());
      return parsed?.zipCode || null;
    },

    /**
     * Normalize address string to standard format
     * @param addressString - The address string to normalize
     * @returns Formatted address string or original if parsing fails
     */
    normalizeAddress: (addressString: string): string => {
      const parsed = addresser.parseAddress(addressString.trim());
      return parsed?.addressLine1 || addressString;
    },
  }), []);
};
