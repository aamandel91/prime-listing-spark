import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRepliers } from "@/hooks/useRepliers";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchListings } = useRepliers();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch recent active listings from Florida
        const data = await searchListings({ 
          state: 'FL',
          status: 'A',
          limit: 6,
          sort: '-date'
        });
        
        const listings = data?.listings || data?.data || [];
        
        if (Array.isArray(listings) && listings.length > 0) {
          setProperties(listings);
        } else {
          setError("No properties found");
        }
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError("Unable to load properties. Please check your API configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Featured Properties
          </h2>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Featured Properties
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Please ensure your Repliers API key is configured in the backend settings.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property: any) => {
            const addressParts = [
              property.address?.streetNumber,
              property.address?.streetName,
              property.address?.streetSuffix
            ].filter(Boolean).join(' ');

            return (
              <PropertyCard
                key={property.mlsNumber}
                id={property.mlsNumber}
                title={addressParts || "Property"}
                price={property.listPrice || 0}
                image={
                  property.images?.[0]
                    ? `https://api.repliers.io/images/${property.images[0]}`
                    : "/placeholder.svg"
                }
                beds={property.details?.numBedrooms || 0}
                baths={property.details?.numBathrooms || 0}
                sqft={parseInt(property.details?.sqft || "0")}
                address={addressParts}
                city={property.address?.city || ""}
                state={property.address?.state || ""}
                zipCode={property.address?.zip || ""}
                mlsNumber={property.mlsNumber}
                officeId={property.office?.id}
              />
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/listings">
            <Button size="lg" className="bg-gradient-premium hover:opacity-90">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
