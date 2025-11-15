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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">More Listings in {city}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            More Active Listings in {city}
          </h2>
          <p className="text-base text-muted-foreground">
            Explore other available properties in the area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((property) => (
            <PropertyCard 
              key={property.mlsNumber}
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
          ))}
        </div>
      </div>
    </section>
  );
};
