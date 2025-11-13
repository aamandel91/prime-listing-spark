import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useBulkPageGeneration } from "@/hooks/useBulkPageGeneration";
import { useToast } from "@/hooks/use-toast";

export default function CityPagesTab() {
  const { generateContent, createBulkPages, isGenerating } = useBulkPageGeneration();
  const { toast } = useToast();
  const [cities, setCities] = useState<string[]>([""]);
  const [useAI, setUseAI] = useState(true);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);

  const addCity = () => {
    setCities([...cities, ""]);
  };

  const updateCity = (index: number, value: string) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
  };

  const removeCity = (index: number) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    const validCities = cities.filter(city => city.trim());
    
    if (validCities.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one city name",
        variant: "destructive",
      });
      return;
    }

    try {
      const pages = [];

      for (const city of validCities) {
        if (useAI) {
          const content = await generateContent({
            entityType: "city",
            entityName: city,
            entityData: {
              city: city,
              state: "FL",
            },
          });

          pages.push({
            title: content.title || `${city}, FL Real Estate`,
            slug: city.toLowerCase().replace(/\s+/g, "-"),
            content: content.content || "",
            meta_title: content.metaTitle || `${city}, FL Homes for Sale`,
            meta_description: content.metaDescription || `Find homes for sale in ${city}, Florida`,
            api_filters: { city: city, state: "FL" },
            category: "city",
            page_type: "city",
          });
        } else {
          pages.push({
            title: `${city}, FL Real Estate`,
            slug: city.toLowerCase().replace(/\s+/g, "-"),
            content: `<p>Browse homes for sale in ${city}, Florida.</p>`,
            meta_title: `${city}, FL Homes for Sale`,
            meta_description: `Find your dream home in ${city}, Florida. Browse the latest listings.`,
            api_filters: { city: city, state: "FL" },
            category: "city",
            page_type: "city",
          });
        }
      }

      setGeneratedPages(pages);
      
      toast({
        title: "Success",
        description: `Generated ${pages.length} city page(s)`,
      });
    } catch (error) {
      console.error("Generation error:", error);
    }
  };

  const handleCreatePages = async () => {
    if (generatedPages.length === 0) {
      toast({
        title: "Error",
        description: "No pages to create. Generate pages first.",
        variant: "destructive",
      });
      return;
    }

    await createBulkPages(generatedPages);
    setGeneratedPages([]);
    setCities([""]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>City Names</Label>
          <Button onClick={addCity} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add City
          </Button>
        </div>

        <div className="space-y-2">
          {cities.map((city, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="e.g., Miami, Orlando, Tampa"
                value={city}
                onChange={(e) => updateCity(index, e.target.value)}
              />
              {cities.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => removeCity(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-ai"
            checked={useAI}
            onCheckedChange={(checked) => setUseAI(checked as boolean)}
          />
          <Label htmlFor="use-ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Use AI to generate SEO-optimized content
          </Label>
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Pages
            </>
          )}
        </Button>
      </div>

      {generatedPages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Pages Preview</h3>
          <div className="space-y-3">
            {generatedPages.map((page, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Title:</span>
                    <p className="text-sm text-muted-foreground">{page.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Slug:</span>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Meta Description:</span>
                    <p className="text-sm text-muted-foreground">{page.meta_description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button onClick={handleCreatePages} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Pages...
              </>
            ) : (
              `Create ${generatedPages.length} Page(s)`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
