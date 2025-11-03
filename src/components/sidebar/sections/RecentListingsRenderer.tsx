import { RecentListingsSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRepliers } from "@/hooks/useRepliers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentListingsRendererProps {
  section: RecentListingsSection;
  context?: {
    city?: string;
    state?: string;
  };
}

export function RecentListingsRenderer({ section, context }: RecentListingsRendererProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const repliers = useRepliers();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await repliers.searchListings({
          city: section.city || context?.city,
          state: section.state || context?.state || 'FL',
          limit: section.limit || 5,
          sort: 'date'
        });
        
        setProperties(response.listings?.slice(0, section.limit || 5) || []);
      } catch (error) {
        console.error('Error fetching recent listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [section.city, section.state, section.limit, context]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{section.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {properties.map((property) => (
          <Link
            key={property.listingId}
            to={`/properties/${property.listingId}`}
            className="block p-2 rounded hover:bg-muted transition-colors"
          >
            <p className="font-semibold text-sm line-clamp-2">
              {property.address?.full || 'Property'}
            </p>
            <p className="text-lg font-bold text-primary">
              ${property.listPrice?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {property.property?.bedrooms || 0} bd • {property.property?.bathsFull || 0} ba
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
