-- Create table for page search criteria
CREATE TABLE IF NOT EXISTS public.page_search_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  page_id UUID NOT NULL REFERENCES public.content_pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  
  -- Location filters
  city TEXT,
  state TEXT,
  county TEXT,
  zip TEXT,
  neighborhood TEXT,
  area TEXT,
  
  -- Geographic search (radius)
  latitude NUMERIC,
  longitude NUMERIC,
  radius NUMERIC,
  
  -- Polygon search (GeoJSON)
  polygon JSONB,
  
  -- Price filters
  min_price NUMERIC,
  max_price NUMERIC,
  
  -- Property characteristics
  bedrooms INTEGER,
  min_bedrooms INTEGER,
  bathrooms NUMERIC,
  min_bathrooms NUMERIC,
  property_type TEXT[],
  property_class TEXT,
  
  -- Status filters
  status TEXT DEFAULT 'A',
  
  -- Size filters
  min_sqft NUMERIC,
  max_sqft NUMERIC,
  min_lot_size_sqft NUMERIC,
  max_lot_size_sqft NUMERIC,
  min_acres NUMERIC,
  max_acres NUMERIC,
  
  -- Features
  min_garage_spaces INTEGER,
  min_parking_spaces INTEGER,
  pool BOOLEAN,
  waterfront BOOLEAN,
  
  -- Year built
  min_year_built INTEGER,
  max_year_built INTEGER,
  
  -- Sorting
  sort_by TEXT DEFAULT 'date',
  
  -- MLS specific
  office_id TEXT,
  agent_id TEXT,
  
  UNIQUE(page_id)
);

-- Enable RLS
ALTER TABLE public.page_search_criteria ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage criteria
CREATE POLICY "Admins can manage search criteria"
  ON public.page_search_criteria
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view search criteria for published pages
CREATE POLICY "Anyone can view criteria for published pages"
  ON public.page_search_criteria
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.content_pages
      WHERE content_pages.id = page_search_criteria.page_id
      AND content_pages.published = true
    )
  );

-- Create index for faster queries
CREATE INDEX idx_page_search_criteria_page_id ON public.page_search_criteria(page_id);