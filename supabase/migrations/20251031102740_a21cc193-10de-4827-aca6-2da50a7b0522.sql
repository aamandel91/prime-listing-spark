-- Create featured_cities table for admin-controlled city directory
CREATE TABLE public.featured_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name TEXT NOT NULL,
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

-- Enable Row Level Security
ALTER TABLE public.featured_cities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view featured cities"
ON public.featured_cities
FOR SELECT
USING (featured = true);

CREATE POLICY "Admins can view all cities"
ON public.featured_cities
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert cities"
ON public.featured_cities
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update cities"
ON public.featured_cities
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete cities"
ON public.featured_cities
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_featured_cities_updated_at
BEFORE UPDATE ON public.featured_cities
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for performance
CREATE INDEX idx_featured_cities_featured ON public.featured_cities(featured);
CREATE INDEX idx_featured_cities_slug ON public.featured_cities(slug);