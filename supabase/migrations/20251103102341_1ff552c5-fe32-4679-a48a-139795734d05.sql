-- Modify page_search_criteria to support multiple entity types
ALTER TABLE public.page_search_criteria 
  DROP CONSTRAINT page_search_criteria_page_id_fkey,
  DROP CONSTRAINT page_search_criteria_page_id_key;

-- Add entity type and make page_id nullable
ALTER TABLE public.page_search_criteria
  ADD COLUMN entity_type TEXT NOT NULL DEFAULT 'content_page',
  ADD COLUMN entity_id UUID,
  ALTER COLUMN page_id DROP NOT NULL;

-- Add constraint to ensure either page_id or entity_id is set
ALTER TABLE public.page_search_criteria
  ADD CONSTRAINT check_entity_reference CHECK (
    (page_id IS NOT NULL AND entity_id IS NULL) OR
    (page_id IS NULL AND entity_id IS NOT NULL)
  );

-- Add unique constraint for entity combinations
CREATE UNIQUE INDEX idx_page_search_criteria_entity 
  ON public.page_search_criteria(entity_type, entity_id)
  WHERE entity_id IS NOT NULL;

CREATE UNIQUE INDEX idx_page_search_criteria_page 
  ON public.page_search_criteria(page_id)
  WHERE page_id IS NOT NULL;

-- Update RLS policies to work with new structure
DROP POLICY IF EXISTS "Anyone can view criteria for published pages" ON public.page_search_criteria;

CREATE POLICY "Anyone can view published search criteria"
  ON public.page_search_criteria
  FOR SELECT
  USING (
    (page_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.content_pages
      WHERE content_pages.id = page_search_criteria.page_id
      AND content_pages.published = true
    ))
    OR
    (entity_type = 'featured_city' AND EXISTS (
      SELECT 1 FROM public.featured_cities
      WHERE featured_cities.id = page_search_criteria.entity_id
      AND featured_cities.featured = true
    ))
    OR
    (entity_type = 'featured_county' AND EXISTS (
      SELECT 1 FROM public.featured_counties
      WHERE featured_counties.id = page_search_criteria.entity_id
      AND featured_counties.featured = true
    ))
    OR
    (entity_type = 'featured_neighborhood' AND EXISTS (
      SELECT 1 FROM public.featured_neighborhoods
      WHERE featured_neighborhoods.id = page_search_criteria.entity_id
      AND featured_neighborhoods.featured = true
    ))
  );