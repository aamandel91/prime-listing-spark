import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Enhancement {
  id: string;
  property_mls: string;
  office_id: string;
  floor_plans: Array<{ url: string; title: string; description?: string }>;
  video_embeds: Array<{ url: string; platform: string; title: string }>;
  documents: Array<{ url: string; title: string; type: string }>;
  created_at: string;
  updated_at: string;
}

export default function ListingEnhancements() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchMLS, setSearchMLS] = useState("");
  const [selectedEnhancement, setSelectedEnhancement] = useState<Enhancement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [propertyMLS, setPropertyMLS] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [floorPlans, setFloorPlans] = useState<Enhancement["floor_plans"]>([]);
  const [videoEmbeds, setVideoEmbeds] = useState<Enhancement["video_embeds"]>([]);
  const [documents, setDocuments] = useState<Enhancement["documents"]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch all enhancements
  const { data: enhancements, isLoading } = useQuery({
    queryKey: ["listing-enhancements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listing_enhancements")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Enhancement[];
    },
  });

  // Create/Update enhancement
  const saveMutation = useMutation({
    mutationFn: async (data: { property_mls: string; office_id: string; floor_plans?: any; video_embeds?: any; documents?: any }) => {
      if (selectedEnhancement) {
        const { error } = await supabase
          .from("listing_enhancements")
          .update(data)
          .eq("id", selectedEnhancement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("listing_enhancements")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing-enhancements"] });
      toast({ title: "Success", description: "Listing enhancement saved successfully" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete enhancement
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("listing_enhancements")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing-enhancements"] });
      toast({ title: "Success", description: "Listing enhancement deleted" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-enhancements")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("listing-enhancements")
        .getPublicUrl(filePath);

      toast({ title: "Success", description: "File uploaded successfully" });
      return publicUrl;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const loadEnhancement = (enhancement: Enhancement) => {
    setSelectedEnhancement(enhancement);
    setPropertyMLS(enhancement.property_mls);
    setOfficeId(enhancement.office_id);
    setFloorPlans(enhancement.floor_plans || []);
    setVideoEmbeds(enhancement.video_embeds || []);
    setDocuments(enhancement.documents || []);
    setIsCreating(false);
  };

  const resetForm = () => {
    setSelectedEnhancement(null);
    setPropertyMLS("");
    setOfficeId("");
    setFloorPlans([]);
    setVideoEmbeds([]);
    setDocuments([]);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!propertyMLS || !officeId) {
      toast({ title: "Error", description: "MLS number and Office ID are required", variant: "destructive" });
      return;
    }

    saveMutation.mutate({
      property_mls: propertyMLS,
      office_id: officeId,
      floor_plans: floorPlans,
      video_embeds: videoEmbeds,
      documents: documents,
    });
  };

  const filteredEnhancements = enhancements?.filter(e => 
    searchMLS ? e.property_mls.toLowerCase().includes(searchMLS.toLowerCase()) : true
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Listing Enhancements</h1>
          <p className="text-muted-foreground mt-2">
            Add floor plans, videos, and documents to your MLS listings
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreating(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Enhancement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Enhancements */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Enhancements</CardTitle>
            <CardDescription>
              <Input
                placeholder="Search by MLS..."
                value={searchMLS}
                onChange={(e) => setSearchMLS(e.target.value)}
                className="mt-2"
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <p>Loading...</p>
            ) : filteredEnhancements?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No enhancements found</p>
            ) : (
              <div className="space-y-2">
                {filteredEnhancements?.map((enhancement) => (
                  <div
                    key={enhancement.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                      selectedEnhancement?.id === enhancement.id ? "bg-accent" : ""
                    }`}
                    onClick={() => loadEnhancement(enhancement)}
                  >
                    <div className="font-medium">{enhancement.property_mls}</div>
                    <div className="text-sm text-muted-foreground">Office: {enhancement.office_id}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {enhancement.floor_plans.length} floor plans, {enhancement.video_embeds.length} videos
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhancement Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedEnhancement ? "Edit" : "Create"} Listing Enhancement</CardTitle>
            <CardDescription>
              {selectedEnhancement ? `Editing ${selectedEnhancement.property_mls}` : "Add media to a new listing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isCreating && !selectedEnhancement ? (
              <div className="text-center py-12 text-muted-foreground">
                Select an enhancement or create a new one
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mls">MLS Number *</Label>
                    <Input
                      id="mls"
                      value={propertyMLS}
                      onChange={(e) => setPropertyMLS(e.target.value)}
                      placeholder="Enter MLS number"
                      disabled={!!selectedEnhancement}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="office">Office ID *</Label>
                    <Input
                      id="office"
                      value={officeId}
                      onChange={(e) => setOfficeId(e.target.value)}
                      placeholder="Your office ID"
                    />
                  </div>
                </div>

                <Tabs defaultValue="floorplans" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="floorplans" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Floor Plans ({floorPlans.length})</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*,.pdf";
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) {
                                setFloorPlans([...floorPlans, { url, title: file.name, description: "" }]);
                              }
                            }
                          };
                          input.click();
                        }}
                        disabled={uploadingFile}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Floor Plan
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {floorPlans.map((plan, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-4 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <Input
                                placeholder="Title"
                                value={plan.title}
                                onChange={(e) => {
                                  const updated = [...floorPlans];
                                  updated[idx].title = e.target.value;
                                  setFloorPlans(updated);
                                }}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setFloorPlans(floorPlans.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Description (optional)"
                              value={plan.description || ""}
                              onChange={(e) => {
                                const updated = [...floorPlans];
                                updated[idx].description = e.target.value;
                                setFloorPlans(updated);
                              }}
                              rows={2}
                            />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ExternalLink className="h-3 w-3" />
                              <a href={plan.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                {plan.url}
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="videos" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Video Embeds ({videoEmbeds.length})</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setVideoEmbeds([...videoEmbeds, { url: "", platform: "youtube", title: "" }])}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Video
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {videoEmbeds.map((video, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-4 space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Title"
                                value={video.title}
                                onChange={(e) => {
                                  const updated = [...videoEmbeds];
                                  updated[idx].title = e.target.value;
                                  setVideoEmbeds(updated);
                                }}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setVideoEmbeds(videoEmbeds.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              placeholder="YouTube or Vimeo embed URL"
                              value={video.url}
                              onChange={(e) => {
                                const updated = [...videoEmbeds];
                                updated[idx].url = e.target.value;
                                updated[idx].platform = e.target.value.includes("vimeo") ? "vimeo" : "youtube";
                                setVideoEmbeds(updated);
                              }}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Documents ({documents.length})</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf,.doc,.docx";
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) {
                                setDocuments([...documents, { url, title: file.name, type: file.type }]);
                              }
                            }
                          };
                          input.click();
                        }}
                        disabled={uploadingFile}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {documents.map((doc, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-4 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <Input
                                placeholder="Title"
                                value={doc.title}
                                onChange={(e) => {
                                  const updated = [...documents];
                                  updated[idx].title = e.target.value;
                                  setDocuments(updated);
                                }}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ExternalLink className="h-3 w-3" />
                              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                                {doc.url}
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save Enhancement"}
                  </Button>
                  {selectedEnhancement && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this enhancement?")) {
                          deleteMutation.mutate(selectedEnhancement.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
