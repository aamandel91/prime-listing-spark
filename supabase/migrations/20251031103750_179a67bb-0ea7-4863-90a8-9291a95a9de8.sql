-- Create featured_counties table
CREATE TABLE public.featured_counties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  county_name TEXT NOT NULL,
  state TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  hero_image_url TEXT,
  custom_content JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_counties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view featured counties"
ON public.featured_counties
FOR SELECT
USING (featured = true);

CREATE POLICY "Admins can view all counties"
ON public.featured_counties
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert counties"
ON public.featured_counties
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update counties"
ON public.featured_counties
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete counties"
ON public.featured_counties
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_featured_counties_updated_at
  BEFORE UPDATE ON public.featured_counties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();