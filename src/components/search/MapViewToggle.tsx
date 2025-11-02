import { useState } from "react";
import { Map as MapIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapViewToggleProps {
  view: "list" | "map";
  onViewChange: (view: "list" | "map") => void;
  className?: string;
}

export const MapViewToggle = ({ view, onViewChange, className }: MapViewToggleProps) => {
  return (
    <div className={cn("inline-flex rounded-md border bg-background p-1", className)}>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className={cn(
          "h-8 px-4 gap-2",
          view === "list" && "shadow-sm"
        )}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
      <Button
        variant={view === "map" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("map")}
        className={cn(
          "h-8 px-4 gap-2",
          view === "map" && "shadow-sm"
        )}
      >
        <MapIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Map</span>
      </Button>
    </div>
  );
};
