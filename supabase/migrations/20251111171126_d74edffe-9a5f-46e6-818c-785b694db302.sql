-- Create table for property detail page layout configuration
CREATE TABLE IF NOT EXISTS public.property_detail_layout (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id TEXT NOT NULL UNIQUE,
  section_name TEXT NOT NULL,
  section_component TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_collapsible BOOLEAN NOT NULL DEFAULT false,
  default_open BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_detail_layout ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view property detail layout"
  ON public.property_detail_layout
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage property detail layout"
  ON public.property_detail_layout
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_property_detail_layout_updated_at
  BEFORE UPDATE ON public.property_detail_layout
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default sections
INSERT INTO public.property_detail_layout (section_id, section_name, section_component, display_order, is_enabled, is_collapsible, default_open) VALUES
  ('gallery', 'Photo Gallery', 'gallery', 1, true, false, true),
  ('key-details', 'Key Details', 'keyDetails', 2, true, false, true),
  ('description', 'Property Description', 'description', 3, true, true, true),
  ('interior-features', 'Interior Features', 'interiorFeatures', 4, true, true, false),
  ('exterior-features', 'Exterior Features', 'exteriorFeatures', 5, true, true, false),
  ('hoa-info', 'HOA Information', 'hoaInfo', 6, true, true, false),
  ('additional-info', 'Additional Information', 'additionalInfo', 7, true, true, false),
  ('location-map', 'Location & Map', 'locationMap', 8, true, false, true),
  ('mortgage-calculator', 'Mortgage Calculator', 'mortgageCalculator', 9, true, true, false),
  ('property-links', 'Property Links Description', 'propertyLinks', 10, true, false, true),
  ('schools', 'Schools Near', 'schools', 11, true, true, false),
  ('similar-properties', 'Similar Properties', 'similarProperties', 12, true, false, true),
  ('nearby-places', 'Nearby Places', 'nearbyPlaces', 13, true, false, true),
  ('community-listings', 'Community Listings', 'communityListings', 14, true, false, true),
  ('related-pages', 'Related Pages', 'relatedPages', 15, true, false, true),
  ('property-history', 'Property History', 'propertyHistory', 16, true, false, true),
  ('market-statistics', 'Market Statistics', 'marketStatistics', 17, true, false, true),
  ('neighborhood-follow', 'Neighborhood Follow', 'neighborhoodFollow', 18, true, false, true),
  ('property-estimate', 'Property Estimate', 'propertyEstimate', 19, true, false, true);

-- Create index for faster ordering queries
CREATE INDEX idx_property_detail_layout_order ON public.property_detail_layout(display_order);