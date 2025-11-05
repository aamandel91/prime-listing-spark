import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useRepliers } from "@/hooks/useRepliers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedImage from "@/components/OptimizedImage";
import { Loader2, Mail, Phone, Star } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentDetail() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [activeListings, setActiveListings] = useState<any[]>([]);
  const [soldListings, setSoldListings] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const repliers = useRepliers();

  useEffect(() => {
    fetchAgentData();
  }, [agentId]);

  const fetchAgentData = async () => {
    try {
      // Fetch agent profile
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select("*")
        .eq("id", agentId)
        .single();

      if (agentError) throw agentError;
      setAgent(agentData);

      // Fetch agent's testimonials
      const { data: testimonialsData } = await supabase
        .from("testimonials")
        .select("*")
        .eq("agent_id", agentId)
        .eq("published", true);

      setTestimonials(testimonialsData || []);

      // Fetch active listings from Repliers API using license number
      if (agentData.license_number) {
        const { data: activeData } = await supabase.functions.invoke("repliers-proxy", {
          body: {
            endpoint: "/listings",
            params: {
              agentLicense: agentData.license_number,
              standardStatus: "A",
              limit: "50",
            },
          },
        });

        setActiveListings(activeData?.listings || []);

        // Fetch sold listings
        const { data: soldData } = await supabase.functions.invoke("repliers-proxy", {
          body: {
            endpoint: "/listings",
            params: {
              agentLicense: agentData.license_number,
              standardStatus: "S",
              limit: "50",
            },
          },
        });

        setSoldListings(soldData?.listings || []);
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold">Agent not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{agent.full_name} - Real Estate Agent</title>
        <meta name="description" content={agent.bio || `Contact ${agent.full_name} for real estate services`} />
      </Helmet>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Agent Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {agent.profile_image_url && (
                <OptimizedImage
                  src={agent.profile_image_url}
                  alt={agent.full_name}
                  className="rounded-lg"
                  width={384}
                  height={384}
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{agent.full_name}</h1>
                <p className="text-muted-foreground mb-4">
                  License: {agent.license_number}
                  {agent.years_experience && ` • ${agent.years_experience} years experience`}
                </p>
                {agent.bio && <p className="mb-4">{agent.bio}</p>}
                {agent.specialties && agent.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.specialties.map((specialty: string, i: number) => (
                      <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <Button asChild>
                    <a href={`mailto:${agent.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                  {agent.phone && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${agent.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings & Testimonials */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">
              Active Listings ({activeListings.length})
            </TabsTrigger>
            <TabsTrigger value="sold">
              Recent Sales ({soldListings.length})
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              Testimonials ({testimonials.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.map((property) => (
                <Card key={property.ListingId}>
                  <CardContent className="p-4">
                    <p className="font-semibold">{property.UnparsedAddress}</p>
                    <p className="text-lg font-bold text-primary">
                      ${property.ListPrice?.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {activeListings.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-12">
                  No active listings
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sold" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldListings.map((property) => (
                <Card key={property.ListingId}>
                  <CardContent className="p-4">
                    <p className="font-semibold">{property.UnparsedAddress}</p>
                    <p className="text-lg font-bold text-primary">
                      ${(property.ClosePrice || property.ListPrice)?.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {soldListings.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-12">
                  No recent sales
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <div className="grid gap-4">
              {testimonials.map((testimonial: any) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{testimonial.client_name}</h3>
                        {testimonial.client_role && (
                          <p className="text-sm text-muted-foreground">{testimonial.client_role}</p>
                        )}
                      </div>
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">{testimonial.content}</p>
                    {testimonial.property_address && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Property: {testimonial.property_address}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {testimonials.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No testimonials yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
