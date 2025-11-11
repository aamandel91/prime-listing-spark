import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, GripVertical, Eye, EyeOff, ChevronDown } from "lucide-react";

interface LayoutSection {
  id: string;
  section_id: string;
  section_name: string;
  section_component: string;
  display_order: number;
  is_enabled: boolean;
  is_collapsible: boolean;
  default_open: boolean;
}

export default function PropertyDetailLayout() {
  const [sections, setSections] = useState<LayoutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('property_detail_layout')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load layout sections');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display_order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index + 1,
    }));

    setSections(updatedItems);
  };

  const toggleEnabled = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, is_enabled: !section.is_enabled }
        : section
    ));
  };

  const toggleCollapsible = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, is_collapsible: !section.is_collapsible }
        : section
    ));
  };

  const toggleDefaultOpen = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, default_open: !section.default_open }
        : section
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update all sections in parallel
      const updates = sections.map(section => 
        supabase
          .from('property_detail_layout')
          .update({
            display_order: section.display_order,
            is_enabled: section.is_enabled,
            is_collapsible: section.is_collapsible,
            default_open: section.default_open,
          })
          .eq('id', section.id)
      );

      await Promise.all(updates);
      toast.success('Layout configuration saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error('Failed to save layout configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Detail Page Layout</h1>
          <p className="text-muted-foreground mt-2">
            Drag and drop sections to reorder them, or toggle visibility
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>

        <Card className="p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {sections.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-card border rounded-lg p-4 transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-5 h-5 text-muted-foreground" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{section.section_name}</h3>
                                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                                  {section.section_component}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* Visibility Toggle */}
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`enabled-${section.id}`} className="text-sm">
                                  {section.is_enabled ? (
                                    <Eye className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Label>
                                <Switch
                                  id={`enabled-${section.id}`}
                                  checked={section.is_enabled}
                                  onCheckedChange={() => toggleEnabled(section.id)}
                                />
                              </div>

                              {/* Collapsible Toggle */}
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`collapsible-${section.id}`} className="text-sm">
                                  Collapsible
                                </Label>
                                <Switch
                                  id={`collapsible-${section.id}`}
                                  checked={section.is_collapsible}
                                  onCheckedChange={() => toggleCollapsible(section.id)}
                                />
                              </div>

                              {/* Default Open Toggle (only if collapsible) */}
                              {section.is_collapsible && (
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`default-open-${section.id}`} className="text-sm">
                                    <ChevronDown className="w-4 h-4" />
                                  </Label>
                                  <Switch
                                    id={`default-open-${section.id}`}
                                    checked={section.default_open}
                                    onCheckedChange={() => toggleDefaultOpen(section.id)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Legend:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-600" /> = Section is visible on the page
            </li>
            <li className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" /> = Section is hidden
            </li>
            <li>Collapsible = Section can be collapsed by users</li>
            <li className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4" /> = Collapsible section is open by default
            </li>
        </ul>
      </div>
    </div>
  );
}
