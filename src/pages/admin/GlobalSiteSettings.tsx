import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
}

export default function GlobalSiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("global_site_settings")
        .select("*");

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((setting: SiteSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value || '';
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch site settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("global_site_settings")
          .update({ setting_value: update.setting_value })
          .eq("setting_key", update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Site settings saved successfully",
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
          <h1 className="text-3xl font-bold">Global Site Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage tracking codes, analytics, and access control settings
          </p>
        </div>

        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tracking">Tracking & Analytics</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-6">
            {/* Google Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Google Analytics</CardTitle>
                <CardDescription>
                  Add your Google Analytics Measurement ID (starts with G-)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google_analytics_id">Measurement ID</Label>
                  <Input
                    id="google_analytics_id"
                    placeholder="G-XXXXXXXXXX"
                    value={settings.google_analytics_id || ''}
                    onChange={(e) => updateSetting('google_analytics_id', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Google Tag Manager */}
            <Card>
              <CardHeader>
                <CardTitle>Google Tag Manager</CardTitle>
                <CardDescription>
                  Add your Google Tag Manager Container ID (starts with GTM-)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google_tag_manager_id">Container ID</Label>
                  <Input
                    id="google_tag_manager_id"
                    placeholder="GTM-XXXXXXX"
                    value={settings.google_tag_manager_id || ''}
                    onChange={(e) => updateSetting('google_tag_manager_id', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Google Ads Conversion ID */}
            <Card>
              <CardHeader>
                <CardTitle>Google Ads Conversion Tracking</CardTitle>
                <CardDescription>
                  Add your Google Ads Conversion ID for enhanced conversions (starts with AW-)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google_ads_conversion_id">Conversion ID</Label>
                  <Input
                    id="google_ads_conversion_id"
                    placeholder="AW-123456789"
                    value={settings.google_ads_conversion_id || ''}
                    onChange={(e) => updateSetting('google_ads_conversion_id', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Used for enhanced conversions with hashed user data
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Google Ads Remarketing */}
            <Card>
              <CardHeader>
                <CardTitle>Google Ads Dynamic Remarketing</CardTitle>
                <CardDescription>
                  Configure dynamic remarketing for property listings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google_ads_remarketing_id">Remarketing Tag ID</Label>
                  <Input
                    id="google_ads_remarketing_id"
                    placeholder="AW-123456789"
                    value={settings.google_ads_remarketing_id || ''}
                    onChange={(e) => updateSetting('google_ads_remarketing_id', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    For dynamic property remarketing campaigns
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Facebook Pixel */}
            <Card>
              <CardHeader>
                <CardTitle>Facebook/Meta Pixel</CardTitle>
                <CardDescription>
                  Add your Facebook Pixel ID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook_pixel_id">Pixel ID</Label>
                  <Input
                    id="facebook_pixel_id"
                    placeholder="123456789012345"
                    value={settings.facebook_pixel_id || ''}
                    onChange={(e) => updateSetting('facebook_pixel_id', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Follow Up Boss Pixel */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Up Boss Pixel</CardTitle>
                <CardDescription>
                  Paste your complete Follow Up Boss tracking pixel code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="followup_boss_pixel">Pixel Code</Label>
                  <Textarea
                    id="followup_boss_pixel"
                    placeholder="<script>...</script>"
                    rows={6}
                    value={settings.followup_boss_pixel || ''}
                    onChange={(e) => updateSetting('followup_boss_pixel', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Custom Header Code */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Header Code</CardTitle>
                <CardDescription>
                  Add any additional custom code to be injected in the {"<head>"} section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="header_custom_code">Custom Code</Label>
                  <Textarea
                    id="header_custom_code"
                    placeholder="<script>...</script> or <link>..."
                    rows={10}
                    value={settings.header_custom_code || ''}
                    onChange={(e) => updateSetting('header_custom_code', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            {/* Force Registration for PPC */}
            <Card>
              <CardHeader>
                <CardTitle>PPC Traffic Registration</CardTitle>
                <CardDescription>
                  Control whether users from paid advertising must register before viewing property details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="force_registration_ppc">
                      Force Registration for PPC Traffic
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, users arriving from paid ads must sign up/login to view property details.
                      Organic traffic can view freely.
                    </p>
                  </div>
                  <Switch
                    id="force_registration_ppc"
                    checked={settings.force_registration_ppc === 'true'}
                    onCheckedChange={(checked) => 
                      updateSetting('force_registration_ppc', checked ? 'true' : 'false')
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="ppc_utm_sources">PPC UTM Sources</Label>
                  <Input
                    id="ppc_utm_sources"
                    placeholder="google,facebook,bing,linkedin,twitter"
                    value={settings.ppc_utm_sources || ''}
                    onChange={(e) => updateSetting('ppc_utm_sources', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Comma-separated list of UTM source values that identify PPC traffic.
                    URLs with these sources (e.g., ?utm_source=google) will trigger forced registration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
