import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, MapPin, Map, Building2, DollarSign } from "lucide-react";
import SearchDropdown from "./SearchDropdown";
import CitiesDropdown from "./CitiesDropdown";
import CountiesDropdown from "./CountiesDropdown";
import PropertyTypeDropdown from "./PropertyTypeDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const leftLinks = [
    { to: "/sell", label: "Sell", icon: DollarSign },
  ];

  const rightLinks = [
    { to: "/blog", label: "Blog" },
    { to: "/login", label: "Login/Register" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <SearchDropdown />
            <CitiesDropdown />
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
            <div className="w-10 h-10 bg-gradient-premium rounded-lg flex items-center justify-center shadow-medium transition-transform group-hover:scale-105">
              <Home className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-primary whitespace-nowrap">Florida Home Finder</span>
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
                <span className="text-foreground">Property Type</span>
              </Link>
              {leftLinks.map((link) => (
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
