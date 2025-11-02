import { Button } from "@/components/ui/button";
import { FileText, MapPin, Calendar, Info } from "lucide-react";

interface PropertyNavigationProps {
  onNavigate: (section: string) => void;
  className?: string;
}

export const PropertyNavigation = ({ onNavigate, className = "" }: PropertyNavigationProps) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "features", label: "Facts & Features", icon: FileText },
    { id: "map", label: "Map & Directions", icon: MapPin },
    { id: "request-showing", label: "Request Showing", icon: Calendar },
  ];

  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant="outline"
            size="sm"
            onClick={() => onNavigate(item.id)}
            className="whitespace-nowrap"
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};
