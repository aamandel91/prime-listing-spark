import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, GripVertical, Trash2, Edit } from "lucide-react";
import { ContentPageModule, ModuleType } from "@/types/contentModules";
import { ModuleEditor } from "./ModuleEditor";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface ModuleBuilderProps {
  modules: ContentPageModule[];
  onChange: (modules: ContentPageModule[]) => void;
}

const MODULE_TYPES: { value: ModuleType; label: string }[] = [
  { value: "content", label: "Content Area" },
  { value: "saved_search_listings", label: "Listings from Saved Search" },
  { value: "saved_search_table", label: "Listings Table" },
  { value: "statistics", label: "Statistics Module" },
  { value: "links", label: "Links" },
  { value: "contact_form", label: "Contact Form" },
  { value: "testimonials", label: "Testimonials" },
  { value: "blog_posts", label: "Blog Posts" },
  { value: "videos_grid", label: "Videos Grid" },
  { value: "single_video", label: "Single Video" },
  { value: "contact_details", label: "Contact Details" },
  { value: "team_members", label: "Team Members" },
  { value: "mortgage_calculator", label: "Mortgage Calculator" },
  { value: "seller_tool", label: "Seller Lead Tool" },
];

export function ModuleBuilder({ modules, onChange }: ModuleBuilderProps) {
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [showModuleTypeSelector, setShowModuleTypeSelector] = useState(false);

  const addModule = (type: ModuleType) => {
    const id = crypto.randomUUID();
    let newModule: ContentPageModule;

    switch (type) {
      case "content":
        newModule = { id, type: "content", title: "", content: "" };
        break;
      case "saved_search_listings":
        newModule = { id, type: "saved_search_listings", title: "", displayType: "grid", limit: 12 };
        break;
      case "saved_search_table":
        newModule = { id, type: "saved_search_table", title: "", limit: 12 };
        break;
      case "statistics":
        newModule = { id, type: "statistics", title: "", stats: [] };
        break;
      case "links":
        newModule = { id, type: "links", title: "", links: [] };
        break;
      case "contact_form":
        newModule = { id, type: "contact_form", title: "", fields: ["name", "email", "phone", "message"] };
        break;
      case "testimonials":
        newModule = { id, type: "testimonials", title: "", limit: 6 };
        break;
      case "blog_posts":
        newModule = { id, type: "blog_posts", title: "", limit: 6 };
        break;
      case "videos_grid":
        newModule = { id, type: "videos_grid", title: "", limit: 6 };
        break;
      case "single_video":
        newModule = { id, type: "single_video", title: "" };
        break;
      case "contact_details":
        newModule = { id, type: "contact_details", title: "" };
        break;
      case "team_members":
        newModule = { id, type: "team_members", title: "", limit: 12 };
        break;
      case "mortgage_calculator":
        newModule = { id, type: "mortgage_calculator", title: "" };
        break;
      case "seller_tool":
        newModule = { id, type: "seller_tool", title: "" };
        break;
      default:
        return;
    }

    onChange([...modules, newModule]);
    setEditingModule(newModule.id);
    setShowModuleTypeSelector(false);
  };

  const updateModule = (id: string, updates: Partial<ContentPageModule>) => {
    onChange(
      modules.map((m) => (m.id === id ? { ...m, ...updates } as ContentPageModule : m))
    );
  };

  const deleteModule = (id: string) => {
    onChange(modules.filter((m) => m.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const getModuleLabel = (type: ModuleType) => {
    return MODULE_TYPES.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Page Modules</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowModuleTypeSelector(!showModuleTypeSelector)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {showModuleTypeSelector && (
        <Card>
          <CardHeader>
            <CardTitle>Select Module Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MODULE_TYPES.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant="outline"
                  onClick={() => addModule(type.value)}
                  className="justify-start"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move mt-1"
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">
                                  {getModuleLabel(module.type)}
                                </p>
                                {module.title && (
                                  <p className="text-sm text-muted-foreground">
                                    {module.title}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setEditingModule(
                                      editingModule === module.id
                                        ? null
                                        : module.id
                                    )
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteModule(module.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {editingModule === module.id && (
                              <ModuleEditor
                                module={module}
                                onChange={(updates) =>
                                  updateModule(module.id, updates)
                                }
                                onClose={() => setEditingModule(null)}
                              />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {modules.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No modules added yet. Click "Add Module" to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
