import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  MapPin, 
  FileText, 
  Users, 
  BarChart3, 
  Search,
  Home,
  Building2,
  Upload,
  Shield,
  Globe,
  ChevronDown,
  Sparkles,
  Link2,
  PenTool,
} from "lucide-react";

export const AdminMenu = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Admin
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Site Management
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate('/admin/global-site-settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Global Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/site-layout-settings')}>
          <Globe className="mr-2 h-4 w-4" />
          Layout Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/seo-settings')}>
          <Search className="mr-2 h-4 w-4" />
          SEO Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Content Management
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate('/admin/featured-cities')}>
          <MapPin className="mr-2 h-4 w-4" />
          Featured Cities
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/location-import')}>
          <Upload className="mr-2 h-4 w-4" />
          Location Import
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/listing-data-extractor')}>
          <Building2 className="mr-2 h-4 w-4" />
          Extract Listings Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/property-type-pages')}>
          <Home className="mr-2 h-4 w-4" />
          Property Type Pages
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/neighborhood-pages')}>
          <MapPin className="mr-2 h-4 w-4" />
          Neighborhood Pages
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          AI Content Generation
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate('/admin/content-strategy')}>
          <Sparkles className="mr-2 h-4 w-4" />
          Content Strategy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/blog-content-generator')}>
          <PenTool className="mr-2 h-4 w-4" />
          Blog Generator
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/internal-linking')}>
          <Link2 className="mr-2 h-4 w-4" />
          Internal Linking
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Listings & Blogs
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate('/admin/listing-enhancements')}>
          <FileText className="mr-2 h-4 w-4" />
          Listing Enhancements
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/blog-migration')}>
          <FileText className="mr-2 h-4 w-4" />
          Blog Migration
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Analytics & Users
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate('/admin/leads')}>
          <Users className="mr-2 h-4 w-4" />
          Leads Management
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/analytics')}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/role-management')}>
          <Shield className="mr-2 h-4 w-4" />
          Role Management
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/competitor-analysis')}>
          <Search className="mr-2 h-4 w-4" />
          Competitor Analysis
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
