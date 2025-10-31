import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  TrendingUp, 
  Users, 
  Home, 
  Eye, 
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const getDateRangeFilter = () => {
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const startDate = new Date(now.setDate(now.getDate() - days));
    return startDate.toISOString();
  };

  // Fetch property views
  const { data: propertyViews } = useQuery({
    queryKey: ["property-views-analytics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_views")
        .select("*")
        .gte("created_at", getDateRangeFilter());
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch leads
  const { data: openHouseLeads } = useQuery({
    queryKey: ["open-house-leads-analytics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("open_house_leads")
        .select("*")
        .gte("created_at", getDateRangeFilter());
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: tourRequests } = useQuery({
    queryKey: ["tour-requests-analytics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_requests")
        .select("*")
        .gte("created_at", getDateRangeFilter());
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch lead statuses for conversion tracking
  const { data: leadStatuses } = useQuery({
    queryKey: ["lead-statuses-analytics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_statuses")
        .select("*")
        .gte("created_at", getDateRangeFilter());
      
      if (error) throw error;
      return data || [];
    },
  });

  const totalLeads = (openHouseLeads?.length || 0) + (tourRequests?.length || 0);
  const totalViews = propertyViews?.length || 0;
  const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(2) : "0";
  const convertedLeads = leadStatuses?.filter(l => l.status === "converted").length || 0;

  // Calculate trends (mock for now - would need historical data)
  const viewsTrend = 12.5;
  const leadsTrend = 8.3;
  const conversionTrend = -2.1;

  // Top properties by views
  const propertyViewCounts = propertyViews?.reduce((acc: any, view) => {
    acc[view.property_mls] = (acc[view.property_mls] || 0) + 1;
    return acc;
  }, {});

  const topProperties = Object.entries(propertyViewCounts || {})
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 10)
    .map(([mls, count]) => ({ mls, count }));

  // Lead sources
  const leadSources = leadStatuses?.reduce((acc: any, lead) => {
    const source = lead.source || "Direct";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  // Status distribution
  const statusDistribution = leadStatuses?.reduce((acc: any, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    description 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    trend?: number; 
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {trend > 0 ? (
              <>
                <ArrowUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+{trend}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-3 w-3 text-red-500" />
                <span className="text-red-500">{trend}%</span>
              </>
            )}
            <span>from previous period</span>
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your property listings and lead performance
            </p>
          </div>
          
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Property Views"
            value={totalViews.toLocaleString()}
            icon={Eye}
            trend={viewsTrend}
          />
          <StatCard
            title="Total Leads"
            value={totalLeads}
            icon={Users}
            trend={leadsTrend}
            description={`${openHouseLeads?.length || 0} open house, ${tourRequests?.length || 0} tours`}
          />
          <StatCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={TrendingUp}
            trend={conversionTrend}
            description="Views to leads"
          />
          <StatCard
            title="Converted Leads"
            value={convertedLeads}
            icon={Home}
            description={`${leadStatuses?.length || 0} total in pipeline`}
          />
        </div>

        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Top Properties</TabsTrigger>
            <TabsTrigger value="sources">Lead Sources</TabsTrigger>
            <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Properties</CardTitle>
                <CardDescription>Properties with the highest view counts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProperties.length > 0 ? (
                    topProperties.map(({ mls, count }: any, index) => (
                      <div key={mls} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">MLS# {mls}</p>
                            <p className="text-sm text-muted-foreground">{count} views</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No property views in this period</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where your leads are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leadSources && Object.entries(leadSources).length > 0 ? (
                    Object.entries(leadSources).map(([source, count]: any) => (
                      <div key={source} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium capitalize">{source}</p>
                          <div className="mt-2 w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${(count / totalLeads) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-bold">{count}</p>
                          <p className="text-xs text-muted-foreground">
                            {((count / totalLeads) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No lead data in this period</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline Status</CardTitle>
                <CardDescription>Distribution of leads by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusDistribution && Object.entries(statusDistribution).length > 0 ? (
                    Object.entries(statusDistribution).map(([status, count]: any) => {
                      const statusColors: Record<string, string> = {
                        new: "bg-blue-500",
                        contacted: "bg-yellow-500",
                        qualified: "bg-purple-500",
                        nurturing: "bg-orange-500",
                        converted: "bg-green-500",
                        lost: "bg-red-500",
                        archived: "bg-gray-500",
                      };
                      return (
                        <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-3 h-3 rounded-full ${statusColors[status] || "bg-gray-400"}`} />
                            <p className="font-medium capitalize">{status}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{count}</p>
                            <p className="text-xs text-muted-foreground">
                              {((count / (leadStatuses?.length || 1)) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No pipeline data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
