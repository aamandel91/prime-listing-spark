import { useState, useEffect } from "react";
import { useRepliers } from "@/hooks/useRepliers";
import { RepliersProperty, RepliersSearchParams } from "@/types/repliers";
import PropertyCard from "@/components/properties/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DynamicListingsSectionProps {
  apiFilters: RepliersSearchParams;
  title?: string;
  showPagination?: boolean;
}

export function DynamicListingsSection({ 
  apiFilters, 
  title = "Available Properties",
  showPagination = true 
}: DynamicListingsSectionProps) {
  const [listings, setListings] = useState<RepliersProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchListings } = useRepliers();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          ...apiFilters,
          page: currentPage,
          limit: 12,
        };

        const data = await searchListings(params);
        const listingsArray = data?.listings || data?.data || data || [];
        
        setListings(Array.isArray(listingsArray) ? listingsArray : []);
        setTotalPages(data?.numPages || 1);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching dynamic listings:', err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [apiFilters, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p>Error loading properties. Please try again later.</p>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-muted-foreground">No properties currently available matching these criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground">
          {listings.length} properties found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((property) => (
          <PropertyCard
            key={property.mlsNumber}
            id={property.mlsNumber}
            mlsNumber={property.mlsNumber}
            title={`${property.address.streetNumber} ${property.address.streetName}`}
            price={property.listPrice}
            image={property.images?.[0] || '/placeholder.svg'}
            beds={property.details.numBedrooms}
            baths={property.details.numBathrooms}
            sqft={typeof property.details.sqft === 'number' ? property.details.sqft : parseInt(property.details.sqft) || 0}
            address={`${property.address.streetNumber} ${property.address.streetName}`}
            city={property.address.city}
            state={property.address.state}
            zipCode={property.address.zip}
            status={property.standardStatus === 'Active Under Contract' ? 'under-contract' : null}
            avm={property.avm?.value}
          />
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
