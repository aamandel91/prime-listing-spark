import { NeighborhoodsSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

interface NeighborhoodsRendererProps {
  section: NeighborhoodsSection;
  context?: {
    city?: string;
    state?: string;
  };
}

export function NeighborhoodsRenderer({ section, context }: NeighborhoodsRendererProps) {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      let query = supabase
        .from("featured_neighborhoods")
        .select("*")
        .eq("featured", true);

      const city = section.city || context?.city;
      const state = section.state || context?.state || 'FL';

      if (city) {
        query = query.eq("city", city);
      }
      if (state) {
        query = query.eq("state", state);
      }

      query = query.order("sort_order").limit(section.limit || 5);

      const { data } = await query;
      setNeighborhoods(data || []);
    };

    fetchNeighborhoods();
  }, [section.city, section.state, section.limit, context]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {neighborhoods.map((neighborhood) => (
          <Link
            key={neighborhood.id}
            to={`/neighborhoods/${neighborhood.slug}`}
            className="flex items-start gap-3 p-2 rounded hover:bg-muted transition-colors"
          >
            {section.showImages && neighborhood.hero_image_url ? (
              <OptimizedImage
                src={neighborhood.hero_image_url}
                alt={neighborhood.name}
                className="rounded"
                width={64}
                height={64}
                sizes="64px"
              />
            ) : (
              <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm line-clamp-1">{neighborhood.name}</p>
              {neighborhood.city && (
                <p className="text-xs text-muted-foreground">{neighborhood.city}, {neighborhood.state}</p>
              )}
              {neighborhood.property_count > 0 && (
                <p className="text-xs text-muted-foreground">
                  {neighborhood.property_count} properties
                </p>
              )}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
