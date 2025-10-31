-- Create global_site_settings table
CREATE TABLE public.global_site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.global_site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view global settings"
ON public.global_site_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage global settings"
ON public.global_site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_global_site_settings_updated_at
  BEFORE UPDATE ON public.global_site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default settings
INSERT INTO public.global_site_settings (setting_key, setting_value, setting_type, description)
VALUES 
  ('header_custom_code', '', 'textarea', 'Custom code to inject in <head> (Google Analytics, Tag Manager, etc.)'),
  ('followup_boss_pixel', '', 'textarea', 'Follow Up Boss tracking pixel code'),
  ('google_analytics_id', '', 'text', 'Google Analytics Measurement ID (G-XXXXXXXXXX)'),
  ('google_tag_manager_id', '', 'text', 'Google Tag Manager Container ID (GTM-XXXXXXX)'),
  ('facebook_pixel_id', '', 'text', 'Facebook/Meta Pixel ID'),
  ('force_registration_ppc', 'true', 'boolean', 'Force registration for PPC traffic on property pages'),
  ('ppc_utm_sources', 'google,facebook,bing,linkedin,twitter', 'text', 'Comma-separated list of UTM sources considered PPC traffic');