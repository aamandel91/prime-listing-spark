-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  license_number TEXT NOT NULL UNIQUE,
  bio TEXT,
  specialties TEXT[],
  languages TEXT[],
  years_experience INTEGER,
  profile_image_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT false,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  property_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_type TEXT DEFAULT 'youtube',
  category TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create content_pages table
CREATE TABLE IF NOT EXISTS public.content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_description TEXT,
  featured_image TEXT,
  page_type TEXT DEFAULT 'standard',
  parent_id UUID REFERENCES public.content_pages(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

-- Agents policies
CREATE POLICY "Anyone can view active agents"
  ON public.agents FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage all agents"
  ON public.agents FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can view their own profile"
  ON public.agents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Agents can update their own profile"
  ON public.agents FOR UPDATE
  USING (auth.uid() = user_id);

-- Testimonials policies
CREATE POLICY "Anyone can view published testimonials"
  ON public.testimonials FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Videos policies
CREATE POLICY "Anyone can view published videos"
  ON public.videos FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage videos"
  ON public.videos FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Content pages policies
CREATE POLICY "Anyone can view published pages"
  ON public.content_pages FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage content pages"
  ON public.content_pages FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_agents_license ON public.agents(license_number);
CREATE INDEX idx_agents_featured ON public.agents(featured) WHERE featured = true;
CREATE INDEX idx_testimonials_agent ON public.testimonials(agent_id);
CREATE INDEX idx_content_pages_slug ON public.content_pages(slug);
CREATE INDEX idx_content_pages_parent ON public.content_pages(parent_id);

-- Add 'agent' role if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'agent', 'user');
  ELSE
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'agent';
  END IF;
END $$;