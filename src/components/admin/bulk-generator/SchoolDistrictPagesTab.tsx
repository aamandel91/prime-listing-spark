import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useBulkPageGeneration } from "@/hooks/useBulkPageGeneration";
import { useToast } from "@/hooks/use-toast";

interface SchoolDistrictData {
  name: string;
  county: string;
}

export default function SchoolDistrictPagesTab() {
  const { generateContent, createBulkPages, isGenerating } = useBulkPageGeneration();
  const { toast } = useToast();
  const [districts, setDistricts] = useState<SchoolDistrictData[]>([{ name: "", county: "" }]);
  const [useAI, setUseAI] = useState(true);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);

  const addDistrict = () => {
    setDistricts([...districts, { name: "", county: "" }]);
  };

  const updateDistrict = (index: number, field: keyof SchoolDistrictData, value: string) => {
    const newDistricts = [...districts];
    newDistricts[index][field] = value;
    setDistricts(newDistricts);
  };

  const removeDistrict = (index: number) => {
    setDistricts(districts.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    const validDistricts = districts.filter(d => d.name.trim() && d.county.trim());
    
    if (validDistricts.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one school district with county",
        variant: "destructive",
      });
      return;
    }

    try {
      const pages = [];

      for (const district of validDistricts) {
        if (useAI) {
          const content = await generateContent({
            entityType: "school_district",
            entityName: `${district.name}`,
            entityData: {
              district: district.name,
              county: district.county,
              state: "FL",
            },
          });

          pages.push({
            title: content.title || `Homes in ${district.name}, ${district.county} County, FL`,
            slug: `schools-${district.name.toLowerCase().replace(/\s+/g, "-")}`,
            content: content.content || "",
            meta_title: content.metaTitle || `${district.name} School District Homes`,
            meta_description: content.metaDescription || `Find homes in ${district.name}, ${district.county} County, Florida`,
            api_filters: { county: district.county, state: "FL" },
            category: "school_district",
            page_type: "school_district",
          });
        } else {
          pages.push({
            title: `Homes in ${district.name}, ${district.county} County, FL`,
            slug: `schools-${district.name.toLowerCase().replace(/\s+/g, "-")}`,
            content: `<p>Browse homes for sale in ${district.name}, ${district.county} County, Florida.</p>`,
            meta_title: `${district.name} FL School District Real Estate`,
            meta_description: `Find homes in the ${district.name}, ${district.county} County, Florida.`,
            api_filters: { county: district.county, state: "FL" },
            category: "school_district",
            page_type: "school_district",
          });
        }
      }

      setGeneratedPages(pages);
      
      toast({
        title: "Success",
        description: `Generated ${pages.length} school district page(s)`,
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
    setDistricts([{ name: "", county: "" }]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>School Districts</Label>
          <Button onClick={addDistrict} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add District
          </Button>
        </div>

        <div className="space-y-3">
          {districts.map((district, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div>
                  <Label>District Name</Label>
                  <Input
                    placeholder="e.g., Miami-Dade County Public Schools"
                    value={district.name}
                    onChange={(e) => updateDistrict(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>County</Label>
                  <Input
                    placeholder="e.g., Miami-Dade, Broward"
                    value={district.county}
                    onChange={(e) => updateDistrict(index, "county", e.target.value)}
                  />
                </div>
                {districts.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => removeDistrict(index)}
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
            id="use-ai-district"
            checked={useAI}
            onCheckedChange={(checked) => setUseAI(checked as boolean)}
          />
          <Label htmlFor="use-ai-district" className="flex items-center gap-2">
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
