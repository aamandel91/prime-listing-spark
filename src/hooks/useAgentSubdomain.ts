import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AgentSubdomainInfo {
  agentId: string | null;
  subdomain: string | null;
  isAgentSubdomain: boolean;
  agentData: any | null;
}

export const useAgentSubdomain = () => {
  const [subdomainInfo, setSubdomainInfo] = useState<AgentSubdomainInfo>({
    agentId: null,
    subdomain: null,
    isAgentSubdomain: false,
    agentData: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectSubdomain = async () => {
      // Extract subdomain from hostname
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      
      // Check if we have a subdomain (more than 2 parts for .com, or specific pattern)
      // Example: agent.mysite.com -> parts = ['agent', 'mysite', 'com']
      if (parts.length > 2) {
        const subdomain = parts[0];
        
        // Skip common subdomains that aren't agent subdomains
        if (['www', 'api', 'admin'].includes(subdomain)) {
          setLoading(false);
          return;
        }

        try {
          // Fetch agent by subdomain
          const { data: agent, error } = await supabase
            .from('agents')
            .select('*')
            .eq('subdomain', subdomain)
            .eq('active', true)
            .maybeSingle();

          if (error || !agent) {
            console.log('No agent found for subdomain:', subdomain);
            setLoading(false);
            return;
          }

          setSubdomainInfo({
            agentId: agent.id,
            subdomain,
            isAgentSubdomain: true,
            agentData: agent,
          });
        } catch (error) {
          console.error('Error fetching agent subdomain:', error);
        }
      }
      
      setLoading(false);
    };

    detectSubdomain();
  }, []);

  return { ...subdomainInfo, loading };
};
