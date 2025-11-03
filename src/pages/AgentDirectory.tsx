import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Loader2, Star } from "lucide-react";

export default function AgentDirectory() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("sort_order");

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter((agent) =>
    agent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.specialties?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Agent Directory - Find Top Real Estate Agents</title>
        <meta
          name="description"
          content="Browse our directory of professional real estate agents. Find the perfect agent for your home buying or selling needs."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Our Real Estate Agents</h1>
            <p className="text-muted-foreground text-lg">
              Meet our team of experienced professionals ready to help you with all your real estate
              needs.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search agents by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    {agent.profile_image_url && (
                      <img
                        src={agent.profile_image_url}
                        alt={agent.full_name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold">{agent.full_name}</h3>
                      {agent.featured && (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    {agent.years_experience && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {agent.years_experience} years experience
                      </p>
                    )}
                    {agent.specialties && agent.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {agent.specialties.map((specialty: string, i: number) => (
                          <span
                            key={i}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                    {agent.bio && <p className="text-sm mb-4 line-clamp-3">{agent.bio}</p>}
                    <div className="flex flex-col gap-2">
                      <Button variant="default" className="w-full" asChild>
                        <Link to={`/agents/${agent.id}`}>View Profile & Listings</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`mailto:${agent.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </a>
                      </Button>
                      {agent.phone && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`tel:${agent.phone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAgents.length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>No agents found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
