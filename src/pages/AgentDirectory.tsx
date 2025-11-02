import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useRepliers } from "@/hooks/useRepliers";
import { RepliersProperty } from "@/types/repliers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowUpDown, User, Building2, Phone, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentAggregate {
  name: string;
  phone?: string;
  email?: string;
  office?: string;
  listingCount: number;
  totalValue: number;
  avgPrice: number;
  propertyTypes: Set<string>;
}

type SortOption = "name-asc" | "name-desc" | "listings-asc" | "listings-desc" | "value-asc" | "value-desc";

const AgentDirectory = () => {
  const { searchListings } = useRepliers();
  const [agents, setAgents] = useState<AgentAggregate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("listings-desc");
  const [selectedAgent, setSelectedAgent] = useState<AgentAggregate | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        // Fetch active listings with agent data
        const response = await searchListings({
          status: "Active",
          limit: 1000,
        });

        // Aggregate agent data from listings
        const agentMap = new Map<string, AgentAggregate>();

        response.listings?.forEach((listing: RepliersProperty) => {
          // Get primary agent from agents array
          const primaryAgent = listing.agents?.[0];
          const agentName = primaryAgent?.name || "Unknown Agent";
          const agentPhone = primaryAgent?.phones?.[0];
          const agentEmail = primaryAgent?.email;
          const office = listing.office?.brokerageName;
          const propertyType = listing.details?.propertyType;

          if (!agentMap.has(agentName)) {
            agentMap.set(agentName, {
              name: agentName,
              phone: agentPhone,
              email: agentEmail,
              office: office,
              listingCount: 0,
              totalValue: 0,
              avgPrice: 0,
              propertyTypes: new Set(),
            });
          }

          const agent = agentMap.get(agentName)!;
          agent.listingCount++;
          agent.totalValue += listing.listPrice || 0;
          if (propertyType) {
            agent.propertyTypes.add(propertyType);
          }
        });

        // Calculate averages and convert to array
        const agentList = Array.from(agentMap.values()).map(agent => ({
          ...agent,
          avgPrice: agent.listingCount > 0 ? agent.totalValue / agent.listingCount : 0,
        }));

        setAgents(agentList);
        if (agentList.length > 0) {
          setSelectedAgent(agentList[0]);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = agents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.office?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort agents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "listings-asc":
          return a.listingCount - b.listingCount;
        case "listings-desc":
          return b.listingCount - a.listingCount;
        case "value-asc":
          return a.totalValue - b.totalValue;
        case "value-desc":
          return b.totalValue - a.totalValue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [agents, searchTerm, sortBy]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Agent Directory - Find Top Real Estate Agents | Florida Real Estate</title>
        <meta name="description" content="Browse our directory of top-performing real estate agents in Florida. View agent listings, performance metrics, and contact information." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Agent Directory</h1>
            <p className="text-muted-foreground">
              Discover top-performing real estate agents and their active listings
            </p>
          </div>

          {/* Search and Sort Controls */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search agents by name or office..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full md:w-64">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="listings-desc">Most Listings</SelectItem>
                <SelectItem value="listings-asc">Fewest Listings</SelectItem>
                <SelectItem value="value-desc">Highest Portfolio Value</SelectItem>
                <SelectItem value="value-asc">Lowest Portfolio Value</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Agents ({filteredAndSortedAgents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {loading ? (
                      <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : filteredAndSortedAgents.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No agents found</p>
                      </div>
                    ) : (
                      filteredAndSortedAgents.map((agent) => (
                        <button
                          key={agent.name}
                          onClick={() => setSelectedAgent(agent)}
                          className={`w-full text-left p-4 border-b hover:bg-secondary/50 transition-colors ${
                            selectedAgent?.name === agent.name
                              ? "bg-secondary border-l-4 border-l-accent"
                              : ""
                          }`}
                        >
                          <div className="font-semibold text-foreground truncate">
                            {agent.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {agent.listingCount} {agent.listingCount === 1 ? "listing" : "listings"}
                          </div>
                          {agent.office && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {agent.office}
                            </div>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agent Detail Panel */}
            <div className="lg:col-span-2">
              {loading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ) : selectedAgent ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{selectedAgent.name}</CardTitle>
                        {selectedAgent.office && (
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {selectedAgent.office}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {selectedAgent.listingCount} Listings
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Contact Information */}
                    {(selectedAgent.phone || selectedAgent.email) && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">Contact Information</h3>
                        <div className="space-y-2">
                          {selectedAgent.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{selectedAgent.phone}</span>
                            </div>
                          )}
                          {selectedAgent.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{selectedAgent.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground mb-1">Active Listings</div>
                          <div className="text-2xl font-bold text-foreground">
                            {selectedAgent.listingCount}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground mb-1">Total Portfolio Value</div>
                          <div className="text-2xl font-bold text-foreground">
                            {formatCurrency(selectedAgent.totalValue)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground mb-1">Avg. Listing Price</div>
                          <div className="text-2xl font-bold text-foreground">
                            {formatCurrency(selectedAgent.avgPrice)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Property Types */}
                    {selectedAgent.propertyTypes.size > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Property Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(selectedAgent.propertyTypes).map((type) => (
                            <Badge key={type} variant="outline">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Button 
                        className="w-full"
                        onClick={() => {
                          // Navigate to listings filtered by this agent
                          window.location.href = `/listings?agent=${encodeURIComponent(selectedAgent.name)}`;
                        }}
                      >
                        View All Listings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select an agent to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AgentDirectory;
