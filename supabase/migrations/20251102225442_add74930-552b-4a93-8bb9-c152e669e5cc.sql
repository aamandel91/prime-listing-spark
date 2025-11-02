-- Add new Google Ads remarketing and conversion tracking settings
INSERT INTO public.global_site_settings (setting_key, setting_value, setting_type, description)
VALUES 
  ('google_ads_conversion_id', NULL, 'text', 'Google Ads Conversion ID for enhanced conversions (e.g., AW-123456789)'),
  ('google_ads_remarketing_id', NULL, 'text', 'Google Ads Remarketing Tag ID for dynamic remarketing')
ON CONFLICT (setting_key) DO NOTHING;