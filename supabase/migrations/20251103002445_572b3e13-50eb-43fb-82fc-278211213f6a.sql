-- Create table for featured ZIP codes
CREATE TABLE public.featured_zipcodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zipcode TEXT NOT NULL UNIQUE,
  city TEXT,
  state TEXT NOT NULL DEFAULT 'FL',
  county TEXT,
  property_count INTEGER DEFAULT 0,
  avg_price NUMERIC,
  featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  description TEXT,
  custom_content JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_featured_zipcodes_zipcode ON public.featured_zipcodes(zipcode);
CREATE INDEX idx_featured_zipcodes_state ON public.featured_zipcodes(state);
CREATE INDEX idx_featured_zipcodes_featured ON public.featured_zipcodes(featured);

-- Enable RLS
ALTER TABLE public.featured_zipcodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view featured zipcodes"
  ON public.featured_zipcodes
  FOR SELECT
  USING (featured = true);

CREATE POLICY "Admins can view all zipcodes"
  ON public.featured_zipcodes
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert zipcodes"
  ON public.featured_zipcodes
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update zipcodes"
  ON public.featured_zipcodes
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete zipcodes"
  ON public.featured_zipcodes
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create table for featured neighborhoods/subdivisions
CREATE TABLE public.featured_neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT,
  state TEXT NOT NULL DEFAULT 'FL',
  county TEXT,
  zipcode TEXT,
  property_count INTEGER DEFAULT 0,
  avg_price NUMERIC,
  featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  description TEXT,
  hero_image_url TEXT,
  custom_content JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_featured_neighborhoods_slug ON public.featured_neighborhoods(slug);
CREATE INDEX idx_featured_neighborhoods_city ON public.featured_neighborhoods(city);
CREATE INDEX idx_featured_neighborhoods_state ON public.featured_neighborhoods(state);
CREATE INDEX idx_featured_neighborhoods_featured ON public.featured_neighborhoods(featured);

-- Enable RLS
ALTER TABLE public.featured_neighborhoods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view featured neighborhoods"
  ON public.featured_neighborhoods
  FOR SELECT
  USING (featured = true);

CREATE POLICY "Admins can view all neighborhoods"
  ON public.featured_neighborhoods
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert neighborhoods"
  ON public.featured_neighborhoods
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update neighborhoods"
  ON public.featured_neighborhoods
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete neighborhoods"
  ON public.featured_neighborhoods
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_featured_zipcodes_updated_at
  BEFORE UPDATE ON public.featured_zipcodes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_featured_neighborhoods_updated_at
  BEFORE UPDATE ON public.featured_neighborhoods
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();