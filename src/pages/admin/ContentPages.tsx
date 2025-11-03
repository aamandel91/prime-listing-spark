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
import { Loader2, Plus, Edit, Trash2, Save, FileText, Search, Copy } from "lucide-react";
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
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
};

export default function ContentPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
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
    is_template: false,
    include_in_nav: true,
    hide_header: false,
    hide_breadcrumbs: false,
    hide_footer: false,
    display_sidebar: true,
    full_width: false,
    specific_sidebar: "",
    open_in: "same_window",
    page_priority: 0.7,
    robots_indexing: "index, follow",
    meta_title: "",
    meta_keywords: "",
    default_image: "",
    page_overview: "",
  });
  const { toast } = useToast();

  const handleTitleChange = (newTitle: string) => {
    setFormData({ ...formData, title: newTitle });
    
    // Auto-generate slug only if user hasn't manually edited it
    if (!editingPage && !slugManuallyEdited) {
      setFormData(prev => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
    } else if (!editingPage) {
      setFormData(prev => ({ ...prev, title: newTitle }));
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setSlugManuallyEdited(true);
    setFormData({ ...formData, slug: generateSlug(newSlug) });
  };

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
      is_template: page.is_template || false,
      include_in_nav: page.include_in_nav ?? true,
      hide_header: page.hide_header || false,
      hide_breadcrumbs: page.hide_breadcrumbs || false,
      hide_footer: page.hide_footer || false,
      display_sidebar: page.display_sidebar ?? true,
      full_width: page.full_width || false,
      specific_sidebar: page.specific_sidebar || "",
      open_in: page.open_in || "same_window",
      page_priority: page.page_priority || 0.7,
      robots_indexing: page.robots_indexing || "index, follow",
      meta_title: page.meta_title || "",
      meta_keywords: page.meta_keywords || "",
      default_image: page.default_image || "",
      page_overview: page.page_overview || "",
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

  const handleDuplicate = async (page: any) => {
    try {
      const duplicateData = {
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy-${Date.now()}`,
        content: page.content,
        meta_description: page.meta_description,
        featured_image: page.featured_image,
        page_type: page.page_type,
        published: false,
        sort_order: page.sort_order,
        modules: page.modules || [],
        is_template: false,
      };

      const { error } = await supabase.from("content_pages").insert([duplicateData]);
      if (error) throw error;

      toast({ 
        title: "Success", 
        description: "Page duplicated successfully" 
      });
      fetchPages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate page",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setSlugManuallyEdited(false);
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
      is_template: false,
      include_in_nav: true,
      hide_header: false,
      hide_breadcrumbs: false,
      hide_footer: false,
      display_sidebar: true,
      full_width: false,
      specific_sidebar: "",
      open_in: "same_window",
      page_priority: 0.7,
      robots_indexing: "index, follow",
      meta_title: "",
      meta_keywords: "",
      default_image: "",
      page_overview: "",
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
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="about-us"
                          />
                        </div>
                      </div>

                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="page-settings">
                          <AccordionTrigger>Page Settings</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="include_in_nav">Include in Dynamic Navigation Menus?</Label>
                                <Switch
                                  id="include_in_nav"
                                  checked={formData.include_in_nav}
                                  onCheckedChange={(checked) =>
                                    setFormData({ ...formData, include_in_nav: checked })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="hide_header">Hide Header Navigation?</Label>
                                <Switch
                                  id="hide_header"
                                  checked={formData.hide_header}
                                  onCheckedChange={(checked) =>
                                    setFormData({ ...formData, hide_header: checked })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="hide_breadcrumbs">Hide Breadcrumbs?</Label>
                                <Switch
                                  id="hide_breadcrumbs"
                                  checked={formData.hide_breadcrumbs}
                                  onCheckedChange={(checked) =>
                                    setFormData({ ...formData, hide_breadcrumbs: checked })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="hide_footer">Hide Footer Navigation?</Label>
                                <Switch
                                  id="hide_footer"
                                  checked={formData.hide_footer}
                                  onCheckedChange={(checked) =>
                                    setFormData({ ...formData, hide_footer: checked })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="display_sidebar">Display Sidebar on This Page?</Label>
                                <Switch
                                  id="display_sidebar"
                                  checked={formData.display_sidebar}
                                  onCheckedChange={(checked) =>
                                    setFormData({ ...formData, display_sidebar: checked })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="full_width">Full / Fluid Width Page?</Label>
                                <Switch
                                  id="full_width"
                                  checked={formData.full_width}
                                  onCheckedChange={(checked) =>
                                    setFormData({ ...formData, full_width: checked })
                                  }
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="specific_sidebar">Page-Specific Sidebar</Label>
                                <Input
                                  id="specific_sidebar"
                                  value={formData.specific_sidebar}
                                  onChange={(e) =>
                                    setFormData({ ...formData, specific_sidebar: e.target.value })
                                  }
                                  placeholder="None (Use Section)"
                                />
                              </div>
                              <div>
                                <Label htmlFor="open_in">Open In</Label>
                                <Select
                                  value={formData.open_in}
                                  onValueChange={(value) =>
                                    setFormData({ ...formData, open_in: value })
                                  }
                                >
                                  <SelectTrigger id="open_in">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="same_window">Same Window</SelectItem>
                                    <SelectItem value="new_window">New Window</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="page_priority">Page Priority</Label>
                                <Input
                                  id="page_priority"
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="1"
                                  value={formData.page_priority}
                                  onChange={(e) =>
                                    setFormData({ ...formData, page_priority: parseFloat(e.target.value) })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="robots_indexing">Robots / Page Indexing</Label>
                                <Select
                                  value={formData.robots_indexing}
                                  onValueChange={(value) =>
                                    setFormData({ ...formData, robots_indexing: value })
                                  }
                                >
                                  <SelectTrigger id="robots_indexing">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="index, follow">index, follow</SelectItem>
                                    <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                                    <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                                    <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="meta-tags">
                          <AccordionTrigger>Meta Tags</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="meta_title">Meta Title</Label>
                              <Input
                                id="meta_title"
                                value={formData.meta_title}
                                onChange={(e) =>
                                  setFormData({ ...formData, meta_title: e.target.value })
                                }
                                placeholder="Page title"
                              />
                            </div>
                            <div>
                              <Label htmlFor="meta_keywords">Meta Keywords</Label>
                              <Textarea
                                id="meta_keywords"
                                value={formData.meta_keywords}
                                onChange={(e) =>
                                  setFormData({ ...formData, meta_keywords: e.target.value })
                                }
                                rows={3}
                                placeholder="keyword1, keyword2, keyword3"
                              />
                            </div>
                            <div>
                              <Label htmlFor="meta_description">Meta Description</Label>
                              <Textarea
                                id="meta_description"
                                value={formData.meta_description}
                                onChange={(e) =>
                                  setFormData({ ...formData, meta_description: e.target.value })
                                }
                                rows={3}
                                placeholder="SEO description..."
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="page-defaults">
                          <AccordionTrigger>Page Defaults</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div>
                              <Label>Default Page Photo</Label>
                              <p className="text-sm text-muted-foreground mb-2">
                                Must be .jpg format. Optimal resolution 525px X 350px. Larger images will be scaled / optimized.
                              </p>
                              {formData.default_image && (
                                <div className="mb-2">
                                  <img 
                                    src={formData.default_image} 
                                    alt="Default page" 
                                    className="w-32 h-32 object-cover rounded"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, default_image: "" })}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              )}
                              <ImageUpload
                                onImageUploaded={(url) =>
                                  setFormData({ ...formData, default_image: url })
                                }
                                folder="page-defaults"
                              />
                            </div>
                            <div>
                              <Label htmlFor="page_overview">Page Overview</Label>
                              <p className="text-sm text-muted-foreground mb-2">
                                1-3 sentence summary of the page contents & purpose.
                              </p>
                              <Textarea
                                id="page_overview"
                                value={formData.page_overview}
                                onChange={(e) =>
                                  setFormData({ ...formData, page_overview: e.target.value })
                                }
                                rows={3}
                                placeholder="Brief overview of this page..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="featured_image">Featured Image URL</Label>
                              <Input
                                id="featured_image"
                                value={formData.featured_image}
                                onChange={(e) =>
                                  setFormData({ ...formData, featured_image: e.target.value })
                                }
                                placeholder="https://..."
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

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
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_template"
                            checked={formData.is_template}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, is_template: checked })
                            }
                          />
                          <Label htmlFor="is_template">Template</Label>
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
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="about-us"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-generated from title, but you can edit it
                      </p>
                    </div>
                  </div>

                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="page-settings">
                      <AccordionTrigger>Page Settings</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="include_in_nav_new">Include in Dynamic Navigation Menus?</Label>
                            <Switch
                              id="include_in_nav_new"
                              checked={formData.include_in_nav}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, include_in_nav: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="hide_header_new">Hide Header Navigation?</Label>
                            <Switch
                              id="hide_header_new"
                              checked={formData.hide_header}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, hide_header: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="hide_breadcrumbs_new">Hide Breadcrumbs?</Label>
                            <Switch
                              id="hide_breadcrumbs_new"
                              checked={formData.hide_breadcrumbs}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, hide_breadcrumbs: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="hide_footer_new">Hide Footer Navigation?</Label>
                            <Switch
                              id="hide_footer_new"
                              checked={formData.hide_footer}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, hide_footer: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="display_sidebar_new">Display Sidebar on This Page?</Label>
                            <Switch
                              id="display_sidebar_new"
                              checked={formData.display_sidebar}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, display_sidebar: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="full_width_new">Full / Fluid Width Page?</Label>
                            <Switch
                              id="full_width_new"
                              checked={formData.full_width}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, full_width: checked })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="specific_sidebar_new">Page-Specific Sidebar</Label>
                            <Input
                              id="specific_sidebar_new"
                              value={formData.specific_sidebar}
                              onChange={(e) =>
                                setFormData({ ...formData, specific_sidebar: e.target.value })
                              }
                              placeholder="None (Use Section)"
                            />
                          </div>
                          <div>
                            <Label htmlFor="open_in_new">Open In</Label>
                            <Select
                              value={formData.open_in}
                              onValueChange={(value) =>
                                setFormData({ ...formData, open_in: value })
                              }
                            >
                              <SelectTrigger id="open_in_new">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="same_window">Same Window</SelectItem>
                                <SelectItem value="new_window">New Window</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="page_priority_new">Page Priority</Label>
                            <Input
                              id="page_priority_new"
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              value={formData.page_priority}
                              onChange={(e) =>
                                setFormData({ ...formData, page_priority: parseFloat(e.target.value) })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="robots_indexing_new">Robots / Page Indexing</Label>
                            <Select
                              value={formData.robots_indexing}
                              onValueChange={(value) =>
                                setFormData({ ...formData, robots_indexing: value })
                              }
                            >
                              <SelectTrigger id="robots_indexing_new">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="index, follow">index, follow</SelectItem>
                                <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                                <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                                <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="meta-tags">
                      <AccordionTrigger>Meta Tags</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="meta_title_new">Meta Title</Label>
                          <Input
                            id="meta_title_new"
                            value={formData.meta_title}
                            onChange={(e) =>
                              setFormData({ ...formData, meta_title: e.target.value })
                            }
                            placeholder="Page title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="meta_keywords_new">Meta Keywords</Label>
                          <Textarea
                            id="meta_keywords_new"
                            value={formData.meta_keywords}
                            onChange={(e) =>
                              setFormData({ ...formData, meta_keywords: e.target.value })
                            }
                            rows={3}
                            placeholder="keyword1, keyword2, keyword3"
                          />
                        </div>
                        <div>
                          <Label htmlFor="meta_description_new">Meta Description</Label>
                          <Textarea
                            id="meta_description_new"
                            value={formData.meta_description}
                            onChange={(e) =>
                              setFormData({ ...formData, meta_description: e.target.value })
                            }
                            rows={3}
                            placeholder="SEO description..."
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="page-defaults">
                      <AccordionTrigger>Page Defaults</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div>
                          <Label>Default Page Photo</Label>
                          <p className="text-sm text-muted-foreground mb-2">
                            Must be .jpg format. Optimal resolution 525px X 350px. Larger images will be scaled / optimized.
                          </p>
                          {formData.default_image && (
                            <div className="mb-2">
                              <img 
                                src={formData.default_image} 
                                alt="Default page" 
                                className="w-32 h-32 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormData({ ...formData, default_image: "" })}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          )}
                          <ImageUpload
                            onImageUploaded={(url) =>
                              setFormData({ ...formData, default_image: url })
                            }
                            folder="page-defaults"
                          />
                        </div>
                        <div>
                          <Label htmlFor="page_overview_new">Page Overview</Label>
                          <p className="text-sm text-muted-foreground mb-2">
                            1-3 sentence summary of the page contents & purpose.
                          </p>
                          <Textarea
                            id="page_overview_new"
                            value={formData.page_overview}
                            onChange={(e) =>
                              setFormData({ ...formData, page_overview: e.target.value })
                            }
                            rows={3}
                            placeholder="Brief overview of this page..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="featured_image_new">Featured Image URL</Label>
                          <Input
                            id="featured_image_new"
                            value={formData.featured_image}
                            onChange={(e) =>
                              setFormData({ ...formData, featured_image: e.target.value })
                            }
                            placeholder="https://..."
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published_new"
                        checked={formData.published}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, published: checked })
                        }
                      />
                      <Label htmlFor="published_new">Published</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_template_new"
                        checked={formData.is_template}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_template: checked })
                        }
                      />
                      <Label htmlFor="is_template_new">Template</Label>
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
                      {page.is_template && (
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                          Template
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDuplicate(page)}
                      title="Duplicate page"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
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
