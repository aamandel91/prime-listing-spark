import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ExtractedData {
  zipcodes: Map<string, { count: number; city?: string; avgPrice?: number }>;
  neighborhoods: Map<string, { count: number; city?: string; avgPrice?: number }>;
}

export default function ListingDataExtractor() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedState, setSelectedState] = useState("FL");
  const [batchSize, setBatchSize] = useState(1000);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [importResults, setImportResults] = useState<{ 
    zipcodes: { success: number; failed: number };
    neighborhoods: { success: number; failed: number };
  } | null>(null);
  const { toast } = useToast();

  const extractDataFromListings = async () => {
    setIsExtracting(true);
    setProgress(0);
    setExtractedData(null);

    try {
      const zipcodes = new Map<string, { count: number; city?: string; avgPrice?: number }>();
      const neighborhoods = new Map<string, { count: number; city?: string; avgPrice?: number }>();
      
      let offset = 0;
      let hasMore = true;
      let totalProcessed = 0;

      while (hasMore && totalProcessed < batchSize) {
        const { data, error } = await supabase.functions.invoke("repliers-proxy", {
          body: {
            endpoint: "/listings",
            params: {
              state: selectedState,
              standardStatus: "A",
              limit: 100,
              offset
            }
          }
        });

        if (error) throw error;

        const listings = data?.listings || [];
        if (listings.length === 0) {
          hasMore = false;
          break;
        }

        listings.forEach((listing: any) => {
          // Extract ZIP code
          const zip = listing.address?.zip || listing.PostalCode;
          if (zip) {
            const existing = zipcodes.get(zip) || { count: 0, avgPrice: 0 };
            existing.count++;
            existing.city = listing.address?.city || listing.City || existing.city;
            
            const price = listing.listPrice || listing.ListPrice || 0;
            existing.avgPrice = ((existing.avgPrice || 0) * (existing.count - 1) + price) / existing.count;
            
            zipcodes.set(zip, existing);
          }

          // Extract neighborhood/subdivision
          const neighborhood = listing.address?.neighborhood || 
                             listing.SubdivisionName || 
                             listing.NeighborhoodName;
          
          if (neighborhood && neighborhood.trim()) {
            const key = neighborhood.trim();
            const existing = neighborhoods.get(key) || { count: 0, avgPrice: 0 };
            existing.count++;
            existing.city = listing.address?.city || listing.City || existing.city;
            
            const price = listing.listPrice || listing.ListPrice || 0;
            existing.avgPrice = ((existing.avgPrice || 0) * (existing.count - 1) + price) / existing.count;
            
            neighborhoods.set(key, existing);
          }
        });

        totalProcessed += listings.length;
        offset += 100;
        setProgress(Math.min(100, (totalProcessed / batchSize) * 100));

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setExtractedData({ zipcodes, neighborhoods });
      
      toast({
        title: "Extraction Complete",
        description: `Found ${zipcodes.size} ZIP codes and ${neighborhoods.size} neighborhoods from ${totalProcessed} listings`,
      });
    } catch (error) {
      console.error("Error extracting data:", error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract data",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
      setProgress(100);
    }
  };

  const importToDatabase = async () => {
    if (!extractedData) return;

    setIsImporting(true);
    const results = {
      zipcodes: { success: 0, failed: 0 },
      neighborhoods: { success: 0, failed: 0 }
    };

    try {
      // Import ZIP codes
      for (const [zipcode, data] of extractedData.zipcodes.entries()) {
        const { error } = await supabase
          .from("featured_zipcodes")
          .upsert({
            zipcode,
            city: data.city,
            state: selectedState,
            property_count: data.count,
            avg_price: data.avgPrice,
            description: `Explore ${data.count} homes for sale in ${zipcode}${data.city ? `, ${data.city}` : ''}, ${selectedState}`,
            featured: true
          }, {
            onConflict: "zipcode"
          });

        if (error) {
          console.error(`Failed to import ZIP ${zipcode}:`, error);
          results.zipcodes.failed++;
        } else {
          results.zipcodes.success++;
        }
      }

      // Import neighborhoods
      for (const [name, data] of extractedData.neighborhoods.entries()) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim();

        const { error } = await supabase
          .from("featured_neighborhoods")
          .upsert({
            name,
            slug,
            city: data.city,
            state: selectedState,
            property_count: data.count,
            avg_price: data.avgPrice,
            description: `Discover ${data.count} homes for sale in ${name}${data.city ? `, ${data.city}` : ''}, ${selectedState}`,
            featured: true
          }, {
            onConflict: "slug"
          });

        if (error) {
          console.error(`Failed to import neighborhood ${name}:`, error);
          results.neighborhoods.failed++;
        } else {
          results.neighborhoods.success++;
        }
      }

      setImportResults(results);
      toast({
        title: "Import Complete",
        description: `Imported ${results.zipcodes.success} ZIP codes and ${results.neighborhoods.success} neighborhoods`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadCSV = (type: 'zipcodes' | 'neighborhoods') => {
    if (!extractedData) return;

    const data = type === 'zipcodes' ? extractedData.zipcodes : extractedData.neighborhoods;
    const headers = type === 'zipcodes' 
      ? "ZIP Code,City,Property Count,Avg Price\n"
      : "Neighborhood,City,Property Count,Avg Price\n";
    
    const rows = Array.from(data.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, value]) => 
        `"${key}","${value.city || ''}",${value.count},${value.avgPrice?.toFixed(0) || 0}`
      )
      .join("\n");

    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-${selectedState}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Listing Data Extractor</h1>
        <p className="text-muted-foreground">
          Extract ZIP codes and neighborhoods from active listings for SEO page generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Set extraction parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="state">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batch">Batch Size (max listings to process)</Label>
              <Input
                id="batch"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                min={100}
                max={10000}
                step={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Larger batches = more data but slower
              </p>
            </div>

            {isExtracting && (
              <div>
                <Label>Progress</Label>
                <Progress value={progress} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progress.toFixed(0)}% complete
                </p>
              </div>
            )}

            <Button
              onClick={extractDataFromListings}
              disabled={isExtracting}
              className="w-full"
              size="lg"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Extract from Listings
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Extracted Data</CardTitle>
                <CardDescription>
                  ZIP codes and neighborhoods found in listings
                </CardDescription>
              </div>
              {extractedData && (
                <Button
                  onClick={importToDatabase}
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Import to Database
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!extractedData ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No data extracted yet. Click "Extract from Listings" to begin.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">
                      ZIP Codes ({extractedData.zipcodes.size})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCSV('zipcodes')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {Array.from(extractedData.zipcodes.entries())
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 50)
                      .map(([zip, data]) => (
                        <div key={zip} className="flex items-center justify-between p-2 bg-secondary rounded">
                          <div>
                            <div className="font-medium">{zip}</div>
                            <div className="text-xs text-muted-foreground">{data.city}</div>
                          </div>
                          <Badge variant="outline">{data.count} props</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">
                      Neighborhoods ({extractedData.neighborhoods.size})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCSV('neighborhoods')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {Array.from(extractedData.neighborhoods.entries())
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 50)
                      .map(([name, data]) => (
                        <div key={name} className="flex items-center justify-between p-2 bg-secondary rounded">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{name}</div>
                            <div className="text-xs text-muted-foreground">{data.city}</div>
                          </div>
                          <Badge variant="outline">{data.count} props</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                {importResults && (
                  <div className="space-y-2">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        ✓ Imported {importResults.zipcodes.success} ZIP codes and {importResults.neighborhoods.success} neighborhoods
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>SEO Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p><strong>Why Extract ZIP Codes & Neighborhoods?</strong></p>
            <ul>
              <li><strong>Long-tail SEO:</strong> Capture searches like "homes for sale in 33129" or "houses in Coral Gables"</li>
              <li><strong>Local targeting:</strong> Ultra-specific location pages rank better for local searches</li>
              <li><strong>Property count optimization:</strong> Only create pages for ZIPs/neighborhoods with sufficient inventory</li>
              <li><strong>Automated updates:</strong> Re-run extraction periodically to keep data fresh</li>
            </ul>
            <p><strong>Best Practices:</strong></p>
            <ul>
              <li>Set batch size to 1000-2000 for comprehensive data without overwhelming the API</li>
              <li>Filter out ZIPs/neighborhoods with {"<"} 5 properties to avoid thin content</li>
              <li>Run extraction monthly to capture new subdivisions and emerging areas</li>
              <li>Export to CSV to review data quality before importing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
