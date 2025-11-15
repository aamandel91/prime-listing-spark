/**
 * Utility functions for generating SEO-friendly property URLs
 */

interface PropertyUrlData {
  address: string;
  city: string;
  state: string;
  zip: string;
  mlsNumber?: string;
}

/**
 * Generates a SEO-friendly URL slug from property data
 * Format: /212-W-Alexander-Palm-Rd-Boca-Raton-FL-33432-MLS123456/
 * Now includes MLS number at the end for proper lookup
 */
export const generatePropertyUrl = (property: PropertyUrlData): string => {
  const parts = [
    property.address,
    property.city,
    property.state,
    property.zip,
  ];

  // Add MLS number if available
  if (property.mlsNumber) {
    parts.push(property.mlsNumber);
  }

  const slug = parts
    .filter(Boolean)
    .join(' ')
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();

  return `/home/${slug}/`;
};

/**
 * Parses a property URL slug to extract address components
 * Returns the last segment (zip code) which we can use to search for the property
 */
export const parsePropertyUrl = (urlSlug: string): { zip: string; fullSlug: string } => {
  const cleaned = urlSlug.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
  const parts = cleaned.split('-');
  
  // Last part should be the zip code (5 digits)
  const zip = parts[parts.length - 1];
  
  return {
    zip,
    fullSlug: cleaned,
  };
};

/**
 * Extracts MLS number from URL if it's in the old format
 */
export const extractMlsFromOldUrl = (path: string): string | null => {
  const match = path.match(/\/property\/([^\/]+)/);
  return match ? match[1] : null;
};
