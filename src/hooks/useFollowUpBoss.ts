import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PersonData {
  firstName?: string;
  lastName?: string;
  emails?: Array<{ value: string }>;
  phones?: Array<{ value: string }>;
  addresses?: Array<{ street?: string; city?: string; state?: string; code?: string }>;
}

interface PropertyData {
  street?: string;
  city?: string;
  state?: string;
  code?: string;
  mlsNumber?: string;
  price?: number;
  forRent?: boolean;
  url?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  lot?: number;
}

interface PropertySearchData {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const useFollowUpBoss = () => {
  const { toast } = useToast();

  const sendEvent = async (
    type: string,
    options: {
      person?: PersonData;
      property?: PropertyData;
      propertySearch?: PropertySearchData;
      message?: string;
      description?: string;
      pageUrl?: string;
      pageTitle?: string;
    } = {}
  ) => {
    try {
      console.log('Sending FUB event:', type, options);

      const { data, error } = await supabase.functions.invoke('followup-boss-event', {
        body: {
          type,
          person: options.person,
          property: options.property,
          propertySearch: options.propertySearch,
          message: options.message,
          description: options.description,
          pageUrl: options.pageUrl || window.location.href,
          pageTitle: options.pageTitle || document.title,
          pageReferrer: document.referrer,
        },
      });

      if (error) {
        console.error('Failed to send FUB event:', error);
        return { success: false, error };
      }

      console.log('FUB event sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending FUB event:', error);
      return { success: false, error };
    }
  };

  const trackPropertyView = async (property: {
    id: string;
    address: string;
    city: string;
    state: string;
    zip?: string;
    mlsNumber?: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    propertyType?: string;
  }, person?: PersonData) => {
    return sendEvent('Viewed Property', {
      person,
      property: {
        street: property.address,
        city: property.city,
        state: property.state,
        code: property.zip,
        mlsNumber: property.mlsNumber,
        price: property.price,
        forRent: false,
        url: window.location.href,
        type: property.propertyType || 'Single Family',
        bedrooms: property.beds,
        bathrooms: property.baths,
        area: property.sqft,
      },
      message: `Viewed property: ${property.address}, ${property.city}, ${property.state}`,
      pageTitle: `${property.address} - Property Details`,
    });
  };

  const trackPropertySave = async (property: {
    id: string;
    address: string;
    city: string;
    state: string;
    zip?: string;
    mlsNumber?: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    propertyType?: string;
  }, person?: PersonData) => {
    return sendEvent('Saved Property', {
      person,
      property: {
        street: property.address,
        city: property.city,
        state: property.state,
        code: property.zip,
        mlsNumber: property.mlsNumber,
        price: property.price,
        forRent: false,
        url: window.location.href,
        type: property.propertyType || 'Single Family',
        bedrooms: property.beds,
        bathrooms: property.baths,
        area: property.sqft,
      },
      message: `Saved property: ${property.address}, ${property.city}, ${property.state}`,
    });
  };

  const trackPropertySearch = async (searchParams: {
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    propertyType?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    subdivision?: string;
    county?: string;
  }, person?: PersonData) => {
    const searchDescription = Object.entries(searchParams)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return sendEvent('Property Search', {
      person,
      propertySearch: {
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        bedrooms: searchParams.beds,
        bathrooms: searchParams.baths,
        propertyType: searchParams.propertyType,
        city: searchParams.city,
        state: searchParams.state,
        zipCode: searchParams.zipCode,
      },
      message: `Property search: ${searchDescription}`,
      description: searchDescription,
    });
  };

  const trackPropertyInquiry = async (
    property: {
      id: string;
      address: string;
      city: string;
      state: string;
      zip?: string;
      mlsNumber?: string;
      price: number;
      beds: number;
      baths: number;
      sqft: number;
      propertyType?: string;
    },
    person: PersonData,
    message?: string
  ) => {
    return sendEvent('Property Inquiry', {
      person,
      property: {
        street: property.address,
        city: property.city,
        state: property.state,
        code: property.zip,
        mlsNumber: property.mlsNumber,
        price: property.price,
        forRent: false,
        url: window.location.href,
        type: property.propertyType || 'Single Family',
        bedrooms: property.beds,
        bathrooms: property.baths,
        area: property.sqft,
      },
      message: message || `Inquiry about property: ${property.address}, ${property.city}, ${property.state}`,
    });
  };

  const trackRegistration = async (person: PersonData) => {
    return sendEvent('Registration', {
      person,
      message: 'New user registration',
    });
  };

  const trackGeneralInquiry = async (person: PersonData, message: string) => {
    return sendEvent('General Inquiry', {
      person,
      message,
    });
  };

  return {
    sendEvent,
    trackPropertyView,
    trackPropertySave,
    trackPropertySearch,
    trackPropertyInquiry,
    trackRegistration,
    trackGeneralInquiry,
  };
};
