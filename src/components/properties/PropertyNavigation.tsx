import { Button } from "@/components/ui/button";
import { FileText, MapPin, Calendar, Info, Home } from "lucide-react";
import { useState, useEffect } from "react";

interface PropertyNavigationProps {
  onNavigate: (section: string) => void;
  className?: string;
}

export const PropertyNavigation = ({ onNavigate, className = "" }: PropertyNavigationProps) => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSticky, setIsSticky] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "features", label: "Facts & Features", icon: FileText },
    { id: "map", label: "Map & Directions", icon: MapPin },
    { id: "request-showing", label: "Request Showing", icon: Calendar },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
      
      // Determine active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`${
        isSticky 
          ? "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b shadow-md" 
          : "relative"
      } transition-all duration-300 ${className}`}
    >
      <div className={`${isSticky ? "container mx-auto px-4 py-3" : ""} flex gap-2 overflow-x-auto ${isSticky ? "" : "pb-2"}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onNavigate(item.id);
                setActiveSection(item.id);
              }}
              className="whitespace-nowrap transition-all"
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
