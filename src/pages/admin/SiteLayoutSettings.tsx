import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

const SiteLayoutSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Contact Information
  const [siteOwner, setSiteOwner] = useState("");
  const [siteName, setSiteName] = useState("");
  const [agentFirstName, setAgentFirstName] = useState("");
  const [agentLastName, setAgentLastName] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [agentBoardId, setAgentBoardId] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [officeIds, setOfficeIds] = useState("");
  const [emailGeneral, setEmailGeneral] = useState("");
  const [emailLegal, setEmailLegal] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [localNumber, setLocalNumber] = useState("");
  const [tollFree, setTollFree] = useState("");
  const [faxNumber, setFaxNumber] = useState("");

  // Business Address
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("FL");
  const [zipCode, setZipCode] = useState("");

  // Logo and Favicon
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("global_site_settings")
        .select("*");

      if (error) throw error;

      if (data) {
        data.forEach((setting) => {
          switch (setting.setting_key) {
            case "site_owner":
              setSiteOwner(setting.setting_value || "");
              break;
            case "site_name":
              setSiteName(setting.setting_value || "");
              break;
            case "agent_first_name":
              setAgentFirstName(setting.setting_value || "");
              break;
            case "agent_last_name":
              setAgentLastName(setting.setting_value || "");
              break;
            case "office_name":
              setOfficeName(setting.setting_value || "");
              break;
            case "agent_board_id":
              setAgentBoardId(setting.setting_value || "");
              break;
            case "license_number":
              setLicenseNumber(setting.setting_value || "");
              break;
            case "office_ids":
              setOfficeIds(setting.setting_value || "");
              break;
            case "email_general":
              setEmailGeneral(setting.setting_value || "");
              break;
            case "email_legal":
              setEmailLegal(setting.setting_value || "");
              break;
            case "mobile_number":
              setMobileNumber(setting.setting_value || "");
              break;
            case "local_number":
              setLocalNumber(setting.setting_value || "");
              break;
            case "toll_free":
              setTollFree(setting.setting_value || "");
              break;
            case "fax_number":
              setFaxNumber(setting.setting_value || "");
              break;
            case "street_1":
              setStreet1(setting.setting_value || "");
              break;
            case "street_2":
              setStreet2(setting.setting_value || "");
              break;
            case "city":
              setCity(setting.setting_value || "");
              break;
            case "state":
              setState(setting.setting_value || "FL");
              break;
            case "zip_code":
              setZipCode(setting.setting_value || "");
              break;
            case "logo_url":
              setLogoUrl(setting.setting_value || "");
              break;
            case "favicon_url":
              setFaviconUrl(setting.setting_value || "");
              break;
          }
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const settings = [
        { key: "site_owner", value: siteOwner },
        { key: "site_name", value: siteName },
        { key: "agent_first_name", value: agentFirstName },
        { key: "agent_last_name", value: agentLastName },
        { key: "office_name", value: officeName },
        { key: "agent_board_id", value: agentBoardId },
        { key: "license_number", value: licenseNumber },
        { key: "office_ids", value: officeIds },
        { key: "email_general", value: emailGeneral },
        { key: "email_legal", value: emailLegal },
        { key: "mobile_number", value: mobileNumber },
        { key: "local_number", value: localNumber },
        { key: "toll_free", value: tollFree },
        { key: "fax_number", value: faxNumber },
        { key: "street_1", value: street1 },
        { key: "street_2", value: street2 },
        { key: "city", value: city },
        { key: "state", value: state },
        { key: "zip_code", value: zipCode },
        { key: "logo_url", value: logoUrl },
        { key: "favicon_url", value: faviconUrl },
      ];

      for (const setting of settings) {
        const { error } = await supabase
          .from("global_site_settings")
          .upsert({
            setting_key: setting.key,
            setting_value: setting.value,
            setting_type: "text",
          }, {
            onConflict: "setting_key"
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
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
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Site Layout Settings | Admin</title>
      </Helmet>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Site Layout Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your site's contact information, branding, and layout settings
              </p>
            </div>
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Please note that all changes made to this form will affect the functioning of your site and delivery of your leads.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteOwner">Site Owner*</Label>
                  <Input
                    id="siteOwner"
                    value={siteOwner}
                    onChange={(e) => setSiteOwner(e.target.value)}
                    placeholder="Florida Home Finder"
                  />
                </div>
                <div>
                  <Label htmlFor="siteName">Site Name*</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="FloridaHomeFinder.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agentFirstName">Agent (or Contact) First Name*</Label>
                    <Input
                      id="agentFirstName"
                      value={agentFirstName}
                      onChange={(e) => setAgentFirstName(e.target.value)}
                      placeholder="Andy"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentLastName">Agent (or Contact) Last Name*</Label>
                    <Input
                      id="agentLastName"
                      value={agentLastName}
                      onChange={(e) => setAgentLastName(e.target.value)}
                      placeholder="Mandel"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="officeName">Office Name*</Label>
                  <Input
                    id="officeName"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    placeholder="eXp Realty"
                  />
                </div>
                <div>
                  <Label htmlFor="agentBoardId">Agent / Board ID: (comma separated)</Label>
                  <Input
                    id="agentBoardId"
                    value={agentBoardId}
                    onChange={(e) => setAgentBoardId(e.target.value)}
                    placeholder="3284048"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseNumber">License or BRE Number:</Label>
                  <Input
                    id="licenseNumber"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. CalBRE #12345"
                  />
                </div>
                <div>
                  <Label htmlFor="officeIds">Office ID: (comma separated)</Label>
                  <Input
                    id="officeIds"
                    value={officeIds}
                    onChange={(e) => setOfficeIds(e.target.value)}
                    placeholder="276802700"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Listings with these office IDs will show first with a "Hot Property" banner
                  </p>
                </div>
                <div>
                  <Label htmlFor="emailGeneral">Email Address (General):*</Label>
                  <Input
                    id="emailGeneral"
                    type="email"
                    value={emailGeneral}
                    onChange={(e) => setEmailGeneral(e.target.value)}
                    placeholder="andy@mandelteam.com"
                  />
                </div>
                <div>
                  <Label htmlFor="emailLegal">Email Address (Legal):*</Label>
                  <Input
                    id="emailLegal"
                    type="email"
                    value={emailLegal}
                    onChange={(e) => setEmailLegal(e.target.value)}
                    placeholder="andy@mandelteam.com"
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number:</Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="localNumber">Local Number:</Label>
                  <Input
                    id="localNumber"
                    type="tel"
                    value={localNumber}
                    onChange={(e) => setLocalNumber(e.target.value)}
                    placeholder="(954) 251-0694"
                  />
                </div>
                <div>
                  <Label htmlFor="tollFree">Toll Free:</Label>
                  <Input
                    id="tollFree"
                    type="tel"
                    value={tollFree}
                    onChange={(e) => setTollFree(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="faxNumber">Fax Number:</Label>
                  <Input
                    id="faxNumber"
                    type="tel"
                    value={faxNumber}
                    onChange={(e) => setFaxNumber(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Address */}
            <Card>
              <CardHeader>
                <CardTitle>Business Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street1">Street:*</Label>
                  <Input
                    id="street1"
                    value={street1}
                    onChange={(e) => setStreet1(e.target.value)}
                    placeholder="10101 W Sample Rd"
                  />
                </div>
                <div>
                  <Input
                    id="street2"
                    value={street2}
                    onChange={(e) => setStreet2(e.target.value)}
                    placeholder="Suite, Unit, etc. (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City:*</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Coral Springs"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State:*</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FL">Florida (FL)</SelectItem>
                      <SelectItem value="AL">Alabama (AL)</SelectItem>
                      <SelectItem value="AK">Alaska (AK)</SelectItem>
                      <SelectItem value="AZ">Arizona (AZ)</SelectItem>
                      <SelectItem value="AR">Arkansas (AR)</SelectItem>
                      <SelectItem value="CA">California (CA)</SelectItem>
                      <SelectItem value="TX">Texas (TX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip:*</Label>
                  <Input
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="33065"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>
                  This logo is currently used only in the squeeze page functionality and should be formatted on a white background (or transparent and formatted to look good against a white background). Replacing this logo will not update the primary or footer logo display on your main website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logoUrl && (
                  <div className="mb-4">
                    <Label>Current Logo</Label>
                    <div className="border rounded-lg p-4 bg-muted">
                      <img src={logoUrl} alt="Current logo" className="h-20 w-auto" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setLogoUrl("")}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
                <ImageUpload
                  onImageUploaded={setLogoUrl}
                  folder="logos"
                />
              </CardContent>
            </Card>

            {/* Favicon */}
            <Card>
              <CardHeader>
                <CardTitle>Favicon</CardTitle>
                <CardDescription>
                  The favicon is the small image that displays in the Internet browser tab (such as Chrome or Firefox) when someone is viewing your site. We strongly recommend that you use a square image, at least 260px wide X 260px tall for optimal results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {faviconUrl && (
                  <div className="mb-4">
                    <Label>Current Favicon</Label>
                    <div className="border rounded-lg p-4 bg-muted">
                      <img src={faviconUrl} alt="Current favicon" className="h-12 w-12" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFaviconUrl("")}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
                <ImageUpload
                  onImageUploaded={setFaviconUrl}
                  folder="logos"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This tool will automatically convert your image into PNG files supported by modern browsers. Additionally, an ICO file will be created for legacy browsers. File can be in any of the following formats: JPG, GIF, or PNG.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={saving} size="lg">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SiteLayoutSettings;
