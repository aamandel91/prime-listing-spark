import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GripVertical, Plus, Trash2, Edit2 } from "lucide-react";
import { SidebarSection, SidebarSectionType } from "@/types/sidebarSections";
import { SidebarSectionEditor } from "./SidebarSectionEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarBuilderProps {
  sections: SidebarSection[];
  onChange: (sections: SidebarSection[]) => void;
}

const sectionTypeLabels: Record<SidebarSectionType, string> = {
  quick_links: "Quick Links",
  featured_properties: "Featured Properties",
  neighborhoods: "Neighborhoods",
  contact_form: "Contact Form",
  market_stats: "Market Statistics",
  custom_html: "Custom HTML",
  search_widget: "Search Widget",
  recent_listings: "Recent Listings"
};

export function SidebarBuilder({ sections, onChange }: SidebarBuilderProps) {
  const [editingSection, setEditingSection] = useState<SidebarSection | null>(null);
  const [addingSectionType, setAddingSectionType] = useState<SidebarSectionType | "">("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reordered = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onChange(reordered);
  };

  const handleAddSection = () => {
    if (!addingSectionType) return;

    const newSection: any = {
      id: `section-${Date.now()}`,
      type: addingSectionType,
      title: sectionTypeLabels[addingSectionType],
      order: sections.length
    };

    // Set default values based on type
    switch (addingSectionType) {
      case "quick_links":
        newSection.links = [];
        break;
      case "featured_properties":
      case "recent_listings":
        newSection.limit = 5;
        newSection.displayType = "cards";
        break;
      case "neighborhoods":
        newSection.limit = 5;
        newSection.showImages = false;
        break;
      case "contact_form":
        newSection.fields = ["name", "email", "phone", "message"];
        newSection.submitButtonText = "Send Message";
        break;
      case "market_stats":
        newSection.stats = ["median_price", "avg_days_on_market", "total_listings", "sold_last_month"];
        break;
      case "custom_html":
        newSection.html = "";
        break;
    }

    setEditingSection(newSection);
    setAddingSectionType("");
  };

  const handleSaveSection = (section: SidebarSection) => {
    const existingIndex = sections.findIndex(s => s.id === section.id);
    
    if (existingIndex >= 0) {
      const updated = [...sections];
      updated[existingIndex] = section;
      onChange(updated);
    } else {
      onChange([...sections, section]);
    }
    
    setEditingSection(null);
  };

  const handleDeleteSection = (id: string) => {
    const filtered = sections.filter(s => s.id !== id);
    const reordered = filtered.map((s, index) => ({ ...s, order: index }));
    onChange(reordered);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Select value={addingSectionType} onValueChange={(value) => setAddingSectionType(value as SidebarSectionType)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select section type..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sectionTypeLabels).map(([type, label]) => (
              <SelectItem key={type} value={type}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddSection} disabled={!addingSectionType}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sidebar-sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">{section.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {sectionTypeLabels[section.type]}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSection(section)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteSection(section.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {sections.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No sidebar sections yet. Add your first section above.</p>
        </div>
      )}

      {editingSection && (
        <SidebarSectionEditor
          section={editingSection}
          onSave={handleSaveSection}
          onCancel={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}
