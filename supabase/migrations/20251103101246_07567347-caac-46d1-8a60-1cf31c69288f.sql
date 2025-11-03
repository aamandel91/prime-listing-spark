-- Create table for competitor analysis results
CREATE TABLE IF NOT EXISTS public.competitor_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  result JSONB,
  error_message TEXT,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Enable RLS
ALTER TABLE public.competitor_analyses ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all analyses
CREATE POLICY "Admins can view all analyses"
  ON public.competitor_analyses
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert analyses
CREATE POLICY "Admins can insert analyses"
  ON public.competitor_analyses
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update analyses
CREATE POLICY "Admins can update analyses"
  ON public.competitor_analyses
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete analyses
CREATE POLICY "Admins can delete analyses"
  ON public.competitor_analyses
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_competitor_analyses_user_id ON public.competitor_analyses(user_id);
CREATE INDEX idx_competitor_analyses_status ON public.competitor_analyses(status);
CREATE INDEX idx_competitor_analyses_created_at ON public.competitor_analyses(created_at DESC);