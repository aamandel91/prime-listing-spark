import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, MapPin, Building2, BookOpen, Phone } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/listings", label: "Search Listings", icon: Search },
    { to: "/cities", label: "Cities", icon: MapPin },
    { to: "/neighborhoods", label: "Neighborhoods", icon: Building2 },
    { to: "/blog", label: "Blog", icon: BookOpen },
    { to: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-premium rounded-lg flex items-center justify-center shadow-medium transition-transform group-hover:scale-105">
              <Home className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Premier Properties</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-medium">
              List Your Property
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <link.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{link.label}</span>
                </Link>
              ))}
              <Button className="mx-4 mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                List Your Property
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
