-- Create lead status enum
CREATE TYPE public.lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'nurturing',
  'converted',
  'lost',
  'archived'
);

-- Create lead notes/activity tracking table
CREATE TABLE public.lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_email TEXT NOT NULL,
  lead_name TEXT,
  activity_type TEXT NOT NULL, -- 'note', 'call', 'email', 'meeting', 'status_change'
  activity_content TEXT,
  old_status public.lead_status,
  new_status public.lead_status,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create lead status tracking table
CREATE TABLE public.lead_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_email TEXT NOT NULL UNIQUE,
  lead_name TEXT,
  lead_phone TEXT,
  status public.lead_status NOT NULL DEFAULT 'new',
  assigned_agent UUID REFERENCES auth.users(id),
  first_contact_date TIMESTAMP WITH TIME ZONE,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  conversion_date TIMESTAMP WITH TIME ZONE,
  source TEXT, -- 'open_house', 'tour_request', 'property_inquiry', 'registration'
  source_property_mls TEXT,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property views tracking table
CREATE TABLE public.property_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_mls TEXT NOT NULL,
  property_address TEXT,
  visitor_email TEXT,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  view_duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics summary table for quick queries
CREATE TABLE public.analytics_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  metric_type TEXT NOT NULL, -- 'property_views', 'leads_generated', 'tours_scheduled', 'searches'
  metric_value INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date, metric_type)
);

-- Create email notification queue table
CREATE TABLE public.email_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  template_name TEXT,
  template_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_activities
CREATE POLICY "Admins can view all lead activities"
ON public.lead_activities FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create lead activities"
ON public.lead_activities FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update lead activities"
ON public.lead_activities FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for lead_statuses
CREATE POLICY "Admins can view all lead statuses"
ON public.lead_statuses FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage lead statuses"
ON public.lead_statuses FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for property_views (anyone can insert, admins can view)
CREATE POLICY "Anyone can track property views"
ON public.property_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all property views"
ON public.property_views FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for analytics_summary
CREATE POLICY "Admins can view analytics"
ON public.analytics_summary FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage analytics"
ON public.analytics_summary FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for email_notifications
CREATE POLICY "Admins can view all email notifications"
ON public.email_notifications FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage email notifications"
ON public.email_notifications FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_lead_statuses_updated_at
BEFORE UPDATE ON public.lead_statuses
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_email_notifications_updated_at
BEFORE UPDATE ON public.email_notifications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_lead_activities_email ON public.lead_activities(lead_email);
CREATE INDEX idx_lead_activities_created_at ON public.lead_activities(created_at DESC);
CREATE INDEX idx_lead_statuses_email ON public.lead_statuses(lead_email);
CREATE INDEX idx_lead_statuses_status ON public.lead_statuses(status);
CREATE INDEX idx_property_views_mls ON public.property_views(property_mls);
CREATE INDEX idx_property_views_email ON public.property_views(visitor_email);
CREATE INDEX idx_property_views_created_at ON public.property_views(created_at DESC);
CREATE INDEX idx_analytics_date_type ON public.analytics_summary(date DESC, metric_type);
CREATE INDEX idx_email_notifications_status ON public.email_notifications(status, created_at);