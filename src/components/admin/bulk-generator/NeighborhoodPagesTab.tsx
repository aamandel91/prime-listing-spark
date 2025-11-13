import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useBulkPageGeneration } from "@/hooks/useBulkPageGeneration";
import { useToast } from "@/hooks/use-toast";

interface NeighborhoodData {
  name: string;
  city: string;
}

export default function NeighborhoodPagesTab() {
  const { generateContent, createBulkPages, isGenerating } = useBulkPageGeneration();
  const { toast } = useToast();
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodData[]>([{ name: "", city: "" }]);
  const [useAI, setUseAI] = useState(true);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);

  const addNeighborhood = () => {
    setNeighborhoods([...neighborhoods, { name: "", city: "" }]);
  };

  const updateNeighborhood = (index: number, field: keyof NeighborhoodData, value: string) => {
    const newNeighborhoods = [...neighborhoods];
    newNeighborhoods[index][field] = value;
    setNeighborhoods(newNeighborhoods);
  };

  const removeNeighborhood = (index: number) => {
    setNeighborhoods(neighborhoods.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    const validNeighborhoods = neighborhoods.filter(n => n.name.trim() && n.city.trim());
    
    if (validNeighborhoods.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one neighborhood with city",
        variant: "destructive",
      });
      return;
    }

    try {
      const pages = [];

      for (const neighborhood of validNeighborhoods) {
        if (useAI) {
          const content = await generateContent({
            entityType: "neighborhood",
            entityName: `${neighborhood.name}, ${neighborhood.city}`,
            entityData: {
              neighborhood: neighborhood.name,
              city: neighborhood.city,
              state: "FL",
            },
          });

          pages.push({
            title: content.title || `${neighborhood.name} Real Estate, ${neighborhood.city} FL`,
            slug: `${neighborhood.city.toLowerCase().replace(/\s+/g, "-")}-${neighborhood.name.toLowerCase().replace(/\s+/g, "-")}`,
            content: content.content || "",
            meta_title: content.metaTitle || `${neighborhood.name} Homes for Sale in ${neighborhood.city}, FL`,
            meta_description: content.metaDescription || `Find homes in ${neighborhood.name}, ${neighborhood.city}, Florida`,
            api_filters: { neighborhood: neighborhood.name, city: neighborhood.city, state: "FL" },
            category: "neighborhood",
            page_type: "neighborhood",
          });
        } else {
          pages.push({
            title: `${neighborhood.name} Real Estate, ${neighborhood.city} FL`,
            slug: `${neighborhood.city.toLowerCase().replace(/\s+/g, "-")}-${neighborhood.name.toLowerCase().replace(/\s+/g, "-")}`,
            content: `<p>Browse homes for sale in ${neighborhood.name}, ${neighborhood.city}, Florida.</p>`,
            meta_title: `${neighborhood.name} ${neighborhood.city} FL Homes for Sale`,
            meta_description: `Find your dream home in ${neighborhood.name}, ${neighborhood.city}, Florida.`,
            api_filters: { neighborhood: neighborhood.name, city: neighborhood.city, state: "FL" },
            category: "neighborhood",
            page_type: "neighborhood",
          });
        }
      }

      setGeneratedPages(pages);
      
      toast({
        title: "Success",
        description: `Generated ${pages.length} neighborhood page(s)`,
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
    setNeighborhoods([{ name: "", city: "" }]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Neighborhoods</Label>
          <Button onClick={addNeighborhood} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Neighborhood
          </Button>
        </div>

        <div className="space-y-3">
          {neighborhoods.map((neighborhood, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div>
                  <Label>Neighborhood Name</Label>
                  <Input
                    placeholder="e.g., South Beach, Downtown"
                    value={neighborhood.name}
                    onChange={(e) => updateNeighborhood(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    placeholder="e.g., Miami, Orlando"
                    value={neighborhood.city}
                    onChange={(e) => updateNeighborhood(index, "city", e.target.value)}
                  />
                </div>
                {neighborhoods.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => removeNeighborhood(index)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-ai-neighborhood"
            checked={useAI}
            onCheckedChange={(checked) => setUseAI(checked as boolean)}
          />
          <Label htmlFor="use-ai-neighborhood" className="flex items-center gap-2">
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
