import { Button } from "@/components/ui/button";
import { usePropertyComparison } from "@/hooks/usePropertyComparison";
import { RepliersProperty } from "@/types/repliers";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";

interface CompareButtonProps {
  property: RepliersProperty;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const CompareButton = ({ 
  property, 
  variant = "outline", 
  size = "sm",
  className = ""
}: CompareButtonProps) => {
  const { 
    addProperty, 
    removeProperty, 
    isPropertySelected, 
    canAddMore 
  } = usePropertyComparison();

  const isSelected = isPropertySelected(property.mlsNumber);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSelected) {
      removeProperty(property.mlsNumber);
      toast.success("Removed from comparison");
    } else {
      if (!canAddMore()) {
        toast.error("Maximum 4 properties can be compared");
        return;
      }
      const added = addProperty(property);
      if (added) {
        toast.success("Added to comparison");
      }
    }
  };

  return (
    <Button
      variant={isSelected ? "default" : variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {isSelected ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Added
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1" />
          Compare
        </>
      )}
    </Button>
  );
};
