import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRepliers } from "@/hooks/useRepliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Save, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FeaturedCity {
  id: string;
  city_name: string;
  state: string;
  slug: string;
  featured: boolean;
  description: string | null;
  hero_image_url: string | null;
  custom_content: any;
  sort_order: number;
}

export default function FeaturedCities() {
  const [cities, setCities] = useState<FeaturedCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    city_name: "",
    state: "",
    slug: "",
    featured: true,
    description: "",
    hero_image_url: "",
    sort_order: 0,
  });
  const { toast } = useToast();
  const repliers = useRepliers();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_cities")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("featured_cities")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Success", description: "City updated successfully" });
      } else {
        const { error } = await supabase
          .from("featured_cities")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Success", description: "City added successfully" });
      }

      setEditingId(null);
      setIsAddingNew(false);
      setFormData({
        city_name: "",
        state: "",
        slug: "",
        featured: true,
        description: "",
        hero_image_url: "",
        sort_order: 0,
      });
      fetchCities();
    } catch (error) {
      console.error("Error saving city:", error);
      toast({
        title: "Error",
        description: "Failed to save city",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;

    try {
      const { error } = await supabase
        .from("featured_cities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "City deleted successfully" });
      fetchCities();
    } catch (error) {
      console.error("Error deleting city:", error);
      toast({
        title: "Error",
        description: "Failed to delete city",
        variant: "destructive",
      });
    }
  };

  const startEdit = (city: FeaturedCity) => {
    setEditingId(city.id);
    setFormData({
      city_name: city.city_name,
      state: city.state,
      slug: city.slug,
      featured: city.featured,
      description: city.description || "",
      hero_image_url: city.hero_image_url || "",
      sort_order: city.sort_order,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({
      city_name: "",
      state: "",
      slug: "",
      featured: true,
      description: "",
      hero_image_url: "",
      sort_order: 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Featured Cities</h1>
          {!isAddingNew && (
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Button>
          )}
        </div>

        {isAddingNew && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New City</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city_name">City Name</Label>
                  <Input
                    id="city_name"
                    value={formData.city_name}
                    onChange={(e) =>
                      setFormData({ ...formData, city_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hero_image_url">Hero Image URL</Label>
                <Input
                  id="hero_image_url"
                  value={formData.hero_image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_image_url: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {cities.map((city) => (
            <Card key={city.id}>
              <CardContent className="pt-6">
                {editingId === city.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit_city_name_${city.id}`}>
                          City Name
                        </Label>
                        <Input
                          id={`edit_city_name_${city.id}`}
                          value={formData.city_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              city_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit_state_${city.id}`}>State</Label>
                        <Input
                          id={`edit_state_${city.id}`}
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit_slug_${city.id}`}>Slug</Label>
                        <Input
                          id={`edit_slug_${city.id}`}
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit_sort_order_${city.id}`}>
                          Sort Order
                        </Label>
                        <Input
                          id={`edit_sort_order_${city.id}`}
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sort_order: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`edit_hero_image_url_${city.id}`}>
                        Hero Image URL
                      </Label>
                      <Input
                        id={`edit_hero_image_url_${city.id}`}
                        value={formData.hero_image_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero_image_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit_description_${city.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`edit_description_${city.id}`}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`edit_featured_${city.id}`}
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, featured: checked })
                        }
                      />
                      <Label htmlFor={`edit_featured_${city.id}`}>
                        Featured
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {city.city_name}, {city.state}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Slug: {city.slug} | Order: {city.sort_order}
                      </p>
                      {city.description && (
                        <p className="mt-2 text-sm">{city.description}</p>
                      )}
                      <p className="mt-2 text-sm">
                        Status:{" "}
                        <span
                          className={
                            city.featured ? "text-green-600" : "text-red-600"
                          }
                        >
                          {city.featured ? "Featured" : "Not Featured"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(city.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
