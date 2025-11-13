import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Home, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface CityNeighborhoodsProps {
  city?: string;
  state?: string;
  title?: string;
}

export function CityNeighborhoods({ 
  city, 
  state = 'FL',
  title = "Popular Neighborhoods"
}: CityNeighborhoodsProps) {
  const { data: neighborhoods, isLoading } = useQuery({
    queryKey: ['featured-neighborhoods', city, state],
    queryFn: async () => {
      if (!city) return [];
      
      let query = supabase
        .from('featured_neighborhoods')
        .select('*')
        .eq('featured', true)
        .eq('state', state);
      
      if (city) {
        query = query.eq('city', city);
      }
      
      query = query.order('sort_order');
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!city,
  });

  if (!city || isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!neighborhoods || neighborhoods.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {neighborhoods.map((neighborhood) => (
          <Link
            key={neighborhood.id}
            to={`/neighborhoods/${neighborhood.slug}`}
            className="block group"
          >
            <Card className="p-6 h-full hover:shadow-lg transition-all hover:border-primary/50">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {neighborhood.name}
                  </h4>
                  {neighborhood.zipcode && (
                    <p className="text-sm text-muted-foreground">
                      {neighborhood.zipcode}
                    </p>
                  )}
                </div>

                {neighborhood.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {neighborhood.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <Home className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Properties</p>
                      <p className="text-sm font-semibold">
                        {neighborhood.property_count?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  {neighborhood.avg_price && (
                    <div className="flex items-center gap-2">
                      <div className="bg-green-600/10 text-green-600 dark:text-green-400 p-2 rounded-full">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Price</p>
                        <p className="text-sm font-semibold">
                          {formatPrice(Number(neighborhood.avg_price))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {neighborhoods.length > 0 && (
        <div className="text-center">
          <Link
            to={`/neighborhoods?city=${city}`}
            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            View all neighborhoods in {city}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
