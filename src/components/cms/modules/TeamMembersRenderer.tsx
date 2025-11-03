import { TeamMembersModule } from "@/types/contentModules";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

interface TeamMembersRendererProps {
  module: TeamMembersModule;
}

export function TeamMembersRenderer({ module }: TeamMembersRendererProps) {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      let query = supabase.from("agents").select("*").eq("active", true);
      
      if (module.featured) {
        query = query.eq("featured", true);
      }
      
      query = query.order("sort_order").limit(module.limit || 12);
      
      const { data } = await query;
      setAgents(data || []);
    };

    fetchAgents();
  }, [module.featured, module.limit]);

  return (
    <div className="module-team-members">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Link key={agent.id} to={`/agents/${agent.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              {agent.profile_image_url && (
                <img
                  src={agent.profile_image_url}
                  alt={agent.full_name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              )}
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">{agent.full_name}</h3>
                {agent.bio && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">{agent.bio}</p>
                )}
                <div className="space-y-2 text-sm">
                  {agent.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{agent.email}</span>
                    </div>
                  )}
                  {agent.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
