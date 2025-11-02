import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PropertyCard from "./PropertyCard";
import { useRepliers } from "@/hooks/useRepliers";
import { RepliersProperty } from "@/types/repliers";

interface CommunityListingsProps {
  city: string;
  state: string;
  currentMlsNumber: string;
  className?: string;
}

export const CommunityListings = ({ 
  city, 
  state, 
  currentMlsNumber, 
  className = "" 
}: CommunityListingsProps) => {
  const { searchListings } = useRepliers();
  const [listings, setListings] = useState<RepliersProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityListings = async () => {
      try {
        setLoading(true);
        const response = await searchListings({
          city,
          state,
          status: "Active",
          limit: 12,
        });

        // Filter out current property
        const filtered = (response.listings || []).filter(
          (listing: RepliersProperty) => listing.mlsNumber !== currentMlsNumber
        );
        setListings(filtered.slice(0, 6));
      } catch (error) {
        console.error("Error fetching community listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (city && state) {
      fetchCommunityListings();
    }
  }, [city, state, currentMlsNumber]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>More Listings in {city}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>More Active Listings in {city}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore other available properties in the area
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {listings.map((property) => (
              <div key={property.mlsNumber} className="flex-none w-[320px]">
                <PropertyCard 
                  id={property.mlsNumber}
                  title={property.address.fullAddress || `${property.address.streetNumber} ${property.address.streetName}`}
                  price={property.listPrice}
                  image={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
                  beds={property.details.numBedrooms}
                  baths={property.details.numBathrooms}
                  sqft={typeof property.details.sqft === 'string' ? parseInt(property.details.sqft) : property.details.sqft}
                  address={property.address.fullAddress || `${property.address.streetNumber} ${property.address.streetName}`}
                  city={property.address.city}
                  state={property.address.state}
                  zipCode={property.address.zip}
                  mlsNumber={property.mlsNumber}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
