-- Create tour_requests table for scheduling
CREATE TABLE IF NOT EXISTS public.tour_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_mls TEXT NOT NULL,
  property_address TEXT NOT NULL,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT,
  tour_date TIMESTAMP WITH TIME ZONE NOT NULL,
  tour_type TEXT NOT NULL CHECK (tour_type IN ('in-person', 'video')),
  comments TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tour_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can create tour requests (public form)
CREATE POLICY "Anyone can create tour requests"
  ON public.tour_requests FOR INSERT
  WITH CHECK (true);

-- Admins can view all tour requests
CREATE POLICY "Admins can view all tour requests"
  ON public.tour_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update tour requests
CREATE POLICY "Admins can update tour requests"
  ON public.tour_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER handle_tour_requests_updated_at
  BEFORE UPDATE ON public.tour_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();