-- Create table for open house sign-in leads
CREATE TABLE public.open_house_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  property_mls text NOT NULL,
  property_address text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  buyer_timeline text NOT NULL,
  working_with_agent boolean NOT NULL DEFAULT false,
  page_url text,
  page_referrer text
);

-- Enable RLS
ALTER TABLE public.open_house_leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit open house sign-ins
CREATE POLICY "Anyone can create open house leads"
ON public.open_house_leads
FOR INSERT
WITH CHECK (true);

-- Admins can view all open house leads
CREATE POLICY "Admins can view all open house leads"
ON public.open_house_leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update open house leads
CREATE POLICY "Admins can update open house leads"
ON public.open_house_leads
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));