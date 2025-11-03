-- Add is_template field to content_pages for reusable templates
ALTER TABLE content_pages 
ADD COLUMN IF NOT EXISTS is_template boolean DEFAULT false;

COMMENT ON COLUMN content_pages.is_template IS 'Whether this page is a template for duplication';

-- Add index for better query performance on templates
CREATE INDEX IF NOT EXISTS idx_content_pages_is_template ON content_pages(is_template) WHERE is_template = true;