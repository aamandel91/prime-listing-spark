-- Create SEO settings table
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view SEO settings"
ON public.seo_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage SEO settings"
ON public.seo_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default SEO settings
INSERT INTO public.seo_settings (setting_key, setting_value)
VALUES 
  ('property_pages_noindex', '{"enabled": false, "description": "Control whether property detail pages should be noindex/nofollow"}'::jsonb),
  ('sitemap_last_generated', '{"timestamp": null, "description": "Last time sitemaps were generated"}'::jsonb);