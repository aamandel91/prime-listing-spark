import { useEffect, useState } from 'react';

export const useTrafficSource = () => {
  const [isPPC, setIsPPC] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTrafficSource = () => {
      // Check if there's a stored traffic source in sessionStorage
      const storedSource = sessionStorage.getItem('traffic_source');
      
      if (storedSource === 'ppc') {
        setIsPPC(true);
        setLoading(false);
        return;
      }

      if (storedSource === 'organic') {
        setIsPPC(false);
        setLoading(false);
        return;
      }

      // Check URL parameters for UTM source
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');

      // Common PPC sources and mediums
      const ppcSources = ['google', 'facebook', 'bing', 'linkedin', 'twitter', 'instagram', 'tiktok'];
      const ppcMediums = ['cpc', 'ppc', 'paid', 'paidsearch', 'paidsocial'];

      const isFromPPC = 
        (utmSource && ppcSources.includes(utmSource.toLowerCase())) ||
        (utmMedium && ppcMediums.includes(utmMedium.toLowerCase())) ||
        urlParams.has('gclid') || // Google Ads click ID
        urlParams.has('fbclid') || // Facebook click ID
        urlParams.has('msclkid'); // Microsoft Ads click ID

      if (isFromPPC) {
        setIsPPC(true);
        sessionStorage.setItem('traffic_source', 'ppc');
      } else {
        setIsPPC(false);
        sessionStorage.setItem('traffic_source', 'organic');
      }

      setLoading(false);
    };

    checkTrafficSource();
  }, []);

  return { isPPC, loading };
};
