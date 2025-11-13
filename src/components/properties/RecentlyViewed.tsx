import { useRecentlyViewedProperties } from "@/hooks/useRecentlyViewedProperties";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

interface RecentlyViewedProps {
  limit?: number;
  showClearButton?: boolean;
  className?: string;
}

export function RecentlyViewed({ 
  limit = 5, 
  showClearButton = true,
  className = "" 
}: RecentlyViewedProps) {
  const { recentProperties, clearRecentlyViewed } = useRecentlyViewedProperties();

  if (recentProperties.length === 0) {
    return null;
  }

  const displayProperties = recentProperties.slice(0, limit);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Recently Viewed</h2>
        </div>
        {showClearButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentlyViewed}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {displayProperties.map((property) => (
          <PropertyCard
            key={property.mlsNumber}
            id={property.id}
            mlsNumber={property.mlsNumber}
            title={property.title}
            price={property.price}
            image={property.image}
            beds={property.beds}
            baths={property.baths}
            sqft={property.sqft}
            address={property.address}
            city={property.city}
            state={property.state}
            zipCode={property.zipCode}
          />
        ))}
      </div>
    </div>
  );
}
