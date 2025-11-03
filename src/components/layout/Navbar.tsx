import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LogOut, User, MapPin, Map, Building2, DollarSign, Search } from "lucide-react";
import SearchDropdown from "./SearchDropdown";
import CountiesDropdown from "./CountiesDropdown";
import PropertyTypeDropdown from "./PropertyTypeDropdown";
import { AdminMenu } from "./AdminMenu";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const siteName = settings?.siteName || "Florida Home Finder";

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  const leftLinks = [
    { to: "/sell", label: "Sell" },
  ];

  const rightLinks = [
    { to: "/agents", label: "Agents" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <SearchDropdown />
            <Link to="/cities">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Cities
              </Button>
            </Link>
            <CountiesDropdown />
            <PropertyTypeDropdown />
            {leftLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Centered Logo */}
          <Link to="/" className="flex items-center space-x-2 group absolute left-1/2 transform -translate-x-1/2">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={siteName}
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-premium rounded-lg flex items-center justify-center shadow-medium transition-transform group-hover:scale-105">
                  <Home className="w-6 h-6 text-accent-foreground" />
                </div>
                <span className="text-xl font-bold text-primary whitespace-nowrap">{siteName}</span>
              </>
            )}
          </Link>

          {/* Right Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {rightLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  {link.label}
                </Button>
              </Link>
            ))}
            
            {!loading && (
              user ? (
                <>
                  <AdminMenu />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="default">
                    Sign In
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors ml-auto"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              <Link
                to="/advanced-search"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Search</span>
              </Link>
              <Link
                to="/cities"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Cities</span>
              </Link>
              <Link
                to="/counties"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Map className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Counties</span>
              </Link>
              <Link
                to="/property-types"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Property Types</span>
              </Link>
              <Link
                to="/sell"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Sell</span>
              </Link>
              <div className="border-t border-border my-2" />
              {rightLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <span className="text-foreground">{link.label}</span>
                </Link>
              ))}
              
              {!loading && (
                user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-left w-full"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Sign Out ({user.email})</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Sign In</span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
