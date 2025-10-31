import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SEOSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [propertyNoindex, setPropertyNoindex] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*");

      if (error) throw error;

      const noindexSetting = data?.find(s => s.setting_key === 'property_pages_noindex');
      const lastGenSetting = data?.find(s => s.setting_key === 'sitemap_last_generated');

      if (noindexSetting?.setting_value && typeof noindexSetting.setting_value === 'object' && 'enabled' in noindexSetting.setting_value) {
        setPropertyNoindex(noindexSetting.setting_value.enabled as boolean);
      }

      if (lastGenSetting?.setting_value && typeof lastGenSetting.setting_value === 'object' && 'timestamp' in lastGenSetting.setting_value) {
        const timestamp = lastGenSetting.setting_value.timestamp;
        if (timestamp && typeof timestamp === 'string') {
          setLastGenerated(timestamp);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch SEO settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNoindex = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("seo_settings")
        .update({
          setting_value: {
            enabled: propertyNoindex,
            description: "Control whether property detail pages should be noindex/nofollow"
          }
        })
        .eq("setting_key", "property_pages_noindex");

      if (error) throw error;

      toast({
        title: "Success",
        description: "SEO settings updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const generateSitemaps = async () => {
    setGenerating(true);
    try {
      // Generate both sitemaps
      const contentResponse = await supabase.functions.invoke('generate-sitemap-content');
      const listingsResponse = await supabase.functions.invoke('generate-sitemap-listings');

      if (contentResponse.error) throw contentResponse.error;
      if (listingsResponse.error) throw listingsResponse.error;

      // Download content sitemap
      const contentBlob = new Blob([contentResponse.data], { type: 'application/xml' });
      const contentUrl = window.URL.createObjectURL(contentBlob);
      const contentLink = document.createElement('a');
      contentLink.href = contentUrl;
      contentLink.download = 'sitemap-content.xml';
      contentLink.click();

      // Download listings sitemap
      const listingsBlob = new Blob([listingsResponse.data], { type: 'application/xml' });
      const listingsUrl = window.URL.createObjectURL(listingsBlob);
      const listingsLink = document.createElement('a');
      listingsLink.href = listingsUrl;
      listingsLink.download = 'sitemap-listings.xml';
      listingsLink.click();

      toast({
        title: "Success",
        description: "Sitemaps generated and downloaded successfully",
      });

      fetchSettings(); // Refresh to get updated timestamp
    } catch (error) {
      console.error("Error generating sitemaps:", error);
      toast({
        title: "Error",
        description: "Failed to generate sitemaps",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage search engine optimization settings for your site
          </p>
        </div>

        <div className="grid gap-6 max-w-3xl">
          {/* Property Pages Indexing */}
          <Card>
            <CardHeader>
              <CardTitle>Property Pages Indexing</CardTitle>
              <CardDescription>
                Control whether property detail pages should be indexed by search engines.
                Enable noindex/nofollow to prevent Google from crawling property pages while you focus on content pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="property-noindex">
                    Noindex/Nofollow Property Pages
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, property detail pages will have meta robots noindex, nofollow tags
                  </p>
                </div>
                <Switch
                  id="property-noindex"
                  checked={propertyNoindex}
                  onCheckedChange={setPropertyNoindex}
                />
              </div>
              <Button onClick={handleSaveNoindex} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Sitemap Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Generation</CardTitle>
              <CardDescription>
                Generate XML sitemaps for Google Search Console. Two separate files will be created:
                one for content pages (cities, counties, blog) and one for property listings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lastGenerated && (
                <div className="text-sm text-muted-foreground">
                  Last generated: {new Date(lastGenerated).toLocaleString()}
                </div>
              )}
              <div className="flex gap-4">
                <Button onClick={generateSitemaps} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate Sitemaps
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-medium text-sm">What gets generated:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li><strong>sitemap-content.xml</strong> - Homepage, cities, counties, blog posts, static pages</li>
                  <li><strong>sitemap-listings.xml</strong> - All active property listing pages</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Upload these files to Google Search Console to help Google discover your pages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
