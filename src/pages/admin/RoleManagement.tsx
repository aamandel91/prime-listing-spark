import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, UserPlus, Trash2, Search } from "lucide-react";
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

export default function RoleManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "editor" | "user">("user");
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  // Fetch all user roles with user info
  const { data: userRoles, isLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;

      // Fetch user emails from auth.users via RPC or separate query
      // Note: We'll need to create a view or use service role to get emails
      return data || [];
    },
  });

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      // First, get user by email (requires admin permissions)
      const { data, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) throw new Error("Failed to fetch users. Admin permissions required.");
      
      const users = data?.users || [];
      const user = users.find(u => u.email === email);
      if (!user) throw new Error("User not found with that email");

      // Insert role
      const { error } = await supabase.from("user_roles").insert({
        user_id: user.id,
        role: role as any,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      setNewUserEmail("");
      toast({ title: "Role added successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to add role", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      setDeleteRoleId(null);
      toast({ title: "Role removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove role", variant: "destructive" });
    },
  });

  const handleAddRole = () => {
    if (!newUserEmail.trim()) {
      toast({ title: "Please enter a user email", variant: "destructive" });
      return;
    }
    addRoleMutation.mutate({ email: newUserEmail, role: newUserRole });
  };

  const filteredRoles = userRoles?.filter(role => 
    role.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Role Management
          </h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>

        {/* Add Role Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add User Role
            </CardTitle>
            <CardDescription>
              Grant roles to users by their email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAddRole}
                disabled={addRoleMutation.isPending}
              >
                Add Role
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Roles List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Roles</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Loading roles...
                      </TableCell>
                    </TableRow>
                  ) : filteredRoles && filteredRoles.length > 0 ? (
                    filteredRoles.map((roleEntry) => (
                      <TableRow key={roleEntry.id}>
                        <TableCell className="font-mono text-sm">
                          {roleEntry.user_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(roleEntry.role)}>
                            {roleEntry.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(roleEntry.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteRoleId(roleEntry.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No roles found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRoleId} onOpenChange={() => setDeleteRoleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this role? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRoleId && deleteRoleMutation.mutate(deleteRoleId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
