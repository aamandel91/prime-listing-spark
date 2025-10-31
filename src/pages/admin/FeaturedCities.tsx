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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface FeaturedCounty {
  id: string;
  county_name: string;
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
  const [counties, setCounties] = useState<FeaturedCounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [locationType, setLocationType] = useState<"city" | "county">("city");
  const [formData, setFormData] = useState({
    name: "",
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
    fetchCounties();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_cities")
        .select("*")
        .order("city_name", { ascending: true });

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

  const fetchCounties = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_counties")
        .select("*")
        .order("county_name", { ascending: true });

      if (error) throw error;
      setCounties(data || []);
    } catch (error) {
      console.error("Error fetching counties:", error);
      toast({
        title: "Error",
        description: "Failed to fetch counties",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (locationType === "city") {
        const dataToSave = {
          city_name: formData.name,
          state: formData.state,
          slug: formData.slug,
          featured: formData.featured,
          description: formData.description,
          hero_image_url: formData.hero_image_url,
          sort_order: formData.sort_order,
        };

        if (editingId) {
          const { error } = await supabase
            .from("featured_cities")
            .update(dataToSave)
            .eq("id", editingId);

          if (error) throw error;
          toast({ title: "Success", description: "City updated successfully" });
        } else {
          const { error } = await supabase
            .from("featured_cities")
            .insert([dataToSave]);

          if (error) throw error;
          toast({ title: "Success", description: "City added successfully" });
        }
        fetchCities();
      } else {
        const dataToSave = {
          county_name: formData.name,
          state: formData.state,
          slug: formData.slug,
          featured: formData.featured,
          description: formData.description,
          hero_image_url: formData.hero_image_url,
          sort_order: formData.sort_order,
        };

        if (editingId) {
          const { error } = await supabase
            .from("featured_counties")
            .update(dataToSave)
            .eq("id", editingId);

          if (error) throw error;
          toast({ title: "Success", description: "County updated successfully" });
        } else {
          const { error } = await supabase
            .from("featured_counties")
            .insert([dataToSave]);

          if (error) throw error;
          toast({ title: "Success", description: "County added successfully" });
        }
        fetchCounties();
      }

      setEditingId(null);
      setIsAddingNew(false);
      setFormData({
        name: "",
        state: "",
        slug: "",
        featured: true,
        description: "",
        hero_image_url: "",
        sort_order: 0,
      });
    } catch (error) {
      console.error(`Error saving ${locationType}:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${locationType}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, type: "city" | "county") => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const table = type === "city" ? "featured_cities" : "featured_counties";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `${type === "city" ? "City" : "County"} deleted successfully` 
      });
      
      if (type === "city") {
        fetchCities();
      } else {
        fetchCounties();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    }
  };

  const startEditCity = (city: FeaturedCity) => {
    setEditingId(city.id);
    setLocationType("city");
    setFormData({
      name: city.city_name,
      state: city.state,
      slug: city.slug,
      featured: city.featured,
      description: city.description || "",
      hero_image_url: city.hero_image_url || "",
      sort_order: city.sort_order,
    });
  };

  const startEditCounty = (county: FeaturedCounty) => {
    setEditingId(county.id);
    setLocationType("county");
    setFormData({
      name: county.county_name,
      state: county.state,
      slug: county.slug,
      featured: county.featured,
      description: county.description || "",
      hero_image_url: county.hero_image_url || "",
      sort_order: county.sort_order,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({
      name: "",
      state: "",
      slug: "",
      featured: true,
      description: "",
      hero_image_url: "",
      sort_order: 0,
    });
  };

  const startAddNew = (type: "city" | "county") => {
    setLocationType(type);
    setIsAddingNew(true);
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Featured Cities and Counties</h1>
        </div>

        <Tabs defaultValue="cities" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="counties">Counties</TabsTrigger>
          </TabsList>

          <TabsContent value="cities">
            <div className="mb-6 flex justify-end">
              {!isAddingNew && (
                <Button onClick={() => startAddNew("city")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add City
                </Button>
              )}
            </div>

            {isAddingNew && locationType === "city" && (
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
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
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
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
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
                        onClick={() => startEditCity(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(city.id, "city")}
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
          </TabsContent>

          <TabsContent value="counties">
            <div className="mb-6 flex justify-end">
              {!isAddingNew && (
                <Button onClick={() => startAddNew("county")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add County
                </Button>
              )}
            </div>

            {isAddingNew && locationType === "county" && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add New County</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="county_name">County Name</Label>
                      <Input
                        id="county_name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
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
              {counties.map((county) => (
                <Card key={county.id}>
                  <CardContent className="pt-6">
                    {editingId === county.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`edit_county_name_${county.id}`}>
                              County Name
                            </Label>
                            <Input
                              id={`edit_county_name_${county.id}`}
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit_state_${county.id}`}>State</Label>
                            <Input
                              id={`edit_state_${county.id}`}
                              value={formData.state}
                              onChange={(e) =>
                                setFormData({ ...formData, state: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit_slug_${county.id}`}>Slug</Label>
                            <Input
                              id={`edit_slug_${county.id}`}
                              value={formData.slug}
                              onChange={(e) =>
                                setFormData({ ...formData, slug: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit_sort_order_${county.id}`}>
                              Sort Order
                            </Label>
                            <Input
                              id={`edit_sort_order_${county.id}`}
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
                          <Label htmlFor={`edit_hero_image_url_${county.id}`}>
                            Hero Image URL
                          </Label>
                          <Input
                            id={`edit_hero_image_url_${county.id}`}
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
                          <Label htmlFor={`edit_description_${county.id}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`edit_description_${county.id}`}
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
                            id={`edit_featured_${county.id}`}
                            checked={formData.featured}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, featured: checked })
                            }
                          />
                          <Label htmlFor={`edit_featured_${county.id}`}>
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
                            {county.county_name}, {county.state}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Slug: {county.slug} | Order: {county.sort_order}
                          </p>
                          {county.description && (
                            <p className="mt-2 text-sm">{county.description}</p>
                          )}
                          <p className="mt-2 text-sm">
                            Status:{" "}
                            <span
                              className={
                                county.featured ? "text-green-600" : "text-red-600"
                              }
                            >
                              {county.featured ? "Featured" : "Not Featured"}
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditCounty(county)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(county.id, "county")}
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
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
