import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTrackingCodes = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTrackingCodes = async () => {
      try {
        const { data, error } = await supabase
          .from('global_site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', [
            'google_analytics_id',
            'google_tag_manager_id',
            'facebook_pixel_id',
            'followup_boss_pixel',
            'header_custom_code'
          ]);

        if (error) throw error;

        const settings: Record<string, string> = {};
        data?.forEach((setting) => {
          settings[setting.setting_key] = setting.setting_value || '';
        });

        // Inject Google Analytics
        if (settings.google_analytics_id) {
          const gaScript1 = document.createElement('script');
          gaScript1.async = true;
          gaScript1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
          document.head.appendChild(gaScript1);

          const gaScript2 = document.createElement('script');
          gaScript2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.google_analytics_id}');
          `;
          document.head.appendChild(gaScript2);
        }

        // Inject Google Tag Manager
        if (settings.google_tag_manager_id) {
          const gtmScript = document.createElement('script');
          gtmScript.innerHTML = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
          `;
          document.head.appendChild(gtmScript);

          const gtmNoScript = document.createElement('noscript');
          gtmNoScript.innerHTML = `
            <iframe src="https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_id}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `;
          document.body.insertBefore(gtmNoScript, document.body.firstChild);
        }

        // Inject Facebook Pixel
        if (settings.facebook_pixel_id) {
          const fbScript = document.createElement('script');
          fbScript.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${settings.facebook_pixel_id}');
            fbq('track', 'PageView');
          `;
          document.head.appendChild(fbScript);

          const fbNoScript = document.createElement('noscript');
          fbNoScript.innerHTML = `
            <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${settings.facebook_pixel_id}&ev=PageView&noscript=1"/>
          `;
          document.head.appendChild(fbNoScript);
        }

        // Inject Follow Up Boss Pixel
        if (settings.followup_boss_pixel) {
          const fubDiv = document.createElement('div');
          fubDiv.innerHTML = settings.followup_boss_pixel;
          document.head.appendChild(fubDiv);
        }

        // Inject Custom Header Code
        if (settings.header_custom_code) {
          const customDiv = document.createElement('div');
          customDiv.innerHTML = settings.header_custom_code;
          document.head.appendChild(customDiv);
        }

        setLoaded(true);
      } catch (error) {
        console.error('Error loading tracking codes:', error);
      }
    };

    if (!loaded) {
      loadTrackingCodes();
    }
  }, [loaded]);

  return { loaded };
};
