import { FeaturedPropertiesSection } from "@/types/sidebarSections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRepliers } from "@/hooks/useRepliers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import OptimizedImage from "@/components/OptimizedImage";

interface FeaturedPropertiesRendererProps {
  section: FeaturedPropertiesSection;
  context?: {
    city?: string;
    state?: string;
  };
}

export function FeaturedPropertiesRenderer({ section, context }: FeaturedPropertiesRendererProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const repliers = useRepliers();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const criteria = section.searchCriteria || {
          city: context?.city,
          state: context?.state || 'FL',
          limit: section.limit || 3,
          sort: 'date'
        };

        const response = await repliers.searchListings(criteria);
        setProperties(response.listings?.slice(0, section.limit || 3) || []);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [section.searchCriteria, section.limit, context]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{section.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
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
      <CardContent className="space-y-4">
        {properties.map((property) => (
          <Link
            key={property.listingId}
            to={`/properties/${property.listingId}`}
            className="block group"
          >
            <div className="flex gap-3">
              {property.photos?.[0]?.href && (
                <OptimizedImage
                  src={property.photos[0].href}
                  alt={property.address?.full || 'Property'}
                  className="rounded"
                  width={96}
                  height={96}
                  sizes="96px"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                  {property.address?.full || 'Property'}
                </p>
                <p className="text-lg font-bold text-primary">
                  ${property.listPrice?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {property.property?.bedrooms || 0} bd • {property.property?.bathsFull || 0} ba
                  {property.property?.area && ` • ${property.property.area.toLocaleString()} sqft`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
