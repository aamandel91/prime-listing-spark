import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepliersPlaces, groupPlacesByCategory } from "@/hooks/useRepliersPlaces";
import { 
  MapPin, 
  School, 
  ShoppingCart, 
  Coffee, 
  Utensils,
  Hospital,
  Bus,
  TreePine,
  Dumbbell,
  Info
} from "lucide-react";

interface NearbyPlacesProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const categoryIcons: Record<string, typeof MapPin> = {
  "Schools": School,
  "Shopping": ShoppingCart,
  "Dining": Utensils,
  "Cafes": Coffee,
  "Healthcare": Hospital,
  "Transit": Bus,
  "Parks": TreePine,
  "Fitness": Dumbbell,
};

export const NearbyPlaces = ({ latitude, longitude, className = "" }: NearbyPlacesProps) => {
  const { places, loading, error } = useRepliersPlaces(latitude, longitude);
  const groupedPlaces = groupPlacesByCategory(places);

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Nearby Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Nearby Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="w-4 h-4" />
            <p className="text-sm">Unable to load nearby places</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (places.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Nearby Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No nearby amenities found for this location.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Nearby Amenities</CardTitle>
        <p className="text-sm text-muted-foreground">
          Discover what's around this property
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedPlaces).map(([category, categoryPlaces]) => {
          const Icon = categoryIcons[category] || MapPin;
          
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">{category}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {categoryPlaces.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {categoryPlaces.slice(0, 5).map((place, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{place.name}</p>
                      {place.address && (
                        <p className="text-xs text-muted-foreground mt-1">{place.address}</p>
                      )}
                      {place.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">
                            ⭐ {place.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
                      <MapPin className="w-3 h-3" />
                      {formatDistance(place.distance)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
