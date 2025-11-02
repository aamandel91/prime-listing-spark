import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "./PropertyCard";
import { useRepliers } from "@/hooks/useRepliers";
import { RepliersProperty } from "@/types/repliers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Home } from "lucide-react";

interface SimilarPropertiesProps {
  currentProperty: RepliersProperty;
  className?: string;
}

export const SimilarProperties = ({ currentProperty, className = "" }: SimilarPropertiesProps) => {
  const { searchListings } = useRepliers();
  const [similarActive, setSimilarActive] = useState<RepliersProperty[]>([]);
  const [soldComparables, setSoldComparables] = useState<RepliersProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        setLoading(true);

        // Search parameters for similar properties
        const baseParams = {
          city: currentProperty.address.city,
          state: currentProperty.address.state,
          propertyType: currentProperty.details.propertyType,
          beds: currentProperty.details.numBedrooms,
          baths: currentProperty.details.numBathrooms,
          limit: 6,
        };

        // Calculate price range (±15%)
        const priceVariance = currentProperty.listPrice * 0.15;
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

        // Fetch sold comparables (last 6 months) - removed soldDateMin as not supported
        const soldResponse = await searchListings({
          ...baseParams,
          status: "Sold",
          minPrice,
          maxPrice,
        });

        setSoldComparables((soldResponse.listings || []).slice(0, 6));
      } catch (error) {
        console.error("Error fetching similar properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentProperty]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Similar Properties</CardTitle>
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Similar Properties & Comparables</CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore similar listings and recent sales in the area
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Active Listings ({similarActive.length})
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sold Comparables ({soldComparables.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {similarActive.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No similar active listings found
              </p>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {similarActive.map((property) => (
                    <CarouselItem key={property.mlsNumber} className="md:basis-1/2 lg:basis-1/3">
                      <PropertyCard property={property} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </TabsContent>

          <TabsContent value="sold" className="mt-6">
            {soldComparables.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No sold comparables found
              </p>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {soldComparables.map((property) => (
                    <CarouselItem key={property.mlsNumber} className="md:basis-1/2 lg:basis-1/3">
                      <PropertyCard property={property} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
