import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  county?: string;
  zipcode?: string;
}

export default function NeighborhoodPages() {
  const [loading, setLoading] = useState(true);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [template, setTemplate] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_neighborhoods")
        .select("*")
        .order("name");

      if (error) throw error;
      setNeighborhoods(data || []);
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
      toast({
        title: "Error",
        description: "Failed to fetch neighborhoods",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedNeighborhoods.length === neighborhoods.length) {
      setSelectedNeighborhoods([]);
    } else {
      setSelectedNeighborhoods(neighborhoods.map(n => n.id));
    }
  };

  const handleNeighborhoodToggle = (id: string) => {
    setSelectedNeighborhoods(prev =>
      prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
    );
  };

  const generateSeoContent = async () => {
    if (selectedNeighborhoods.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one neighborhood",
        variant: "destructive",
      });
      return;
    }

    setGeneratingSeo(true);
    try {
      const neighborhood = neighborhoods.find(n => n.id === selectedNeighborhoods[0]);
      if (!neighborhood) return;

      const { data, error } = await supabase.functions.invoke('generate-seo-content', {
        body: {
          keyword: `${neighborhood.name} ${neighborhood.city} real estate`,
          contentType: 'neighborhood_page',
          targetData: {
            neighborhood: neighborhood.name,
            city: neighborhood.city,
            state: neighborhood.state,
          }
        }
      });

      if (error) throw error;

      setTemplate({
        title: data.content.title || `${neighborhood.name} Homes for Sale in ${neighborhood.city}, ${neighborhood.state}`,
        description: data.content.metaDescription || `Discover beautiful homes in ${neighborhood.name}, ${neighborhood.city}. Browse listings and find your dream home today.`,
        content: data.content.content || `Explore the vibrant ${neighborhood.name} neighborhood in ${neighborhood.city}, ${neighborhood.state}.`,
      });

      toast({
        title: "Success",
        description: "SEO content generated successfully",
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
    if (selectedNeighborhoods.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one neighborhood",
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

      for (const neighborhoodId of selectedNeighborhoods) {
        const neighborhood = neighborhoods.find(n => n.id === neighborhoodId);
        if (!neighborhood) continue;

        const pageData = {
          neighborhood_slug: neighborhood.slug,
          title: template.title
            .replace(/{neighborhood}/g, neighborhood.name)
            .replace(/{city}/g, neighborhood.city)
            .replace(/{state}/g, neighborhood.state),
          description: template.description
            .replace(/{neighborhood}/g, neighborhood.name)
            .replace(/{city}/g, neighborhood.city)
            .replace(/{state}/g, neighborhood.state),
          content: template.content
            .replace(/{neighborhood}/g, neighborhood.name)
            .replace(/{city}/g, neighborhood.city)
            .replace(/{state}/g, neighborhood.state),
          url_path: `/neighborhood/${neighborhood.slug}`,
        };

        const { error } = await supabase
          .from("pages")
          .upsert({
            page_key: `neighborhood_${neighborhood.slug}`,
            title: pageData.title,
            content: {
              ...pageData,
              neighborhood: neighborhood.name,
              city: neighborhood.city,
              state: neighborhood.state,
            }
          }, {
            onConflict: 'page_key'
          });

        if (error) throw error;
        totalPages++;
      }

      toast({
        title: "Success",
        description: `Created ${totalPages} neighborhood pages`,
      });

      setSelectedNeighborhoods([]);
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
          <h1 className="text-3xl font-bold">Neighborhood Pages Generator</h1>
          <p className="text-muted-foreground mt-2">
            Create SEO-optimized pages for neighborhoods with AI
          </p>
        </div>

        <div className="grid gap-6 max-w-5xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Neighborhoods</CardTitle>
                  <CardDescription>Choose neighborhoods to generate pages for</CardDescription>
                </div>
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectedNeighborhoods.length === neighborhoods.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {neighborhoods.map(neighborhood => (
                  <div key={neighborhood.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={neighborhood.id}
                      checked={selectedNeighborhoods.includes(neighborhood.id)}
                      onCheckedChange={() => handleNeighborhoodToggle(neighborhood.id)}
                    />
                    <Label htmlFor={neighborhood.id} className="cursor-pointer">
                      {neighborhood.name} ({neighborhood.city})
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Page Template</CardTitle>
                  <CardDescription>
                    Use {"{neighborhood}"}, {"{city}"}, and {"{state}"} as placeholders
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={generateSeoContent}
                  disabled={generatingSeo || selectedNeighborhoods.length === 0}
                >
                  {generatingSeo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
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
                  placeholder="e.g. {neighborhood} Homes for Sale in {city}, {state}"
                />
              </div>
              <div>
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={template.description}
                  onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Discover beautiful homes in {neighborhood}, {city}..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="content">Page Content</Label>
                <Textarea
                  id="content"
                  value={template.content}
                  onChange={(e) => setTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="e.g. Explore the vibrant {neighborhood} neighborhood..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={generatePages}
                disabled={generating || selectedNeighborhoods.length === 0}
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
                    Generate {selectedNeighborhoods.length} Page{selectedNeighborhoods.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
