import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarSection } from "@/types/sidebarSections";
import { Plus, Trash2 } from "lucide-react";

interface SidebarSectionEditorProps {
  section: SidebarSection;
  onSave: (section: SidebarSection) => void;
  onCancel: () => void;
}

export function SidebarSectionEditor({ section, onSave, onCancel }: SidebarSectionEditorProps) {
  const [formData, setFormData] = useState<any>(section);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as SidebarSection);
  };

  const renderTypeSpecificFields = () => {
    switch (section.type) {
      case "quick_links":
        return (
          <div className="space-y-4">
            <Label>Links</Label>
            {formData.links?.map((link, index) => (
              <div key={index} className="flex gap-2 p-3 bg-muted rounded">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...(formData.links || [])];
                      updated[index] = { ...link, label: e.target.value };
                      setFormData({ ...formData, links: updated });
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...(formData.links || [])];
                      updated[index] = { ...link, url: e.target.value };
                      setFormData({ ...formData, links: updated });
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`new-tab-${index}`}
                      checked={link.openInNewTab || false}
                      onCheckedChange={(checked) => {
                        const updated = [...(formData.links || [])];
                        updated[index] = { ...link, openInNewTab: checked as boolean };
                        setFormData({ ...formData, links: updated });
                      }}
                    />
                    <Label htmlFor={`new-tab-${index}`}>Open in new tab</Label>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const updated = formData.links?.filter((_, i) => i !== index);
                    setFormData({ ...formData, links: updated });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  ...formData,
                  links: [...(formData.links || []), { label: "", url: "" }]
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        );

      case "featured_properties":
      case "recent_listings":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="limit">Number of Properties</Label>
              <Input
                id="limit"
                type="number"
                value={formData.limit || 5}
                onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="displayType">Display Type</Label>
              <Select
                value={formData.displayType || "cards"}
                onValueChange={(value) => setFormData({ ...formData, displayType: value as "cards" | "list" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "neighborhoods":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="limit">Number of Neighborhoods</Label>
              <Input
                id="limit"
                type="number"
                value={formData.limit || 5}
                onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="showImages"
                checked={formData.showImages || false}
                onCheckedChange={(checked) => setFormData({ ...formData, showImages: checked as boolean })}
              />
              <Label htmlFor="showImages">Show Images</Label>
            </div>
          </div>
        );

      case "contact_form":
        return (
          <div className="space-y-4">
            <div>
              <Label>Form Fields</Label>
              {["name", "email", "phone", "message"].map((field) => (
                <div key={field} className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id={field}
                    checked={formData.fields?.includes(field as any) || false}
                    onCheckedChange={(checked) => {
                      const current = formData.fields || [];
                      const updated = checked
                        ? [...current, field as any]
                        : current.filter((f) => f !== field);
                      setFormData({ ...formData, fields: updated });
                    }}
                  />
                  <Label htmlFor={field} className="capitalize">{field}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="submitButtonText">Submit Button Text</Label>
              <Input
                id="submitButtonText"
                value={formData.submitButtonText || "Send Message"}
                onChange={(e) => setFormData({ ...formData, submitButtonText: e.target.value })}
              />
            </div>
          </div>
        );

      case "market_stats":
        return (
          <div className="space-y-4">
            <div>
              <Label>Statistics to Display</Label>
              {[
                { key: "median_price", label: "Median Price" },
                { key: "avg_days_on_market", label: "Avg Days on Market" },
                { key: "total_listings", label: "Total Listings" },
                { key: "sold_last_month", label: "Sold Last Month" }
              ].map((stat) => (
                <div key={stat.key} className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id={stat.key}
                    checked={formData.stats?.includes(stat.key as any) || false}
                    onCheckedChange={(checked) => {
                      const current = formData.stats || [];
                      const updated = checked
                        ? [...current, stat.key as any]
                        : current.filter((s) => s !== stat.key);
                      setFormData({ ...formData, stats: updated });
                    }}
                  />
                  <Label htmlFor={stat.key}>{stat.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case "custom_html":
        return (
          <div>
            <Label htmlFor="html">HTML Content</Label>
            <Textarea
              id="html"
              value={formData.html || ""}
              onChange={(e) => setFormData({ ...formData, html: e.target.value })}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sidebar Section</DialogTitle>
          <DialogDescription>
            Configure the sidebar section settings
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {renderTypeSpecificFields()}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Section</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
