import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Save, FileText, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchCriteriaEditor } from "@/components/admin/SearchCriteriaEditor";
import { ModuleBuilder } from "@/components/admin/ModuleBuilder";
import { ContentPageModule } from "@/types/contentModules";

export default function ContentPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    featured_image: "",
    page_type: "standard",
    published: false,
    sort_order: 0,
    modules: [] as any[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const pageData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
      };

      if (editingPage) {
        const { error } = await supabase
          .from("content_pages")
          .update(pageData)
          .eq("id", editingPage.id);
        if (error) throw error;
        toast({ title: "Success", description: "Page updated" });
      } else {
        const { error } = await supabase.from("content_pages").insert([pageData]);
        if (error) throw error;
        toast({ title: "Success", description: "Page created" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save page",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_description: page.meta_description || "",
      featured_image: page.featured_image || "",
      page_type: page.page_type,
      published: page.published,
      sort_order: page.sort_order,
      modules: page.modules || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this page?")) return;

    try {
      const { error } = await supabase.from("content_pages").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Page deleted" });
      fetchPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      meta_description: "",
      featured_image: "",
      page_type: "standard",
      published: false,
      sort_order: 0,
      modules: [],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Content Pages | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Pages</h1>
            <p className="text-muted-foreground mt-2">
              Manage static content pages (About, Terms, Privacy, etc.)
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPage ? "Edit Page" : "Add New Page"}</DialogTitle>
              </DialogHeader>
              
              {editingPage ? (
                <Tabs defaultValue="modules" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="modules">Page Modules</TabsTrigger>
                    <TabsTrigger value="details">Settings</TabsTrigger>
                    <TabsTrigger value="search">
                      <Search className="w-4 h-4 mr-2" />
                      Search Criteria
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="modules">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <ModuleBuilder
                        modules={formData.modules as ContentPageModule[]}
                        onChange={(modules) => setFormData({ ...formData, modules })}
                      />
                      <div className="flex gap-2">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="slug">Slug *</Label>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="about-us"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="meta_description">Meta Description</Label>
                        <Textarea
                          id="meta_description"
                          value={formData.meta_description}
                          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                          rows={2}
                          placeholder="SEO description..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="featured_image">Featured Image URL</Label>
                        <Input
                          id="featured_image"
                          value={formData.featured_image}
                          onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, published: checked })
                            }
                          />
                          <Label htmlFor="published">Published</Label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="search">
                    <SearchCriteriaEditor 
                      pageId={editingPage.id} 
                      onSave={() => {
                        toast({
                          title: "Success",
                          description: "Search criteria updated"
                        });
                      }}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="about-us"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      rows={2}
                      placeholder="SEO description..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="featured_image">Featured Image URL</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, published: checked })
                        }
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </div>
                  
                  <ModuleBuilder
                    modules={formData.modules as ContentPageModule[]}
                    onChange={(modules) => setFormData({ ...formData, modules })}
                  />

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Create Page
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5" />
                      <h3 className="font-semibold">{page.title}</h3>
                      <span className="text-xs text-muted-foreground">/{page.slug}</span>
                    </div>
                    {page.meta_description && (
                      <p className="text-sm text-muted-foreground mb-2">{page.meta_description}</p>
                    )}
                    <div className="flex gap-2">
                      {page.published ? (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Draft</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(page.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
