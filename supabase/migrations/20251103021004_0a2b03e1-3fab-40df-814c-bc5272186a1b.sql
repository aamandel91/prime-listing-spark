-- Create table to track blog migration jobs
CREATE TABLE IF NOT EXISTS public.blog_migration_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  blog_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  imported_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  imported_blogs JSONB,
  error_details JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.blog_migration_jobs ENABLE ROW LEVEL SECURITY;

-- Users can view their own migration jobs
CREATE POLICY "Users can view their own migration jobs"
ON public.blog_migration_jobs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own migration jobs
CREATE POLICY "Users can create their own migration jobs"
ON public.blog_migration_jobs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_blog_migration_jobs_user_id ON public.blog_migration_jobs(user_id);
CREATE INDEX idx_blog_migration_jobs_status ON public.blog_migration_jobs(status);