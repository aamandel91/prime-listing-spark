import { useEffect } from 'react';

interface PropertyData {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  imageUrl?: string;
}

export const usePropertyRemarketing = () => {
  const trackPropertyView = (property: PropertyData) => {
    try {
      // Google Ads remarketing
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const gtag = (window as any).gtag;
        
        gtag('event', 'view_item', {
          currency: 'USD',
          value: property.price,
          items: [{
            item_id: property.id,
            item_name: property.address,
            item_category: property.propertyType,
            item_category2: property.city,
            item_category3: property.state,
            price: property.price,
            quantity: 1,
            item_brand: 'Real Estate',
          }],
          ecomm_pagetype: 'product',
          ecomm_prodid: property.id,
          ecomm_totalvalue: property.price,
        });

        // Dynamic remarketing parameters
        gtag('event', 'page_view', {
          send_to: 'AW-CONVERSION_ID', // This will be replaced with actual conversion ID
          ecomm_prodid: property.id,
          ecomm_pagetype: 'product',
          ecomm_totalvalue: property.price,
        });

        console.log('Property view tracked for remarketing:', property.id);
      }

      // Facebook dynamic product ads
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq;
        
        fbq('track', 'ViewContent', {
          content_ids: [property.id],
          content_type: 'product',
          content_name: property.address,
          content_category: property.propertyType,
          value: property.price,
          currency: 'USD',
        });

        console.log('Facebook ViewContent tracked:', property.id);
      }
    } catch (error) {
      console.error('Error tracking property view:', error);
    }
  };

  const trackSearch = (searchParams: {
    city?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    propertyType?: string;
  }) => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const gtag = (window as any).gtag;
        
        gtag('event', 'search', {
          search_term: `${searchParams.city || ''} ${searchParams.state || ''}`.trim(),
          ecomm_pagetype: 'searchresults',
        });
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq;
        
        fbq('track', 'Search', {
          content_category: searchParams.propertyType,
          search_string: `${searchParams.city || ''} ${searchParams.state || ''}`.trim(),
        });
      }
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  };

  const trackLead = (leadData: {
    propertyId: string;
    email: string;
    phone?: string;
    value?: number;
  }) => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const gtag = (window as any).gtag;
        
        gtag('event', 'generate_lead', {
          currency: 'USD',
          value: leadData.value || 0,
          items: [{
            item_id: leadData.propertyId,
          }],
        });
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq;
        
        fbq('track', 'Lead', {
          content_ids: [leadData.propertyId],
          content_category: 'real_estate_lead',
          value: leadData.value || 0,
          currency: 'USD',
        });
      }
    } catch (error) {
      console.error('Error tracking lead:', error);
    }
  };

  return {
    trackPropertyView,
    trackSearch,
    trackLead,
  };
};
