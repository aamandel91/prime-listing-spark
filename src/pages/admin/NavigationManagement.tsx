import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, GripVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import {
  useNavigationItems,
  useCreateNavigationItem,
  useUpdateNavigationItem,
  useDeleteNavigationItem,
  useReorderNavigationItems,
  NavigationItem,
} from "@/hooks/useNavigationItems";

const NavigationManagement = () => {
  const { data: navItems = [], isLoading } = useNavigationItems();
  const createItem = useCreateNavigationItem();
  const updateItem = useUpdateNavigationItem();
  const deleteItem = useDeleteNavigationItem();
  const reorderItems = useReorderNavigationItems();

  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const leftItems = navItems.filter(item => item.position === 'left');
  const rightItems = navItems.filter(item => item.position === 'right');
  const mobileItems = navItems.filter(item => item.position === 'mobile');

  const handleDragEnd = (result: DropResult, position: string) => {
    if (!result.destination) return;

    const items = position === 'left' ? leftItems : position === 'right' ? rightItems : mobileItems;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const updates = reordered.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    reorderItems.mutate(updates);
  };

  const handleSave = (formData: FormData) => {
    const itemData = {
      label: formData.get("label") as string,
      type: formData.get("type") as NavigationItem["type"],
      position: formData.get("position") as NavigationItem["position"],
      url: formData.get("url") as string || undefined,
      target: formData.get("target") as NavigationItem["target"] || '_self',
      icon: formData.get("icon") as string || undefined,
      is_visible: formData.get("is_visible") === "true",
      css_classes: formData.get("css_classes") as string || undefined,
      order_index: editingItem?.order_index || 0,
    };

    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, updates: itemData });
    } else {
      createItem.mutate(itemData as Omit<NavigationItem, "id">);
    }

    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const renderNavItem = (item: NavigationItem, index: number) => (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-2"
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div {...provided.dragHandleProps}>
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1">
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-muted-foreground">
                {item.type} • {item.url || 'No URL'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {item.is_visible ? (
                <Eye className="h-4 w-4 text-success" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingItem(item);
                  setIsDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Delete this navigation item?")) {
                    deleteItem.mutate(item.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Navigation Management</h1>
            <p className="text-muted-foreground">Manage your site navigation menu</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Nav Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
                </DialogTitle>
              </DialogHeader>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    name="label"
                    defaultValue={editingItem?.label}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue={editingItem?.type || "link"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="button">Button</SelectItem>
                      <SelectItem value="divider">Divider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select name="position" defaultValue={editingItem?.position || "left"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="mobile">Mobile Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    defaultValue={editingItem?.url}
                    placeholder="/page-url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Select name="target" defaultValue={editingItem?.target || "_self"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_self">Same Window</SelectItem>
                      <SelectItem value="_blank">New Window</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Lucide name)</Label>
                  <Input
                    id="icon"
                    name="icon"
                    defaultValue={editingItem?.icon}
                    placeholder="Home"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="css_classes">CSS Classes</Label>
                  <Input
                    id="css_classes"
                    name="css_classes"
                    defaultValue={editingItem?.css_classes}
                    placeholder="custom-class"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_visible">Visible</Label>
                  <Switch
                    id="is_visible"
                    name="is_visible"
                    defaultChecked={editingItem?.is_visible !== false}
                    onCheckedChange={(checked) => {
                      const input = document.querySelector('input[name="is_visible_value"]') as HTMLInputElement;
                      if (input) input.value = String(checked);
                    }}
                  />
                  <input type="hidden" name="is_visible_value" defaultValue={String(editingItem?.is_visible !== false)} />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="left" className="w-full">
          <TabsList>
            <TabsTrigger value="left">Left Menu ({leftItems.length})</TabsTrigger>
            <TabsTrigger value="right">Right Menu ({rightItems.length})</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Only ({mobileItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="left" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Left Navigation Items</CardTitle>
                <CardDescription>Items displayed on the left side of the navbar</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'left')}>
                  <Droppable droppableId="left-nav">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {leftItems.map((item, index) => renderNavItem(item, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="right" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Right Navigation Items</CardTitle>
                <CardDescription>Items displayed on the right side of the navbar</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'right')}>
                  <Droppable droppableId="right-nav">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {rightItems.map((item, index) => renderNavItem(item, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile Navigation Items</CardTitle>
                <CardDescription>Items displayed only in mobile menu</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'mobile')}>
                  <Droppable droppableId="mobile-nav">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {mobileItems.map((item, index) => renderNavItem(item, index))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default NavigationManagement;
