import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface City {
  id: string;
  city_name: string;
  slug: string;
  state: string;
}

interface PropertyTypePage {
  id: string;
  city_slug: string;
  property_type: string;
  title: string;
  description: string;
  content: string;
  url_path: string;
}

const PROPERTY_TYPES = [
  { value: "single-family", label: "Single Family Homes", searchType: "Single Family" },
  { value: "townhouse", label: "Townhomes", searchType: "Townhouse" },
  { value: "condo", label: "Condos", searchType: "Condo" },
  { value: "multi-family", label: "Multi Family Homes", searchType: "Multi Family" },
  { value: "luxury", label: "Luxury Homes", searchType: "Luxury" },
  { value: "new-construction", label: "New Construction", searchType: "New Construction" },
];

export default function PropertyTypePages() {
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [template, setTemplate] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [editingPage, setEditingPage] = useState<PropertyTypePage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      // Fetch cities from Repliers API
      const { data, error } = await supabase.functions.invoke(
        "repliers-proxy",
        {
          body: {
            endpoint: "/locations",
            params: {
              type: "city",
              state: "FL",
            },
          },
        }
      );

      if (error) throw error;

      // Map API response to City format
      const cityList = (data?.locations || [])
        .map((loc: any) => ({
          id: loc.id || loc.name,
          city_name: loc.name,
          slug: loc.name.toLowerCase().replace(/\s+/g, '-'),
          state: loc.state || "FL",
        }))
        .sort((a: any, b: any) => a.city_name.localeCompare(b.city_name));

      setCities(cityList);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cities from API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedCities.length === cities.length) {
      setSelectedCities([]);
    } else {
      setSelectedCities(cities.map(c => c.id));
    }
  };

  const handleCityToggle = (cityId: string) => {
    setSelectedCities(prev =>
      prev.includes(cityId)
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };

  const handlePropertyTypeToggle = (typeValue: string) => {
    setSelectedPropertyTypes(prev =>
      prev.includes(typeValue)
        ? prev.filter(val => val !== typeValue)
        : [...prev, typeValue]
    );
  };

  const handleSelectAllPropertyTypes = () => {
    if (selectedPropertyTypes.length === PROPERTY_TYPES.length) {
      setSelectedPropertyTypes([]);
    } else {
      setSelectedPropertyTypes(PROPERTY_TYPES.map(t => t.value));
    }
  };

  const generateSeoContent = async () => {
    if (selectedPropertyTypes.length === 0 || selectedCities.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one property type and city",
        variant: "destructive",
      });
      return;
    }

    setGeneratingSeo(true);
    try {
      const selectedCity = cities.find(c => c.id === selectedCities[0]);
      if (!selectedCity) return;

      const propertyTypeInfo = PROPERTY_TYPES.find(pt => pt.value === selectedPropertyTypes[0]);
      
      // Use Firecrawl to scrape competitor data
      const { data, error } = await supabase.functions.invoke('analyze-competitor-seo', {
        body: {
          city: selectedCity.city_name,
          state: selectedCity.state,
          propertyType: propertyTypeInfo?.label || selectedPropertyTypes[0],
        }
      });

      if (error) throw error;

      // Update template with suggested content
      setTemplate({
        title: data.suggestedTitle || `${propertyTypeInfo?.label} in ${selectedCity.city_name}, ${selectedCity.state}`,
        description: data.suggestedDescription || `Find the best ${propertyTypeInfo?.label.toLowerCase()} in ${selectedCity.city_name}. Browse luxury homes for sale.`,
        content: data.suggestedContent || `Explore beautiful ${propertyTypeInfo?.label.toLowerCase()} in ${selectedCity.city_name}, ${selectedCity.state}. Our expert agents can help you find your dream home.`,
      });

      toast({
        title: "Success",
        description: "SEO content suggestions generated",
      });
    } catch (error) {
      console.error("Error generating SEO:", error);
      toast({
        title: "Info",
        description: "Using default template. You can customize it before generating pages.",
      });
    } finally {
      setGeneratingSeo(false);
    }
  };

  const generatePages = async () => {
    if (selectedPropertyTypes.length === 0 || selectedCities.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one property type and city",
        variant: "destructive",
      });
      return;
    }

    if (!template.title || !template.description) {
      toast({
        title: "Error",
        description: "Please fill in the title and description template",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      let totalPages = 0;
      
      for (const propertyType of selectedPropertyTypes) {
        const propertyTypeInfo = PROPERTY_TYPES.find(pt => pt.value === propertyType);
        
        for (const cityId of selectedCities) {
          const city = cities.find(c => c.id === cityId);
          if (!city) continue;

          const pageData = {
            city_slug: city.slug,
            property_type: propertyType,
            title: template.title
              .replace(/{city}/g, city.city_name)
              .replace(/{state}/g, city.state)
              .replace(/{propertyType}/g, propertyTypeInfo?.label || propertyType),
            description: template.description
              .replace(/{city}/g, city.city_name)
              .replace(/{state}/g, city.state)
              .replace(/{propertyType}/g, propertyTypeInfo?.label || propertyType),
            content: template.content
              .replace(/{city}/g, city.city_name)
              .replace(/{state}/g, city.state)
              .replace(/{propertyType}/g, propertyTypeInfo?.label || propertyType),
            url_path: `/${city.slug}/${propertyType}`,
          };

          // Store in pages table
          const { error } = await supabase
            .from("pages")
            .upsert({
              page_key: `city_property_type_${city.slug}_${propertyType}`,
              title: pageData.title,
              content: {
                ...pageData,
                property_type_filter: propertyTypeInfo?.searchType,
              }
            }, {
              onConflict: 'page_key'
            });

          if (error) throw error;
          totalPages++;
        }
      }

      toast({
        title: "Success",
        description: `Created ${totalPages} property type pages`,
      });

      setSelectedCities([]);
      setSelectedPropertyTypes([]);
      setTemplate({ title: "", description: "", content: "" });
    } catch (error) {
      console.error("Error generating pages:", error);
      toast({
        title: "Error",
        description: "Failed to generate pages",
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
          <h1 className="text-3xl font-bold">Property Type Pages</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage property type pages for each city
          </p>
        </div>

        <div className="grid gap-6 max-w-5xl">
          {/* Property Type Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Property Types</CardTitle>
                  <CardDescription>
                    Choose which property type pages to create (multiple allowed)
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleSelectAllPropertyTypes}>
                  {selectedPropertyTypes.length === PROPERTY_TYPES.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PROPERTY_TYPES.map(type => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={selectedPropertyTypes.includes(type.value)}
                      onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                    />
                    <Label htmlFor={type.value} className="cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* City Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Cities</CardTitle>
                  <CardDescription>
                    Choose which cities to generate pages for
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectedCities.length === cities.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cities.map(city => (
                  <div key={city.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={city.id}
                      checked={selectedCities.includes(city.id)}
                      onCheckedChange={() => handleCityToggle(city.id)}
                    />
                    <Label htmlFor={city.id} className="cursor-pointer">
                      {city.city_name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Page Template</CardTitle>
                  <CardDescription>
                    Use {"{city}"} and {"{state}"} as placeholders
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={generateSeoContent}
                  disabled={generatingSeo || selectedPropertyTypes.length === 0 || selectedCities.length === 0}
                >
                  {generatingSeo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate SEO Suggestions
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={template.title}
                  onChange={(e) => setTemplate(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. {city} {state} {propertyType} for Sale"
                />
              </div>
              <div>
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={template.description}
                  onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Find beautiful single family homes in {city}, {state}. Browse listings..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="content">Page Content</Label>
                <Textarea
                  id="content"
                  value={template.content}
                  onChange={(e) => setTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="e.g. Explore {city}'s finest single family homes..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={generatePages}
                disabled={generating || selectedPropertyTypes.length === 0 || selectedCities.length === 0}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Pages...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate {selectedPropertyTypes.length * selectedCities.length} Page{selectedPropertyTypes.length * selectedCities.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Pages will be created at: /{"{city-slug}"}/{"{property-type}"}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
