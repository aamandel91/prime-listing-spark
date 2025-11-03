-- Add modules field to content_pages for modular content
ALTER TABLE content_pages 
ADD COLUMN IF NOT EXISTS modules jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN content_pages.modules IS 'Array of content modules with type and configuration';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_content_pages_modules ON content_pages USING gin(modules);