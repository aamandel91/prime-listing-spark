import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Save, X, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Agent {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  license_number: string;
  bio: string | null;
  specialties: string[] | null;
  years_experience: number | null;
  profile_image_url: string | null;
  subdomain: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
}

export default function AgentManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    license_number: "",
    bio: "",
    specialties: "",
    years_experience: "",
    profile_image_url: "",
    subdomain: "",
    featured: false,
    active: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    checkUserRole();
    fetchAgents();
  }, []);

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setCurrentUserId(session.user.id);
      
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      
      const userRoles = roles?.map(r => r.role) || [];
      if (userRoles.includes("admin")) {
        setUserRole("admin");
      } else if (userRoles.includes("agent")) {
        setUserRole("agent");
      }
    }
  };

  const fetchAgents = async () => {
    try {
      let query = supabase
        .from("agents")
        .select("*");
      
      // If user is an agent, only show their own profile
      if (userRole === "agent" && currentUserId) {
        query = query.eq("user_id", currentUserId);
      }
      
      const { data, error } = await query.order("sort_order", { ascending: true });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const agentData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        license_number: formData.license_number,
        bio: formData.bio || null,
        specialties: formData.specialties ? formData.specialties.split(",").map(s => s.trim()) : null,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        profile_image_url: formData.profile_image_url || null,
        subdomain: formData.subdomain || null,
        featured: formData.featured,
        active: formData.active,
        sort_order: formData.sort_order,
      };

      if (editingAgent) {
        const { error } = await supabase
          .from("agents")
          .update(agentData)
          .eq("id", editingAgent.id);

        if (error) throw error;
        toast({ title: "Success", description: "Agent updated successfully" });
      } else {
        const { error } = await supabase
          .from("agents")
          .insert([agentData]);

        if (error) throw error;
        toast({ title: "Success", description: "Agent created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchAgents();
    } catch (error: any) {
      console.error("Error saving agent:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save agent",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      full_name: agent.full_name,
      email: agent.email,
      phone: agent.phone || "",
      license_number: agent.license_number,
      bio: agent.bio || "",
      specialties: agent.specialties?.join(", ") || "",
      years_experience: agent.years_experience?.toString() || "",
      profile_image_url: agent.profile_image_url || "",
      subdomain: agent.subdomain || "",
      featured: agent.featured,
      active: agent.active,
      sort_order: agent.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Agent deleted successfully" });
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingAgent(null);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      license_number: "",
      bio: "",
      specialties: "",
      years_experience: "",
      profile_image_url: "",
      subdomain: "",
      featured: false,
      active: true,
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
        <title>Agent Management | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{userRole === "agent" ? "My Profile" : "Agent Management"}</h1>
            <p className="text-muted-foreground mt-2">
              {userRole === "agent" ? "Manage your agent profile" : "Manage your real estate agents"}
            </p>
          </div>
          {userRole === "admin" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_number">License Number *</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subdomain">Subdomain</Label>
                    <Input
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                      placeholder="agent-name"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Agent's unique subdomain (e.g., john.yoursite.com)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="years_experience">Years Experience</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience}
                      onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="profile_image_url">Profile Image URL</Label>
                  <Input
                    id="profile_image_url"
                    value={formData.profile_image_url}
                    onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="Luxury Homes, First Time Buyers, Investors"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
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
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {editingAgent ? "Update" : "Create"} Agent
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          )}
        </div>

        <div className="grid gap-4">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {agent.profile_image_url && (
                      <img
                        src={agent.profile_image_url}
                        alt={agent.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{agent.full_name}</h3>
                      <p className="text-sm text-muted-foreground">License: {agent.license_number}</p>
                      <p className="text-sm">{agent.email}</p>
                      {agent.phone && <p className="text-sm">{agent.phone}</p>}
                      {agent.specialties && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {agent.specialties.map((specialty, i) => (
                            <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        {agent.featured && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                        {!agent.active && (
                          <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(agent)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {userRole === "admin" && (
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(agent.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {agents.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No agents found. Add your first agent to get started.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
