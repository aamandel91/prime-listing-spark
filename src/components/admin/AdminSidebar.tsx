import { NavLink, useLocation } from "react-router-dom";
import {
  Settings,
  Users,
  FileText,
  MapPin,
  Home,
  BarChart3,
  Search,
  Building2,
  Upload,
  Shield,
  Globe,
  Layout,
  Star,
  TrendingUp,
  Mail,
  BookOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuSections = [
  {
    label: "Site Management",
    items: [
      { title: "Global Settings", url: "/admin/global-site-settings", icon: Settings },
      { title: "Layout Settings", url: "/admin/site-layout-settings", icon: Layout },
      { title: "SEO Settings", url: "/admin/seo-settings", icon: Search },
    ],
  },
  {
    label: "Content & Pages",
    items: [
      { title: "Featured Cities", url: "/admin/featured-cities", icon: MapPin },
      { title: "Property Type Pages", url: "/admin/property-type-pages", icon: Home },
      { title: "Blog Posts", url: "/admin/blog-migration", icon: BookOpen },
      { title: "Location Import", url: "/admin/location-import", icon: Upload },
    ],
  },
  {
    label: "Listings",
    items: [
      { title: "Extract Data", url: "/admin/listing-data-extractor", icon: Building2 },
      { title: "Enhancements", url: "/admin/listing-enhancements", icon: Star },
    ],
  },
  {
    label: "Users & Leads",
    items: [
      { title: "Leads Management", url: "/admin/leads", icon: Mail },
      { title: "User Roles", url: "/admin/role-management", icon: Shield },
    ],
  },
  {
    label: "Analytics & Tools",
    items: [
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
      { title: "Competitor Analysis", url: "/admin/competitor-analysis", icon: TrendingUp },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4 border-b">
          {!collapsed && (
            <h2 className="text-lg font-bold text-primary">Admin CMS</h2>
          )}
        </div>

        {menuSections.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs uppercase text-muted-foreground">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={getNavCls}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={collapsed ? "h-5 w-5" : "mr-3 h-4 w-4"} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
