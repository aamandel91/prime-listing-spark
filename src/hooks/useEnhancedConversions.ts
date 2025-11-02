import { useEffect } from 'react';

interface ConversionData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

// Hash function for enhanced conversions (SHA-256)
const sha256 = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const useEnhancedConversions = () => {
  const sendEnhancedConversion = async (
    eventName: string,
    conversionData: ConversionData,
    eventData?: Record<string, any>
  ) => {
    try {
      // Check if gtag is available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const gtag = (window as any).gtag;
        
        // Hash user data for privacy
        const hashedData: Record<string, string> = {};
        
        if (conversionData.email) {
          hashedData.email = await sha256(conversionData.email);
        }
        if (conversionData.phone) {
          // Remove non-digits and hash
          const cleanPhone = conversionData.phone.replace(/\D/g, '');
          hashedData.phone_number = await sha256(cleanPhone);
        }
        if (conversionData.firstName) {
          hashedData.first_name = await sha256(conversionData.firstName);
        }
        if (conversionData.lastName) {
          hashedData.last_name = await sha256(conversionData.lastName);
        }
        if (conversionData.address) {
          if (conversionData.address.street) {
            hashedData.street = await sha256(conversionData.address.street);
          }
          if (conversionData.address.city) {
            hashedData.city = await sha256(conversionData.address.city);
          }
          if (conversionData.address.state) {
            hashedData.region = await sha256(conversionData.address.state);
          }
          if (conversionData.address.zip) {
            hashedData.postal_code = await sha256(conversionData.address.zip);
          }
          if (conversionData.address.country) {
            hashedData.country = await sha256(conversionData.address.country);
          }
        }

        // Send enhanced conversion to Google Ads
        gtag('event', eventName, {
          ...eventData,
          user_data: hashedData,
        });

        console.log('Enhanced conversion sent:', eventName, hashedData);
      }

      // Also send to Facebook if fbq is available
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq;
        
        // Facebook expects unhashed data
        const fbUserData: Record<string, string> = {};
        if (conversionData.email) fbUserData.em = conversionData.email;
        if (conversionData.phone) fbUserData.ph = conversionData.phone;
        if (conversionData.firstName) fbUserData.fn = conversionData.firstName;
        if (conversionData.lastName) fbUserData.ln = conversionData.lastName;
        if (conversionData.address?.city) fbUserData.ct = conversionData.address.city;
        if (conversionData.address?.state) fbUserData.st = conversionData.address.state;
        if (conversionData.address?.zip) fbUserData.zp = conversionData.address.zip;

        fbq('track', eventName, eventData, { eventID: Date.now().toString() });
      }
    } catch (error) {
      console.error('Error sending enhanced conversion:', error);
    }
  };

  return { sendEnhancedConversion };
};
