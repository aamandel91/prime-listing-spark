-- Add comprehensive page settings fields to content_pages
ALTER TABLE content_pages 
ADD COLUMN IF NOT EXISTS include_in_nav boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS hide_header boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hide_breadcrumbs boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hide_footer boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS display_sidebar boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS full_width boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS specific_sidebar text,
ADD COLUMN IF NOT EXISTS open_in text DEFAULT 'same_window',
ADD COLUMN IF NOT EXISTS page_priority numeric DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS robots_indexing text DEFAULT 'index, follow',
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_keywords text,
ADD COLUMN IF NOT EXISTS default_image text,
ADD COLUMN IF NOT EXISTS page_overview text;

COMMENT ON COLUMN content_pages.include_in_nav IS 'Include page in dynamic navigation menus';
COMMENT ON COLUMN content_pages.hide_header IS 'Hide header navigation on this page';
COMMENT ON COLUMN content_pages.hide_breadcrumbs IS 'Hide breadcrumbs on this page';
COMMENT ON COLUMN content_pages.hide_footer IS 'Hide footer navigation on this page';
COMMENT ON COLUMN content_pages.display_sidebar IS 'Display sidebar on this page';
COMMENT ON COLUMN content_pages.full_width IS 'Full/fluid width page layout';
COMMENT ON COLUMN content_pages.specific_sidebar IS 'Page-specific sidebar content reference';
COMMENT ON COLUMN content_pages.open_in IS 'Open page in same_window or new_window';
COMMENT ON COLUMN content_pages.page_priority IS 'SEO page priority (0.0 to 1.0)';
COMMENT ON COLUMN content_pages.robots_indexing IS 'Robots meta tag directive';
COMMENT ON COLUMN content_pages.meta_title IS 'SEO meta title tag';
COMMENT ON COLUMN content_pages.meta_keywords IS 'SEO meta keywords';
COMMENT ON COLUMN content_pages.default_image IS 'Default page photo URL';
COMMENT ON COLUMN content_pages.page_overview IS 'Brief 1-3 sentence summary of page';