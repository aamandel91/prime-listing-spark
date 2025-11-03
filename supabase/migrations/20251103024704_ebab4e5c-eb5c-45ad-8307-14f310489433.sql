-- Add subdomain field to agents table
ALTER TABLE public.agents
ADD COLUMN subdomain text UNIQUE;

-- Add index for faster subdomain lookups
CREATE INDEX idx_agents_subdomain ON public.agents(subdomain);

-- Update lead_statuses to ensure assigned_agent is properly linked
ALTER TABLE public.lead_statuses
ADD CONSTRAINT fk_lead_statuses_agent 
FOREIGN KEY (assigned_agent) 
REFERENCES public.agents(id) 
ON DELETE SET NULL;