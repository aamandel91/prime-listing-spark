import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  Home,
  Video,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  Clock,
  MessageSquare
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeadActivityDialog from "@/components/admin/LeadActivityDialog";

interface OpenHouseLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_mls: string;
  property_address: string;
  buyer_timeline: string;
  working_with_agent: boolean;
  created_at: string;
  page_url?: string;
  page_referrer?: string;
}

interface TourRequest {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  property_mls: string;
  property_address: string;
  tour_date: string;
  tour_type: string;
  status: string;
  comments: string | null;
  created_at: string;
}

type SortField = 'created_at' | 'name' | 'email';
type SortDirection = 'asc' | 'desc';

export default function Leads() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<{ id: string; name: string; email: string } | null>(null);

  // Fetch open house leads
  const { data: openHouseLeads, isLoading: loadingOpenHouse, refetch: refetchOpenHouse } = useQuery({
    queryKey: ["open-house-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("open_house_leads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as OpenHouseLead[];
    },
  });

  // Fetch tour requests
  const { data: tourRequests, isLoading: loadingTours, refetch: refetchTours } = useQuery({
    queryKey: ["tour-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TourRequest[];
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getTimeFilterDate = () => {
    const now = new Date();
    switch (timeFilter) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      default:
        return null;
    }
  };

  const filterAndSortLeads = <T extends { created_at: string; }>(
    leads: T[] | undefined,
    getSearchableText: (lead: T) => string,
    getSortValue: (lead: T, field: SortField) => string
  ) => {
    if (!leads) return [];

    let filtered = [...leads];

    // Apply time filter
    const filterDate = getTimeFilterDate();
    if (filterDate) {
      filtered = filtered.filter(lead => new Date(lead.created_at) >= filterDate);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        getSearchableText(lead).toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredOpenHouseLeads = filterAndSortLeads(
    openHouseLeads,
    (lead) => `${lead.first_name} ${lead.last_name} ${lead.email} ${lead.phone} ${lead.property_address}`,
    (lead, field) => {
      switch (field) {
        case 'name':
          return `${lead.first_name} ${lead.last_name}`;
        case 'email':
          return lead.email;
        case 'created_at':
          return lead.created_at;
        default:
          return lead.created_at;
      }
    }
  );

  const filteredTourRequests = filterAndSortLeads(
    tourRequests,
    (tour) => `${tour.visitor_name} ${tour.visitor_email} ${tour.visitor_phone || ''} ${tour.property_address}`,
    (tour, field) => {
      switch (field) {
        case 'name':
          return tour.visitor_name;
        case 'email':
          return tour.visitor_email;
        case 'created_at':
          return tour.created_at;
        default:
          return tour.created_at;
      }
    }
  );

  const exportToCSV = (leads: any[], filename: string) => {
    if (!leads.length) {
      toast({ title: "No data", description: "No leads to export", variant: "destructive" });
      return;
    }

    const headers = Object.keys(leads[0]).join(',');
    const rows = leads.map(lead => 
      Object.values(lead).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({ title: "Success", description: `Exported ${leads.length} leads to CSV` });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalLeads = (openHouseLeads?.length || 0) + (tourRequests?.length || 0);
  const todayLeads = [...(openHouseLeads || []), ...(tourRequests || [])].filter(
    lead => new Date(lead.created_at).toDateString() === new Date().toDateString()
  ).length;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">People & Leads</h1>
              <p className="text-muted-foreground">
                Manage all your property inquiries and leads in one place
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{totalLeads}</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Leads</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{todayLeads}</div>
                    <div className="text-sm text-muted-foreground mt-1">Today</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone, or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    refetchOpenHouse();
                    refetchTours();
                  }}
                >
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different lead types */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">
              All Leads ({filteredOpenHouseLeads.length + filteredTourRequests.length})
            </TabsTrigger>
            <TabsTrigger value="openhouse">
              Open House ({filteredOpenHouseLeads.length})
            </TabsTrigger>
            <TabsTrigger value="tours">
              Tour Requests ({filteredTourRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* All Leads Tab */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Leads</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(
                      [...filteredOpenHouseLeads, ...filteredTourRequests],
                      'all-leads'
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('created_at')} className="font-semibold">
                            Date <SortIcon field="created_at" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('name')} className="font-semibold">
                            Name <SortIcon field="name" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('email')} className="font-semibold">
                            Email <SortIcon field="email" />
                          </Button>
                        </TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...filteredOpenHouseLeads.map(l => ({ ...l, type: 'Open House' })),
                        ...filteredTourRequests.map(t => ({ ...t, type: 'Tour Request' }))]
                        .sort((a, b) => {
                          const comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                          return sortDirection === 'asc' ? -comparison : comparison;
                        })
                        .map((lead: any) => (
                          <TableRow key={lead.id}>
                            <TableCell className="text-sm">
                              {formatDate(lead.created_at)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {'first_name' in lead 
                                ? `${lead.first_name} ${lead.last_name}`
                                : lead.visitor_name}
                            </TableCell>
                            <TableCell>
                              <a href={`mailto:${'email' in lead ? lead.email : lead.visitor_email}`} className="text-primary hover:underline flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {'email' in lead ? lead.email : lead.visitor_email}
                              </a>
                            </TableCell>
                            <TableCell>
                              {('phone' in lead ? lead.phone : lead.visitor_phone) && (
                                <a href={`tel:${'phone' in lead ? lead.phone : lead.visitor_phone}`} className="text-primary hover:underline flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {'phone' in lead ? lead.phone : lead.visitor_phone}
                                </a>
                              )}
                            </TableCell>
                            <TableCell className="text-sm max-w-xs truncate">
                              {lead.property_address}
                            </TableCell>
                            <TableCell>
                              <Badge variant={lead.type === 'Open House' ? 'default' : 'secondary'}>
                                {lead.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => {
                                  const subject = encodeURIComponent(`RE: ${lead.property_address}`);
                                  const email = 'email' in lead ? lead.email : lead.visitor_email;
                                  window.location.href = `mailto:${email}?subject=${subject}`;
                                }}>
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setSelectedLead({
                                    id: lead.id,
                                    name: 'first_name' in lead ? `${lead.first_name} ${lead.last_name}` : lead.visitor_name,
                                    email: 'email' in lead ? lead.email : lead.visitor_email
                                  })}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Open House Leads Tab */}
          <TabsContent value="openhouse">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Open House Sign-Ins</CardTitle>
                    <CardDescription>Visitors who registered at open house events</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(filteredOpenHouseLeads, 'open-house-leads')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('created_at')} className="font-semibold">
                            Date <SortIcon field="created_at" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('name')} className="font-semibold">
                            Name <SortIcon field="name" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('email')} className="font-semibold">
                            Email <SortIcon field="email" />
                          </Button>
                        </TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Has Agent</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOpenHouseLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="text-sm">
                            {formatDate(lead.created_at)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {lead.first_name} {lead.last_name}
                          </TableCell>
                          <TableCell>
                            <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href={`tel:${lead.phone}`} className="text-primary hover:underline flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </a>
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {lead.property_address}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.buyer_timeline}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={lead.working_with_agent ? 'destructive' : 'default'}>
                              {lead.working_with_agent ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                            {lead.page_referrer || 'Direct'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tour Requests Tab */}
          <TabsContent value="tours">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tour Requests</CardTitle>
                    <CardDescription>Scheduled property tours and viewings</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => exportToCSV(filteredTourRequests, 'tour-requests')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('created_at')} className="font-semibold">
                            Requested <SortIcon field="created_at" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('name')} className="font-semibold">
                            Name <SortIcon field="name" />
                          </Button>
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Tour Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTourRequests.map((tour) => (
                        <TableRow key={tour.id}>
                          <TableCell className="text-sm">
                            {formatDate(tour.created_at)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {tour.visitor_name}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <a href={`mailto:${tour.visitor_email}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {tour.visitor_email}
                              </a>
                              {tour.visitor_phone && (
                                <a href={`tel:${tour.visitor_phone}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
                                  <Phone className="h-3 w-3" />
                                  {tour.visitor_phone}
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {tour.property_address}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(tour.tour_date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              {tour.tour_type === 'video' ? (
                                <Video className="h-3 w-3" />
                              ) : (
                                <Home className="h-3 w-3" />
                              )}
                              {tour.tour_type === 'video' ? 'Video' : 'In-Person'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                tour.status === 'pending' ? 'secondary' :
                                tour.status === 'confirmed' ? 'default' :
                                'destructive'
                              }
                            >
                              {tour.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {tour.comments || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      
      {selectedLead && (
        <LeadActivityDialog
          open={!!selectedLead}
          onOpenChange={(open) => !open && setSelectedLead(null)}
          leadId={selectedLead.id}
          leadName={selectedLead.name}
          leadEmail={selectedLead.email}
        />
      )}
    </div>
  );
}
