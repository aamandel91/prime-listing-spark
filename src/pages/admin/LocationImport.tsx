import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, RefreshCw, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface LocationFromAPI {
  id: string;
  name: string;
  type: "area" | "city" | "neighborhood";
  state: string;
  fullName: string;
  metadata?: {
    city?: string;
    area?: string;
    county?: string;
  };
}

export default function LocationImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedState, setSelectedState] = useState("FL");
  const [selectedType, setSelectedType] = useState<string>("city");
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<LocationFromAPI[]>([]);
  const [importResults, setImportResults] = useState<{ 
    success: number; 
    failed: number; 
    skipped: number;
    errors: string[] 
  }>({
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  });
  const { toast } = useToast();

  const US_STATES = [
    { code: "FL", name: "Florida" },
    { code: "TX", name: "Texas" },
    { code: "CA", name: "California" },
    { code: "NY", name: "New York" },
    { code: "GA", name: "Georgia" },
    { code: "NC", name: "North Carolina" },
    { code: "AZ", name: "Arizona" },
    { code: "NV", name: "Nevada" },
    { code: "CO", name: "Colorado" },
    { code: "WA", name: "Washington" }
  ];

  const fetchLocationsFromAPI = async () => {
    setIsFetching(true);
    setLocations([]);
    
    try {
      let endpoint = "locations";
      const params: any = {};
      
      if (searchQuery.length >= 2) {
        endpoint = "locations-autocomplete";
        params.q = searchQuery;
        params.limit = "100";
      } else {
        if (selectedType) params.type = selectedType;
        if (selectedState) params.state = selectedState;
      }

      const { data, error } = await supabase.functions.invoke("repliers-proxy", {
        body: { endpoint, params }
      });

      if (error) throw error;

      const locationData = data?.locations || [];
      setLocations(locationData);
      
      toast({
        title: "Locations Fetched",
        description: `Found ${locationData.length} locations from Repliers API`,
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast({
        title: "Fetch Failed",
        description: error instanceof Error ? error.message : "Failed to fetch locations",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleImportLocations = async () => {
    if (locations.length === 0) {
      toast({
        title: "No Locations",
        description: "Fetch locations from the API first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportResults({ success: 0, failed: 0, skipped: 0, errors: [] });

    try {
      const results = { success: 0, failed: 0, skipped: 0, errors: [] as string[] };

      for (const location of locations) {
        if (location.type !== "city") {
          results.skipped++;
          continue;
        }

        const slug = location.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();

        const { data: existing } = await supabase
          .from("featured_cities")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (existing) {
          results.skipped++;
          continue;
        }

        const { error } = await supabase
          .from("featured_cities")
          .insert({
            city_name: location.name,
            slug: slug,
            state: location.state,
            featured: true,
            sort_order: 0,
            description: `Discover real estate in ${location.fullName}`,
            custom_content: {
              repliers_id: location.id,
              full_name: location.fullName,
              metadata: location.metadata || {}
            }
          });

        if (error) {
          results.failed++;
          results.errors.push(`${location.name}: ${error.message}`);
        } else {
          results.success++;
        }
      }

      setImportResults(results);
      toast({
        title: "Import Complete",
        description: `✓ ${results.success} imported | ⊘ ${results.skipped} skipped | ✗ ${results.failed} failed`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadLocationData = () => {
    const csv = [
      "Name,Type,State,Full Name,County",
      ...locations.map(loc => 
        `"${loc.name}","${loc.type}","${loc.state}","${loc.fullName}","${loc.metadata?.county || ''}"`
      )
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `locations-${selectedState}-${selectedType}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Location Import from Repliers API</h1>
        <p className="text-muted-foreground">
          Fetch and import cities, neighborhoods, and areas directly from the Repliers API
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search locations from Repliers API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="state">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Location Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city">Cities</SelectItem>
                  <SelectItem value="neighborhood">Neighborhoods</SelectItem>
                  <SelectItem value="area">Areas</SelectItem>
                  <SelectItem value="">All Types</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search (optional)</Label>
              <Input
                id="search"
                placeholder="Miami, Orlando..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to fetch all {selectedType || "locations"} in {selectedState}
              </p>
            </div>

            <Button
              onClick={fetchLocationsFromAPI}
              disabled={isFetching}
              className="w-full"
            >
              {isFetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Locations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fetched Locations ({locations.length})</CardTitle>
                <CardDescription>
                  Click Import to add cities to your database
                </CardDescription>
              </div>
              {locations.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadLocationData}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleImportLocations}
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Import Cities
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {locations.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No locations fetched yet. Use the filters to search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {location.fullName}
                        </div>
                        {location.metadata?.county && (
                          <div className="text-xs text-muted-foreground">
                            County: {location.metadata.county}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline">{location.type}</Badge>
                    </div>
                  ))}
                </div>

                {importResults.success > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        ✓ Successfully imported {importResults.success} cities
                      </p>
                    </div>
                    
                    {importResults.skipped > 0 && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          ⊘ Skipped {importResults.skipped} locations (non-cities or duplicates)
                        </p>
                      </div>
                    )}
                    
                    {importResults.failed > 0 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                          ✗ Failed to import {importResults.failed} locations
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {importResults.errors.map((error, i) => (
                            <p key={i} className="text-xs text-red-800 dark:text-red-200">
                              {error}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Available Data from Repliers API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🏙️ Cities</h3>
              <p className="text-sm text-muted-foreground">
                Major cities and municipalities with full state data
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🏘️ Neighborhoods</h3>
              <p className="text-sm text-muted-foreground">
                Local neighborhoods within cities
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📍 Areas</h3>
              <p className="text-sm text-muted-foreground">
                Regional areas and districts
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> County data is available in the metadata field. 
              ZIP codes and subdivisions are not directly available from the locations endpoint,
              but can be extracted from property listings data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
