import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useBulkPageGeneration } from "@/hooks/useBulkPageGeneration";
import { useToast } from "@/hooks/use-toast";

export default function ZipCodePagesTab() {
  const { generateContent, createBulkPages, isGenerating } = useBulkPageGeneration();
  const { toast } = useToast();
  const [zipcodes, setZipcodes] = useState<string[]>([""]);
  const [useAI, setUseAI] = useState(true);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);

  const addZipcode = () => {
    setZipcodes([...zipcodes, ""]);
  };

  const updateZipcode = (index: number, value: string) => {
    const newZipcodes = [...zipcodes];
    newZipcodes[index] = value;
    setZipcodes(newZipcodes);
  };

  const removeZipcode = (index: number) => {
    setZipcodes(zipcodes.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    const validZipcodes = zipcodes.filter(zip => zip.trim());
    
    if (validZipcodes.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one ZIP code",
        variant: "destructive",
      });
      return;
    }

    try {
      const pages = [];

      for (const zip of validZipcodes) {
        if (useAI) {
          const content = await generateContent({
            entityType: "zip",
            entityName: `ZIP ${zip}`,
            entityData: {
              zip: zip,
              state: "FL",
            },
          });

          pages.push({
            title: content.title || `Homes for Sale in ${zip}`,
            slug: `zip-${zip}`,
            content: content.content || "",
            meta_title: content.metaTitle || `${zip} FL Real Estate`,
            meta_description: content.metaDescription || `Find homes for sale in ${zip}, Florida`,
            api_filters: { zip: zip, state: "FL" },
            category: "zipcode",
            page_type: "zipcode",
          });
        } else {
          pages.push({
            title: `Homes for Sale in ${zip}`,
            slug: `zip-${zip}`,
            content: `<p>Browse homes for sale in ${zip}, Florida.</p>`,
            meta_title: `${zip} FL Real Estate & Homes for Sale`,
            meta_description: `Find your dream home in ${zip}, Florida. Browse the latest listings.`,
            api_filters: { zip: zip, state: "FL" },
            category: "zipcode",
            page_type: "zipcode",
          });
        }
      }

      setGeneratedPages(pages);
      
      toast({
        title: "Success",
        description: `Generated ${pages.length} ZIP code page(s)`,
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
    setZipcodes([""]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>ZIP Codes</Label>
          <Button onClick={addZipcode} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add ZIP Code
          </Button>
        </div>

        <div className="space-y-2">
          {zipcodes.map((zip, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="e.g., 33139, 32801, 33606"
                value={zip}
                onChange={(e) => updateZipcode(index, e.target.value)}
              />
              {zipcodes.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => removeZipcode(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-ai-zip"
            checked={useAI}
            onCheckedChange={(checked) => setUseAI(checked as boolean)}
          />
          <Label htmlFor="use-ai-zip" className="flex items-center gap-2">
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
