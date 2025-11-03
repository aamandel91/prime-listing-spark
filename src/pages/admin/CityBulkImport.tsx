import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FLORIDA_CITIES = [
  { name: "Miami", slug: "miami", state: "FL" },
  { name: "Tampa", slug: "tampa", state: "FL" },
  { name: "Orlando", slug: "orlando", state: "FL" },
  { name: "Jacksonville", slug: "jacksonville", state: "FL" },
  { name: "Fort Lauderdale", slug: "fort-lauderdale", state: "FL" },
  { name: "St. Petersburg", slug: "st-petersburg", state: "FL" },
  { name: "Tallahassee", slug: "tallahassee", state: "FL" },
  { name: "Cape Coral", slug: "cape-coral", state: "FL" },
  { name: "Port St. Lucie", slug: "port-st-lucie", state: "FL" },
  { name: "Pembroke Pines", slug: "pembroke-pines", state: "FL" },
  { name: "Hollywood", slug: "hollywood", state: "FL" },
  { name: "Miramar", slug: "miramar", state: "FL" },
  { name: "Coral Springs", slug: "coral-springs", state: "FL" },
  { name: "Clearwater", slug: "clearwater", state: "FL" },
  { name: "Miami Gardens", slug: "miami-gardens", state: "FL" },
  { name: "Palm Bay", slug: "palm-bay", state: "FL" },
  { name: "Pompano Beach", slug: "pompano-beach", state: "FL" },
  { name: "West Palm Beach", slug: "west-palm-beach", state: "FL" },
  { name: "Lakeland", slug: "lakeland", state: "FL" },
  { name: "Davie", slug: "davie", state: "FL" },
  // Add more cities as needed
];

export default function CityBulkImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [csvData, setCsvData] = useState("");
  const [importResults, setImportResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });
  const { toast } = useToast();

  const handleBulkImportAll = async () => {
    setIsImporting(true);
    setImportResults({ success: 0, failed: 0, errors: [] });

    try {
      const results = { success: 0, failed: 0, errors: [] as string[] };

      for (const city of FLORIDA_CITIES) {
        const { error } = await supabase
          .from("featured_cities")
          .upsert({
            city_name: city.name,
            slug: city.slug,
            state: city.state,
            featured: true,
            sort_order: 0
          }, {
            onConflict: "slug"
          });

        if (error) {
          results.failed++;
          results.errors.push(`${city.name}: ${error.message}`);
        } else {
          results.success++;
        }
      }

      setImportResults(results);
      toast({
        title: "Bulk Import Complete",
        description: `Successfully imported ${results.success} cities. ${results.failed} failed.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "No Data",
        description: "Please paste CSV data first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportResults({ success: 0, failed: 0, errors: [] });

    try {
      const lines = csvData.trim().split("\n");
      const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
      
      const nameIndex = headers.indexOf("name") || headers.indexOf("city_name");
      const slugIndex = headers.indexOf("slug");
      const stateIndex = headers.indexOf("state");

      if (nameIndex === -1) {
        throw new Error("CSV must have 'name' or 'city_name' column");
      }

      const results = { success: 0, failed: 0, errors: [] as string[] };

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim().replace(/^["']|["']$/g, ""));
        
        if (values.length < 2) continue;

        const cityName = values[nameIndex];
        const slug = slugIndex !== -1 ? values[slugIndex] : cityName.toLowerCase().replace(/\s+/g, "-");
        const state = stateIndex !== -1 ? values[stateIndex] : "FL";

        const { error } = await supabase
          .from("featured_cities")
          .upsert({
            city_name: cityName,
            slug: slug,
            state: state,
            featured: true,
            sort_order: i
          }, {
            onConflict: "slug"
          });

        if (error) {
          results.failed++;
          results.errors.push(`${cityName}: ${error.message}`);
        } else {
          results.success++;
        }
      }

      setImportResults(results);
      toast({
        title: "CSV Import Complete",
        description: `Successfully imported ${results.success} cities. ${results.failed} failed.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = "name,slug,state\nMiami,miami,FL\nTampa,tampa,FL\nOrlando,orlando,FL";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "city-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk City Import</h1>
        <p className="text-muted-foreground">
          Import multiple cities at once to quickly populate your site
        </p>
      </div>

      <Tabs defaultValue="preset" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preset">Preset Florida Cities</TabsTrigger>
          <TabsTrigger value="csv">CSV Import</TabsTrigger>
        </TabsList>

        <TabsContent value="preset">
          <Card>
            <CardHeader>
              <CardTitle>Import All Florida Cities</CardTitle>
              <CardDescription>
                Import {FLORIDA_CITIES.length} major Florida cities with one click
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleBulkImportAll}
                disabled={isImporting}
                size="lg"
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing Cities...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import All {FLORIDA_CITIES.length} Cities
                  </>
                )}
              </Button>

              {importResults.success > 0 && (
                <div className="space-y-2">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      ✓ Successfully imported {importResults.success} cities
                    </p>
                  </div>
                  
                  {importResults.failed > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        ✗ Failed to import {importResults.failed} cities
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle>Import from CSV</CardTitle>
              <CardDescription>
                Upload a custom list of cities in CSV format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="mb-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Template
                </Button>
                
                <Textarea
                  placeholder="Paste CSV data here...&#10;name,slug,state&#10;Miami,miami,FL&#10;Tampa,tampa,FL"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Format: name,slug,state (header row required)
                </p>
              </div>

              <Button
                onClick={handleCsvImport}
                disabled={isImporting || !csvData.trim()}
                size="lg"
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import from CSV
                  </>
                )}
              </Button>

              {importResults.success > 0 && (
                <div className="space-y-2">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      ✓ Successfully imported {importResults.success} cities
                    </p>
                  </div>
                  
                  {importResults.failed > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        ✗ Failed to import {importResults.failed} cities
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
