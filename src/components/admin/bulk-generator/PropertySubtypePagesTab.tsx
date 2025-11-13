import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import { usePropertySubtypes } from "@/hooks/usePropertySubtypes";
import { useBulkPageGeneration } from "@/hooks/useBulkPageGeneration";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function PropertySubtypePagesTab() {
  const { data: subtypes, isLoading } = usePropertySubtypes();
  const { createBulkPages, isGenerating } = useBulkPageGeneration();
  const { toast } = useToast();
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);

  const toggleSubtype = (id: string) => {
    setSelectedSubtypes(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleGeneratePages = async () => {
    if (selectedSubtypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one property subtype",
        variant: "destructive",
      });
      return;
    }

    const selectedData = subtypes?.filter(s => selectedSubtypes.includes(s.id));
    if (!selectedData) return;

    const pages = selectedData.map(subtype => ({
      title: subtype.meta_title || `${subtype.name} in Florida`,
      slug: subtype.slug,
      content: subtype.description ? `<p>${subtype.description}</p>` : `<p>Browse ${subtype.name.toLowerCase()} in Florida.</p>`,
      meta_title: subtype.meta_title || `${subtype.name} for Sale in Florida`,
      meta_description: subtype.meta_description || `Find ${subtype.name.toLowerCase()} throughout Florida`,
      api_filters: subtype.api_filters,
      category: "property_subtype",
      page_type: "property_subtype",
    }));

    await createBulkPages(pages);
    setSelectedSubtypes([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Select property subtypes to generate landing pages for
        </p>
        <Button
          onClick={handleGeneratePages}
          disabled={isGenerating || selectedSubtypes.length === 0}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            `Create ${selectedSubtypes.length} Page(s)`
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {subtypes?.map((subtype) => (
          <Card
            key={subtype.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedSubtypes.includes(subtype.id)
                ? "border-primary bg-accent"
                : "hover:border-primary/50"
            }`}
            onClick={() => toggleSubtype(subtype.id)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold">{subtype.name}</h3>
                {subtype.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subtype.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  Slug: /{subtype.slug}
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedSubtypes.includes(subtype.id)}
                onChange={() => toggleSubtype(subtype.id)}
                className="mt-1"
              />
            </div>
          </Card>
        ))}
      </div>

      {(!subtypes || subtypes.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          No property subtypes found. Some default subtypes were added during setup.
        </div>
      )}
    </div>
  );
}
