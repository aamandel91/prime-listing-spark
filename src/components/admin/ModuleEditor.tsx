import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentPageModule } from "@/types/contentModules";
import { RichTextEditor } from "./RichTextEditor";
import { Plus, Trash2 } from "lucide-react";

interface ModuleEditorProps {
  module: ContentPageModule;
  onChange: (updates: Partial<ContentPageModule>) => void;
  onClose: () => void;
}

export function ModuleEditor({ module, onChange, onClose }: ModuleEditorProps) {
  const renderEditor = () => {
    switch (module.type) {
      case "content":
        return (
          <div className="space-y-4">
            <div>
              <Label>Content</Label>
              <RichTextEditor
                content={module.content || ""}
                onChange={(content) => onChange({ content })}
                placeholder="Enter your content..."
              />
            </div>
          </div>
        );

      case "saved_search_listings":
      case "saved_search_table":
        return (
          <div className="space-y-4">
            <div>
              <Label>Display Type</Label>
              <Select
                value={module.type === "saved_search_listings" ? module.displayType : undefined}
                onValueChange={(value) => onChange({ displayType: value as "grid" | "list" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Limit (number of listings)</Label>
              <Input
                type="number"
                value={module.limit || 12}
                onChange={(e) => onChange({ limit: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Saved Search ID (optional)</Label>
              <Input
                value={module.searchId || ""}
                onChange={(e) => onChange({ searchId: e.target.value })}
                placeholder="Leave empty to create inline criteria"
              />
            </div>
          </div>
        );

      case "statistics":
        return (
          <div className="space-y-4">
            <div>
              <Label>Statistics</Label>
              {module.stats.map((stat, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <Input
                    className="col-span-4"
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...module.stats];
                      newStats[index].label = e.target.value;
                      onChange({ stats: newStats });
                    }}
                  />
                  <Input
                    className="col-span-3"
                    placeholder="Value"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...module.stats];
                      newStats[index].value = e.target.value;
                      onChange({ stats: newStats });
                    }}
                  />
                  <Input
                    className="col-span-4"
                    placeholder="Description"
                    value={stat.description || ""}
                    onChange={(e) => {
                      const newStats = [...module.stats];
                      newStats[index].description = e.target.value;
                      onChange({ stats: newStats });
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="col-span-1"
                    onClick={() => {
                      const newStats = module.stats.filter((_, i) => i !== index);
                      onChange({ stats: newStats });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({
                    stats: [...module.stats, { label: "", value: "", description: "" }],
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </Button>
            </div>
          </div>
        );

      case "links":
        return (
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={module.label || ""}
                onChange={(e) => onChange({ label: e.target.value })}
                placeholder="Optional section label"
              />
            </div>
            <div>
              <Label>Links</Label>
              {module.links.map((link, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <Input
                    className="col-span-5"
                    placeholder="Link text"
                    value={link.text}
                    onChange={(e) => {
                      const newLinks = [...module.links];
                      newLinks[index].text = e.target.value;
                      onChange({ links: newLinks });
                    }}
                  />
                  <Input
                    className="col-span-6"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...module.links];
                      newLinks[index].url = e.target.value;
                      onChange({ links: newLinks });
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="col-span-1"
                    onClick={() => {
                      const newLinks = module.links.filter((_, i) => i !== index);
                      onChange({ links: newLinks });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({ links: [...module.links, { text: "", url: "" }] });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        );

      case "contact_form":
        return (
          <div className="space-y-4">
            <div>
              <Label>Submit Button Text</Label>
              <Input
                value={module.submitText || "Submit"}
                onChange={(e) => onChange({ submitText: e.target.value })}
              />
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-4">
            <div>
              <Label>Show Featured Only</Label>
              <Select
                value={module.featured ? "true" : "false"}
                onValueChange={(value) => onChange({ featured: value === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Featured Only</SelectItem>
                  <SelectItem value="false">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Limit</Label>
              <Input
                type="number"
                value={module.limit || 6}
                onChange={(e) => onChange({ limit: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case "blog_posts":
        return (
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Input
                value={module.category || ""}
                onChange={(e) => onChange({ category: e.target.value })}
                placeholder="Leave empty for all"
              />
            </div>
            <div>
              <Label>Limit</Label>
              <Input
                type="number"
                value={module.limit || 6}
                onChange={(e) => onChange({ limit: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case "videos_grid":
        return (
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Input
                value={module.category || ""}
                onChange={(e) => onChange({ category: e.target.value })}
                placeholder="Leave empty for all"
              />
            </div>
            <div>
              <Label>Show Featured Only</Label>
              <Select
                value={module.featured ? "true" : "false"}
                onValueChange={(value) => onChange({ featured: value === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Featured Only</SelectItem>
                  <SelectItem value="false">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Limit</Label>
              <Input
                type="number"
                value={module.limit || 6}
                onChange={(e) => onChange({ limit: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case "single_video":
        return (
          <div className="space-y-4">
            <div>
              <Label>Video ID (from videos table)</Label>
              <Input
                value={module.videoId || ""}
                onChange={(e) => onChange({ videoId: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Or Video URL</Label>
              <Input
                value={module.videoUrl || ""}
                onChange={(e) => onChange({ videoUrl: e.target.value })}
                placeholder="Direct video URL"
              />
            </div>
          </div>
        );

      case "contact_details":
        return (
          <div className="space-y-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={module.phone || ""}
                onChange={(e) => onChange({ phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={module.email || ""}
                onChange={(e) => onChange({ email: e.target.value })}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={module.address || ""}
                onChange={(e) => onChange({ address: e.target.value })}
              />
            </div>
          </div>
        );

      case "team_members":
        return (
          <div className="space-y-4">
            <div>
              <Label>Show Featured Only</Label>
              <Select
                value={module.featured ? "true" : "false"}
                onValueChange={(value) => onChange({ featured: value === "true" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Featured Only</SelectItem>
                  <SelectItem value="false">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Limit</Label>
              <Input
                type="number"
                value={module.limit || 12}
                onChange={(e) => onChange({ limit: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            This module type doesn't require additional configuration.
          </div>
        );
    }
  };

  return (
    <div className="border rounded-lg p-4 mt-4 space-y-4 bg-muted/50">
      <div>
        <Label>Module Title (optional)</Label>
        <Input
          value={module.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Featured Properties, Contact Us"
        />
      </div>

      {renderEditor()}

      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Done Editing
        </Button>
      </div>
    </div>
  );
}
