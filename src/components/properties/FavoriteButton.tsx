import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoriteProperties } from "@/hooks/useFavoriteProperties";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyMls: string;
  propertyData: any;
  price: number;
  className?: string;
  variant?: "default" | "ghost" | "outline";
}

export const FavoriteButton = ({ 
  propertyMls, 
  propertyData, 
  price, 
  className,
  variant = "ghost" 
}: FavoriteButtonProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteProperties();
  const favorited = isFavorite(propertyMls);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorited) {
      await removeFavorite(propertyMls);
    } else {
      await addFavorite(propertyMls, propertyData, price);
    }
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggle}
      className={cn(className)}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={cn(
          "h-5 w-5 transition-colors",
          favorited ? "fill-red-500 text-red-500" : "text-gray-600"
        )} 
      />
    </Button>
  );
};
