-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create navigation_items table for CMS-managed navigation
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('link', 'dropdown', 'button', 'divider')),
  position TEXT NOT NULL CHECK (position IN ('left', 'right', 'mobile')),
  url TEXT,
  icon TEXT,
  target TEXT CHECK (target IN ('_self', '_blank')),
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  dropdown_items JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  css_classes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- Allow public to read visible navigation items
CREATE POLICY "Navigation items are viewable by everyone"
ON public.navigation_items
FOR SELECT
USING (is_visible = true);

-- Only authenticated users can manage navigation
CREATE POLICY "Authenticated users can manage navigation items"
ON public.navigation_items
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create index for ordering
CREATE INDEX idx_navigation_items_order ON public.navigation_items(position, order_index);

-- Add trigger for updated_at
CREATE TRIGGER update_navigation_items_updated_at
BEFORE UPDATE ON public.navigation_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default navigation items matching floridahomefinder.com
INSERT INTO public.navigation_items (label, type, position, url, order_index) VALUES
  ('Search', 'dropdown', 'left', '/advanced-search', 0),
  ('Cities', 'link', 'left', '/cities', 1),
  ('Counties', 'dropdown', 'left', '/counties', 2),
  ('Property Type', 'dropdown', 'left', '/property-types', 3),
  ('Sell', 'link', 'left', '/sell', 4),
  ('Blog', 'link', 'right', '/blog', 0),
  ('Login / Register', 'button', 'right', '/auth', 1);