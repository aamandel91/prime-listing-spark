import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Copy, Trash2, Edit2, Sparkles } from "lucide-react";
import { SidebarBuilder } from "@/components/admin/SidebarBuilder";
import { SidebarSection, SidebarTemplate } from "@/types/sidebarSections";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SidebarManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<SidebarTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<SidebarTemplate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sections: [] as SidebarSection[],
    is_default: false
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("sidebar_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates((data as any) || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sidebar templates"
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a template name"
      });
      return;
    }

    setLoading(true);
    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from("sidebar_templates")
          .update({
            name: formData.name,
            description: formData.description,
            sections: formData.sections as any,
            is_default: formData.is_default
          })
          .eq("id", editingTemplate.id);

        if (error) throw error;
        
        toast({
          title: "Template Updated",
          description: "Sidebar template saved successfully"
        });
      } else {
        const { error } = await supabase
          .from("sidebar_templates")
          .insert({
            name: formData.name,
            description: formData.description,
            sections: formData.sections as any,
            is_default: formData.is_default
          });

        if (error) throw error;
        
        toast({
          title: "Template Created",
          description: "New sidebar template created successfully"
        });
      }

      resetForm();
      fetchTemplates();
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save template"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: SidebarTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      sections: template.sections as SidebarSection[],
      is_default: template.is_default
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sidebar_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Template Deleted",
        description: "Sidebar template removed successfully"
      });

      fetchTemplates();
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete template"
      });
    }
    setDeleteConfirm(null);
  };

  const handleApplyToAllPages = async (templateId: string) => {
    setLoading(true);
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      const { data: pages, error: fetchError } = await supabase
        .from("content_pages")
        .select("id");

      if (fetchError) throw fetchError;

      const updates = pages?.map(page => ({
        id: page.id,
        sidebar_config: template.sections as any,
        content: '',
        slug: '',
        title: ''
      }));

      if (updates) {
        const { error: updateError } = await supabase
          .from("content_pages")
          .upsert(updates);

        if (updateError) throw updateError;

        toast({
          title: "Sidebar Applied",
          description: `Sidebar template applied to ${updates.length} pages`
        });
      }
    } catch (error: any) {
      console.error("Error applying template:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply template to all pages"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      sections: [],
      is_default: false
    });
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sidebar Management</h1>
        <p className="text-muted-foreground">
          Create and manage reusable sidebar templates for your content pages
        </p>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">
            {editingTemplate ? "Edit Template" : "Create Template"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.name}
                        {template.is_default && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </CardTitle>
                      {template.description && (
                        <CardDescription>{template.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyToAllPages(template.id)}
                        disabled={loading}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Apply to All
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {template.sections.length} section{template.sections.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}

            {templates.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No sidebar templates yet</p>
                  <Button className="mt-4" onClick={() => {}}>
                    Create Your First Template
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., City Page Sidebar"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
                />
                <Label htmlFor="is_default">Set as default template for new pages</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sidebar Sections</CardTitle>
              <CardDescription>
                Add and arrange sections that will appear in the sidebar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SidebarBuilder
                sections={formData.sections}
                onChange={(sections) => setFormData({ ...formData, sections })}
              />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
            {editingTemplate && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this sidebar template. Pages using this template will keep their current sidebar configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
