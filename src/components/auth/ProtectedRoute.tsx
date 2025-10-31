import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "admin" | "editor";
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        // If no specific role required, just being authenticated is enough
        if (!requireRole) {
          setHasRole(true);
          setLoading(false);
          return;
        }

        // Check if user has required role
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error checking roles:", error);
          setLoading(false);
          return;
        }

        const userRoles = roles?.map(r => r.role) || [];
        
        // Admin can access everything
        if (userRoles.includes("admin")) {
          setHasRole(true);
        } else if (requireRole === "editor" && userRoles.includes("editor")) {
          setHasRole(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in auth check:", error);
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setHasRole(false);
      } else {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [requireRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole && !hasRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
            {requireRole && ` This page requires ${requireRole} role.`}
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
