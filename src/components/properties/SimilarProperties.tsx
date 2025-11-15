import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "./PropertyCard";
import { useRepliers } from "@/hooks/useRepliers";
import { useRepliersSimilar } from "@/hooks/useRepliersSimilar";
import { RepliersProperty } from "@/types/repliers";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Home, Sparkles } from "lucide-react";

interface SimilarPropertiesProps {
  currentProperty: RepliersProperty;
  className?: string;
}

export const SimilarProperties = ({ currentProperty, className = "" }: SimilarPropertiesProps) => {
  const { searchListings } = useRepliers();
  
  // Try to use the Repliers Similar API first
  const { listings: apiSimilarListings, loading: apiLoading } = useRepliersSimilar(currentProperty.mlsNumber);
  
  const [similarActive, setSimilarActive] = useState<RepliersProperty[]>([]);
  const [soldComparables, setSoldComparables] = useState<RepliersProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApiResults, setUseApiResults] = useState(false);

  // Check if API returned good results
  useEffect(() => {
    if (!apiLoading && apiSimilarListings.length > 0) {
      setUseApiResults(true);
      setLoading(false);
    }
  }, [apiLoading, apiSimilarListings]);

  useEffect(() => {
    // If API didn't return results or is still loading, fall back to manual search
    if (apiLoading || useApiResults) return;

    const fetchSimilarProperties = async () => {
      try {
        setLoading(true);

        // Search parameters for similar properties
        const baseParams = {
          city: currentProperty.address.city,
          state: currentProperty.address.state,
          propertyType: currentProperty.details.propertyType,
          minBeds: currentProperty.details.numBedrooms,
          baths: currentProperty.details.numBathrooms,
          limit: 6,
        };

        // Calculate price range (±10%)
        const priceVariance = currentProperty.listPrice * 0.10;
        const minPrice = Math.floor(currentProperty.listPrice - priceVariance);
        const maxPrice = Math.ceil(currentProperty.listPrice + priceVariance);

        // Fetch similar active listings
        const activeResponse = await searchListings({
          ...baseParams,
          status: "Active",
          minPrice,
          maxPrice,
        });

        // Filter out the current property
        const filteredActive = (activeResponse.listings || []).filter(
          (listing: RepliersProperty) => listing.mlsNumber !== currentProperty.mlsNumber
        );
        setSimilarActive(filteredActive.slice(0, 6));

        // Fetch sold comparables - Note: API doesn't support 'S' status
        // Filter by standardStatus='Closed' on the client-side instead
        const soldResponse = await searchListings({
          ...baseParams,
          // status: "Sold", // Removed - not supported by API
          minPrice,
          maxPrice,
        });
        
        // Filter for sold/closed properties from the response
        const soldListings = (soldResponse.listings || []).filter(
          (listing) => listing.standardStatus?.toLowerCase().includes('closed') || 
                      listing.standardStatus?.toLowerCase().includes('sold')
        );

        setSoldComparables(soldListings.slice(0, 6));
      } catch (error) {
        console.error("Error fetching similar properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentProperty, apiLoading, useApiResults]);

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Use API results if available, otherwise use manual search results
  const displayListings = useApiResults 
    ? apiSimilarListings.filter(listing => listing.mlsNumber !== currentProperty.mlsNumber)
    : similarActive;

  if (displayListings.length === 0 && soldComparables.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Similar Properties
              {useApiResults && (
                <span className="inline-flex items-center gap-1 ml-2 text-base font-normal text-primary">
                  <Sparkles className="w-4 h-4" />
                  AI-Matched
                </span>
              )}
            </h2>
            <p className="text-base text-muted-foreground">
              {useApiResults 
                ? "AI-powered similar property recommendations" 
                : "Explore similar listings and recent sales in the area"}
            </p>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2 px-6">
              <Home className="w-4 h-4" />
              {useApiResults ? "Similar Listings" : "Active Listings"} ({displayListings.length})
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex items-center gap-2 px-6">
              <TrendingUp className="w-4 h-4" />
              Sold Comparables ({soldComparables.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {displayListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayListings.map((property) => (
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
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No similar active listings found at this time.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {soldComparables.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {soldComparables.map((property) => (
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
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recently sold comparables found at this time.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
