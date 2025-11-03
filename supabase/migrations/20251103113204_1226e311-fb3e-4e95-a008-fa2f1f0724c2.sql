-- Create sidebar templates table for reusable sidebar sections
CREATE TABLE public.sidebar_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sidebar_templates ENABLE ROW LEVEL SECURITY;

-- Admins can manage sidebar templates
CREATE POLICY "Admins can manage sidebar templates"
ON public.sidebar_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view sidebar templates
CREATE POLICY "Anyone can view sidebar templates"
ON public.sidebar_templates
FOR SELECT
USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_sidebar_templates_updated_at
BEFORE UPDATE ON public.sidebar_templates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add sidebar_config field to content_pages for page-specific sidebar configuration
ALTER TABLE public.content_pages
ADD COLUMN sidebar_config JSONB DEFAULT NULL;

-- Create index for better query performance
CREATE INDEX idx_sidebar_templates_is_default ON public.sidebar_templates(is_default) WHERE is_default = true;
CREATE INDEX idx_content_pages_sidebar_config ON public.content_pages USING GIN(sidebar_config);

COMMENT ON TABLE public.sidebar_templates IS 'Reusable sidebar templates that can be applied to multiple pages';
COMMENT ON COLUMN public.sidebar_templates.sections IS 'Array of sidebar section configurations with type, content, and settings';
COMMENT ON COLUMN public.sidebar_templates.is_default IS 'Whether this template is used as default for new city pages';
COMMENT ON COLUMN public.content_pages.sidebar_config IS 'Page-specific sidebar configuration. If null, uses template from specific_sidebar field or default template';