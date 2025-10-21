-- Create saved_properties table
CREATE TABLE public.saved_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create hidden_properties table
CREATE TABLE public.hidden_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_properties
CREATE POLICY "Users can view their own saved properties"
ON public.saved_properties
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties"
ON public.saved_properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their properties"
ON public.saved_properties
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for hidden_properties
CREATE POLICY "Users can view their own hidden properties"
ON public.hidden_properties
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can hide properties"
ON public.hidden_properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unhide their properties"
ON public.hidden_properties
FOR DELETE
USING (auth.uid() = user_id);