-- Create table for listing enhancements (floor plans, videos, documents)
CREATE TABLE public.listing_enhancements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_mls TEXT NOT NULL UNIQUE,
  office_id TEXT NOT NULL,
  floor_plans JSONB DEFAULT '[]'::jsonb, -- Array of {url, title, description}
  video_embeds JSONB DEFAULT '[]'::jsonb, -- Array of {url, platform, title}
  documents JSONB DEFAULT '[]'::jsonb, -- Array of {url, title, type}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listing_enhancements ENABLE ROW LEVEL SECURITY;

-- Anyone can view listing enhancements (for public property pages)
CREATE POLICY "Anyone can view listing enhancements"
ON public.listing_enhancements
FOR SELECT
USING (true);

-- Admins can manage listing enhancements
CREATE POLICY "Admins can insert listing enhancements"
ON public.listing_enhancements
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update listing enhancements"
ON public.listing_enhancements
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete listing enhancements"
ON public.listing_enhancements
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_listing_enhancements_updated_at
BEFORE UPDATE ON public.listing_enhancements
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups by MLS number
CREATE INDEX idx_listing_enhancements_mls ON public.listing_enhancements(property_mls);

-- Create storage bucket for listing enhancement files
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-enhancements', 'listing-enhancements', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for listing enhancements
CREATE POLICY "Anyone can view listing enhancement files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'listing-enhancements');

CREATE POLICY "Admins can upload listing enhancement files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'listing-enhancements' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update listing enhancement files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'listing-enhancements' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete listing enhancement files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'listing-enhancements' AND has_role(auth.uid(), 'admin'::app_role));