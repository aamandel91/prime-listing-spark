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
import { Loader2, Plus, Edit, Trash2, Save, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_role: "",
    content: "",
    rating: 5,
    featured: false,
    published: true,
    agent_id: "",
    property_address: "",
    sort_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testimonialsRes, agentsRes] = await Promise.all([
        supabase.from("testimonials").select("*, agents(full_name)").order("sort_order"),
        supabase.from("agents").select("id, full_name").eq("active", true),
      ]);

      if (testimonialsRes.error) throw testimonialsRes.error;
      if (agentsRes.error) throw agentsRes.error;

      setTestimonials(testimonialsRes.data || []);
      setAgents(agentsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        agent_id: formData.agent_id || null,
        property_address: formData.property_address || null,
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(data)
          .eq("id", editingTestimonial.id);
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated" });
      } else {
        const { error } = await supabase.from("testimonials").insert([data]);
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial created" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setFormData({
      client_name: testimonial.client_name,
      client_role: testimonial.client_role || "",
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      published: testimonial.published,
      agent_id: testimonial.agent_id || "",
      property_address: testimonial.property_address || "",
      sort_order: testimonial.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Testimonial deleted" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      client_name: "",
      client_role: "",
      content: "",
      rating: 5,
      featured: false,
      published: true,
      agent_id: "",
      property_address: "",
      sort_order: 0,
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
        <title>Testimonials Management | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Testimonials</h1>
            <p className="text-muted-foreground mt-2">Manage client testimonials</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_name">Client Name *</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="client_role">Client Role</Label>
                    <Input
                      id="client_role"
                      value={formData.client_role}
                      onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                      placeholder="Home Buyer, Seller, etc."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">Testimonial Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Star{num !== 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="agent_id">Related Agent</Label>
                    <Select
                      value={formData.agent_id}
                      onValueChange={(value) => setFormData({ ...formData, agent_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="property_address">Property Address</Label>
                  <Input
                    id="property_address"
                    value={formData.property_address}
                    onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  />
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {editingTestimonial ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{testimonial.client_name}</h3>
                      {testimonial.client_role && (
                        <span className="text-sm text-muted-foreground">- {testimonial.client_role}</span>
                      )}
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{testimonial.content}</p>
                    {testimonial.property_address && (
                      <p className="text-xs text-muted-foreground">Property: {testimonial.property_address}</p>
                    )}
                    {testimonial.agents && (
                      <p className="text-xs text-muted-foreground">Agent: {testimonial.agents.full_name}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {testimonial.featured && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {!testimonial.published && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Draft</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                    >
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
