import { Home, Building2, Castle, Trees, Warehouse, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface PropertyTypeSelectorProps {
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
  className?: string;
}

const propertyTypes = [
  { value: "Residential", label: "House", icon: Home },
  { value: "Condominium", label: "Condo", icon: Building2 },
  { value: "Townhouse", label: "Townhouse", icon: Castle },
  { value: "Land", label: "Land", icon: Trees },
  { value: "Commercial", label: "Commercial", icon: Warehouse },
  { value: "Multi-Family", label: "Multi-Family", icon: Hotel },
];

export const PropertyTypeSelector = ({
  selectedTypes,
  onSelectionChange,
  className = "",
}: PropertyTypeSelectorProps) => {
  const toggleType = (value: string) => {
    if (selectedTypes.includes(value)) {
      onSelectionChange(selectedTypes.filter((t) => t !== value));
    } else {
      onSelectionChange([...selectedTypes, value]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">Property Type</label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {propertyTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedTypes.includes(type.value);
          
          return (
            <Card
              key={type.value}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                "flex flex-col items-center justify-center p-4 gap-2",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background hover:bg-accent"
              )}
              onClick={() => toggleType(type.value)}
            >
              <Icon className={cn("w-6 h-6", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
              <span className="text-xs font-medium text-center">{type.label}</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
