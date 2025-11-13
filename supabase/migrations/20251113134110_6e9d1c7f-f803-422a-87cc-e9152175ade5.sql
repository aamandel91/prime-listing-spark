-- Create property_subtypes table for managing property categories
CREATE TABLE public.property_subtypes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  api_filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create school_districts table for Florida school district data
CREATE TABLE public.school_districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  county TEXT,
  city TEXT,
  state TEXT NOT NULL DEFAULT 'FL',
  description TEXT,
  rating NUMERIC,
  total_schools INTEGER DEFAULT 0,
  boundaries JSONB,
  meta_title TEXT,
  meta_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add api_filters column to content_pages for storing Repliers API parameters
ALTER TABLE public.content_pages 
ADD COLUMN IF NOT EXISTS api_filters JSONB DEFAULT '{}'::jsonb;

-- Add category column to content_pages for better organization
ALTER TABLE public.content_pages 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Enable RLS on property_subtypes
ALTER TABLE public.property_subtypes ENABLE ROW LEVEL SECURITY;

-- RLS policies for property_subtypes
CREATE POLICY "Anyone can view featured property subtypes"
ON public.property_subtypes
FOR SELECT
USING (featured = true);

CREATE POLICY "Admins can manage property subtypes"
ON public.property_subtypes
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on school_districts
ALTER TABLE public.school_districts ENABLE ROW LEVEL SECURITY;

-- RLS policies for school_districts
CREATE POLICY "Anyone can view featured school districts"
ON public.school_districts
FOR SELECT
USING (featured = true);

CREATE POLICY "Admins can manage school districts"
ON public.school_districts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for property_subtypes updated_at
CREATE TRIGGER update_property_subtypes_updated_at
BEFORE UPDATE ON public.property_subtypes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for school_districts updated_at
CREATE TRIGGER update_school_districts_updated_at
BEFORE UPDATE ON public.school_districts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert some default property subtypes
INSERT INTO public.property_subtypes (name, slug, description, api_filters, featured, sort_order, icon) VALUES
('55+ Communities', '55-plus-communities', 'Active adult communities for residents 55 and older', '{"features": ["55+"]}', true, 1, 'Home'),
('Waterfront Homes', 'waterfront-homes', 'Properties with water views or direct water access', '{"features": ["waterfront"]}', true, 2, 'Waves'),
('Golf Communities', 'golf-communities', 'Homes located in golf course communities', '{"features": ["golf"]}', true, 3, 'Flag'),
('Luxury Homes', 'luxury-homes', 'High-end luxury properties', '{"minPrice": 1000000}', true, 4, 'Crown'),
('New Construction', 'new-construction', 'Brand new homes and recently built properties', '{"features": ["new construction"]}', true, 5, 'Building2'),
('Condos', 'condos', 'Condominium properties', '{"propertyType": ["Condominium"]}', true, 6, 'Building'),
('Single Story Homes', 'single-story-homes', 'One-story ranch-style homes', '{"maxStories": 1}', true, 7, 'Home'),
('Pool Homes', 'pool-homes', 'Homes with swimming pools', '{"pool": true}', true, 8, 'Waves'),
('Gated Communities', 'gated-communities', 'Properties in secure gated communities', '{"features": ["gated"]}', true, 9, 'Lock'),
('Foreclosures', 'foreclosures', 'Bank-owned and foreclosure properties', '{"features": ["foreclosure"]}', true, 10, 'DollarSign');